#!/usr/bin/env python3
"""Turns Claude Code session transcripts (.jsonl) into readable Markdown files.

usage: python3 convert_transcripts.py OUT_DIR TRANSCRIPT_DIR [TRANSCRIPT_DIR ...]

What is kept: every user message, every assistant text, every tool call (one line:
the tool and its main argument) and the start of every tool result. What is left out:
the system reminders the app adds to messages (instructions, memory, git status),
thinking blocks, images and attachments, and the long tail of big tool results.
Secrets and personal data are redacted (see REDACTIONS); the counts are printed.
This is a conversion of the stored transcripts, not the output of `/export`.
Standard library only.
"""
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime

RESULT_LIMIT = 700  # characters of a tool result that are kept
INPUT_LIMIT = 400  # characters of a tool call that are kept
TEXT_LIMIT = 40000  # one huge pasted message is cut here

# (name, pattern, replacement). Order matters: the specific ones come first.
REDACTIONS = [
    ('private key', re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----.*?-----END [A-Z ]*PRIVATE KEY-----', re.S), '[REDACTED private key]'),
    ('jwt', re.compile(r'\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'), '[REDACTED jwt]'),
    ('api key (sk-)', re.compile(r'\bsk-[A-Za-z0-9_-]{16,}'), '[REDACTED key]'),
    ('supabase key', re.compile(r'\bsb(?:p|_secret|_publishable)_[A-Za-z0-9_-]{16,}'), '[REDACTED key]'),
    ('resend key', re.compile(r'\bre_[A-Za-z0-9_]{20,}'), '[REDACTED key]'),
    ('github token', re.compile(r'\b(?:ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}'), '[REDACTED token]'),
    ('meta/graph token', re.compile(r'\bEAA[A-Za-z0-9]{40,}'), '[REDACTED token]'),
    ('google key', re.compile(r'\bAIza[0-9A-Za-z_-]{30,}'), '[REDACTED key]'),
    ('bearer', re.compile(r'(Bearer\s+)[A-Za-z0-9._~+/=-]{20,}'), r'\1[REDACTED]'),
    (
        'secret assignment',
        re.compile(
            r'((?:SECRET|TOKEN|PASSWORD|API_KEY|PRIVATE_KEY|SIGNING_SECRET|ACCESS_KEY)[A-Z_]*\s*[=:]\s*)["\']?[A-Za-z0-9_./+=-]{16,}["\']?'
        ),
        r'\1[REDACTED]',
    ),
    (
        'e-mail',
        re.compile(
            r'\b(?!noreply@|jmeno@domena|you@|user@|test@|email@)[A-Za-z0-9._%+-]+@(?!users\.noreply\.github\.com|example\.|anthropic\.com)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
        ),
        '[email]',
    ),
]

REMINDER = re.compile(r'<system-reminder>.*?</system-reminder>', re.S)
COMMAND_NOISE = re.compile(r'<(?:local-command-stdout|command-name|command-message|command-args)>.*?</(?:local-command-stdout|command-name|command-message|command-args)>', re.S)

counts = Counter()

# Titles of the sessions that were started by a relayed note, written by hand from the
# first message (their own first line is a long instruction with paths).
TITLES = {
    'fee83d4f-838b-411e-a295-563dc9016a54': 'Remote Control: kickstart the project in a new subfolder',
    '8427587f-c1bd-4f5c-a553-caf2a971a5b6': 'Remote Control: the wireframes document into the repo (docs PR)',
    '3d90ba27-8d56-4429-bb5e-97b45e840bad': 'Remote Control: wireframes rev. 2 and the design docs, updated over three days',
    '1aebfb9f-75a0-424f-9b44-99536804f54e': 'Remote Control: docs-only PR for the rev. 4 wireframes',
    '6311fcaf-0733-4ba8-a50b-83157bb4cbc7': 'Remote Control: read-only check of the README and the A/B hero code',
}

INTRO = '''# AI log: the Claude Code conversations

Every Claude Code session of this project, in the order they started. The written summary, with the prompts and every mistake the AI made, is [docs/AI-LOG.md](../docs/AI-LOG.md); these files are the conversations themselves.

**How they were made.** The files are converted from the transcripts that Claude Code stores on the author's computer (`~/.claude/projects/`), by [convert_transcripts.py](convert_transcripts.py) (standard library only). They are **not the output of the `/export` command**: `/export` writes one conversation at a time, and this folder covers all of them. Kept: every message of David and of Claude, every tool call (the tool and its main argument) and the start of every tool result. Left out: the system reminders the app adds to messages, thinking, images and the long tail of big tool results. Secrets and e-mail addresses are redacted by pattern (`[REDACTED ...]`, `[email]`); the author read the result before it was committed.

**What the sessions are.** The "Phase" sessions are the planned phases of the project (SPEC section 20). The "Remote Control" sessions were started from a coordinating Claude conversation on claude.ai, which relayed a task (a pull request, a read-only check) to Claude Code on this computer; their first message is that relayed note, written by the coordinator, not by David. The last session is the one in which this folder was made, so it ends at the moment of the conversion.

**Not here.** A few later fixes were made with another coding agent (Codex), which does not keep Claude Code transcripts; they are in the git history. Three sessions of another project (`lucys-bookshop`) are not part of this repository and are left out.

'''


def redact(text):
    for name, pattern, repl in REDACTIONS:
        text, n = pattern.subn(repl, text)
        if n:
            counts[name] += n
    return text


def clip(text, limit):
    text = text.strip()
    if len(text) <= limit:
        return text
    return f'{text[:limit]} [... {len(text) - limit} more characters]'


def fence(text):
    # a fence longer than any run of backticks inside the text
    longest = max((len(m) for m in re.findall(r'`+', text)), default=0)
    ticks = '`' * max(3, longest + 1)
    return f'{ticks}\n{text}\n{ticks}'


def tool_summary(block):
    name = block.get('name', 'tool')
    data = block.get('input') or {}
    main = ''
    for key in ('command', 'file_path', 'path', 'url', 'query', 'pattern', 'prompt', 'description', 'title', 'skill', 'action'):
        if isinstance(data.get(key), str) and data[key].strip():
            main = f'{key}: {data[key]}'
            break
    if not main and data:
        main = json.dumps(data, ensure_ascii=False)
    return f'{name}  {clip(main.replace(chr(10), " ⏎ "), INPUT_LIMIT)}'


def result_text(block):
    content = block.get('content')
    if isinstance(content, str):
        return content
    parts = []
    for item in content or []:
        if isinstance(item, dict) and item.get('type') == 'text':
            parts.append(item.get('text', ''))
        elif isinstance(item, dict) and item.get('type') == 'image':
            parts.append('[image]')
    return '\n'.join(parts)


def convert(path):
    title, first_prompt, session_id = None, None, None
    first_ts = last_ts = None
    branches = []
    cwds = set()
    turns = []  # (who, markdown)
    n_user = n_assistant = n_tools = 0
    for line in open(path, encoding='utf-8'):
        try:
            o = json.loads(line)
        except Exception:
            continue
        kind = o.get('type')
        if kind == 'ai-title' and o.get('aiTitle'):
            title = o['aiTitle']
        if kind not in ('user', 'assistant'):
            continue
        session_id = session_id or o.get('sessionId')
        ts = o.get('timestamp')
        if ts:
            first_ts = first_ts or ts
            last_ts = ts
        if o.get('cwd'):
            cwds.add(o['cwd'])
        branch = o.get('gitBranch')
        if branch and (not branches or branches[-1] != branch):
            branches.append(branch)
        side = ' (subagent)' if o.get('isSidechain') else ''
        message = o.get('message') or {}
        content = message.get('content')
        if isinstance(content, str):
            content = [{'type': 'text', 'text': content}]
        out = []
        for block in content or []:
            btype = block.get('type')
            if btype == 'text':
                text = COMMAND_NOISE.sub('', REMINDER.sub('', block.get('text', ''))).strip()
                if not text:
                    continue
                text = redact(clip(text, TEXT_LIMIT))
                out.append(text)
            elif btype == 'tool_use':
                n_tools += 1
                out.append('`' + redact(tool_summary(block)).replace('`', "'") + '`')
            elif btype == 'tool_result':
                text = REMINDER.sub('', result_text(block)).strip()
                if text:
                    out.append(fence(redact(clip(text, RESULT_LIMIT))))
        if not out:
            continue
        who = 'David' if kind == 'user' and not any(b.get('type') == 'tool_result' for b in (content or [])) else None
        if kind == 'user' and who is None:
            who = 'Tool result'
        if kind == 'assistant':
            who = 'Claude'
            n_assistant += 1
        elif who == 'David':
            n_user += 1
            if first_prompt is None:
                first_prompt = out[0]
        stamp = ts[11:16] if ts else ''
        turns.append((f'{who}{side}', stamp, '\n\n'.join(out)))
    if first_prompt and first_prompt.lstrip().startswith('<relay'):
        note = re.search(r'<note>\s*(.*?)\s*(?:</note>|$)', first_prompt, re.S)
        body = (note.group(1) if note else first_prompt).split('\n')[0]
        title = 'Remote Control: ' + body[:80]
    session_id = session_id or os.path.basename(path)[:-6]
    if session_id in TITLES:
        title = TITLES[session_id]
    return {
        'path': path,
        'session_id': session_id,
        'title': title or (first_prompt or 'session').split('\n')[0][:70],
        'first': first_ts,
        'last': last_ts,
        'branches': branches,
        'cwds': sorted(cwds),
        'turns': turns,
        'n_user': n_user,
        'n_assistant': n_assistant,
        'n_tools': n_tools,
    }


def slug(text):
    text = re.sub(r'[^a-z0-9]+', '-', text.lower().encode('ascii', 'ignore').decode()).strip('-')
    return text[:40] or 'session'


def day(ts):
    return ts[:10] if ts else 'undated'


def write(session, out_dir, number):
    name = f'{number:02d}-{day(session["first"])}-{slug(session["title"])}.md'
    lines = [
        f'# {redact(session["title"])}',
        '',
        f'- Session: `{session["session_id"]}`',
        f'- From {session["first"]} to {session["last"]} (UTC)',
        f'- Folder: {", ".join(session["cwds"])}',
        f'- Git branches seen: {", ".join(session["branches"][:12]) or "none"}{" ..." if len(session["branches"]) > 12 else ""}',
        f'- {session["n_user"]} messages from David, {session["n_assistant"]} from Claude, {session["n_tools"]} tool calls',
        '',
        '> Converted from the stored transcript (not the output of `/export`): system reminders, thinking, images and the long tail of big tool results are left out; secrets and e-mail addresses are redacted.',
        '',
        '---',
        '',
    ]
    for who, stamp, text in session['turns']:
        lines.append(f'### {who} {stamp}'.rstrip())
        lines.append('')
        lines.append(text)
        lines.append('')
    with open(os.path.join(out_dir, name), 'w', encoding='utf-8') as handle:
        handle.write('\n'.join(lines))
    return name


def main():
    out_dir = sys.argv[1]
    folders = sys.argv[2:]
    os.makedirs(out_dir, exist_ok=True)
    sessions = []
    for folder in folders:
        for entry in sorted(os.listdir(folder)):
            if entry.endswith('.jsonl'):
                sessions.append(convert(os.path.join(folder, entry)))
    sessions = [s for s in sessions if s['turns']]
    sessions.sort(key=lambda s: s['first'] or '')
    rows = []
    for number, session in enumerate(sessions, 1):
        name = write(session, out_dir, number)
        size = os.path.getsize(os.path.join(out_dir, name)) // 1024
        rows.append((number, day(session['first']), day(session['last']), session['title'], name, session['n_user'], session['n_assistant'], size))
        print(f'{name}  {size} KB', file=sys.stderr)
    with open(os.path.join(out_dir, 'README.md'), 'w', encoding='utf-8') as handle:
        handle.write(INTRO)
        handle.write('| # | Dates | Session | Messages (David / Claude) | Size |\n| --- | --- | --- | --- | --- |\n')
        for number, first, last, title, name, n_user, n_assistant, size in rows:
            dates = first if first == last else f'{first} to {last}'
            handle.write(f'| {number} | {dates} | [{redact(title).replace("|", "/")}]({name}) | {n_user} / {n_assistant} | {size} KB |\n')
    print('redactions:', dict(counts), file=sys.stderr)


if __name__ == '__main__':
    main()
