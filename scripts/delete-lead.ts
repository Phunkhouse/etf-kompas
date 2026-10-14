// Erasure on request: deletes one lead, its result links and the events of its
// session, whatever its dates say. Run by hand against the real database:
//   pnpm lead:delete jana@example.cz
// It reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env.local. The automatic purge is
// /api/purge (src/server/retention.ts); this is the manual path of the same rules.
import { eventEnv } from '@/config/env'
import { deleteLeadByEmail } from '@/server/retention'
import { createSupabaseStore } from '@/server/supabase-store'

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: pnpm lead:delete <e-mail>')
    process.exit(2)
  }
  const env = eventEnv()
  if (env.LEAD_STORE !== 'supabase') {
    console.error('LEAD_STORE is "memory": there is nothing to delete.')
    process.exit(2)
  }
  const { store, retention } = createSupabaseStore({
    url: env.SUPABASE_URL,
    secretKey: env.SUPABASE_SECRET_KEY,
  })
  // The address is not repeated in the output.
  const outcome = await deleteLeadByEmail(email, { store, retention })
  console.log(outcome === 'deleted' ? 'Deleted.' : 'No lead with that address.')
  process.exit(outcome === 'deleted' ? 0 : 1)
}

main().catch(() => {
  console.error('The lead could not be deleted. Check the Supabase settings.')
  process.exit(2)
})
