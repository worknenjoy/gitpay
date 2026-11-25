import { Inngest } from 'inngest'

// Reads INNGEST_EVENT_KEY / INNGEST_SIGNING_KEY from the environment.
// Set INNGEST_DEV=1 locally to talk to the Inngest Dev Server (npx inngest-cli dev).
export const inngest = new Inngest({ id: 'gitpay' })

export const isInngestEnabled = () => process.env.INNGEST_ENABLED === 'true'
