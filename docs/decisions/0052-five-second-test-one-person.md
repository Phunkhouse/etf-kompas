# 0052. The 5-second test, reduced to one person

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

SPEC §22 (Phase 3) asks for three people who do not invest: each sees only the hero for 5 seconds, and at least two must say what they get and that it costs nothing. David ran a reduced version with one person, because this is a test project and nobody else was at home. The person is David's partner, who does not invest and is not a developer; she is not named here. She saw two images of the real hero (375 x 667): variant a, then variant b.

## Decision

The result, in her words (Czech):

- What was the page about? "Srovnávač fondů"
- What would you get there? "Porovnání fondů, jejich poplatků a asi kde je koupím"
- What would it cost you? "To nevím, to jsem si nevšimla"
- (after variant b) Does this change what you think the page is about? "Jo, americké indexy z Česka na mě působí trochu ploše, zmínka o ceně mě zaujala víc"
- What stood out? "Rozhodně ta cena"

What she gets was understood, unprompted. That it is free was not: the line "Zdarma, bez registrace" under the button, then a muted 14 px caption, went unnoticed. So the test is not passed for the "free" half, and with one person it cannot meet the criterion of two of three in any case; it is a pilot. David concluded that the line should be more visible, and chose option B from a mockup of four (the current line, a darker one, black 16 px semibold, green with a check mark): ink colour, 16 px, semibold. Reason (David): the test showed it should be more visible, so a darker colour.

## Alternatives considered

- A darker colour at the same size, and a green line with a check mark: shown in the mockup, not chosen; David gave no reason against them.
- Three people, as SPEC §22 says: not done; David did not have them at hand.

## Consequences

- The "free" message is not shown to be understood yet; the new, bolder line is not tested. A second round with the new hero, ideally with two more people, would close the SPEC criterion.
- One person who saw variant b said the amount caught her attention more than the neutral headline. That is one anecdote, a faint support for hypothesis 2 of the A/B test (SPEC §11), not a result.
- She said "Americké indexy z Česka" felt "flat". The wording of variant a stays as it is until the A/B test or more feedback says otherwise.
