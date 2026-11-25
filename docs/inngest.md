# Inngest (scheduled jobs and workflows)

Gitpay is moving scheduled jobs and lifecycle workflows from in-process `cron` jobs ([src/crons/cron.ts](../src/crons/cron.ts)) to [Inngest](https://www.inngest.com).

The function code lives in this repo under [src/inngest/](../src/inngest/) and runs inside the Express app at `/api/inngest`. Inngest (Cloud, or the local Dev Server) only stores events and state, keeps the schedule, and calls that endpoint when a function or step should run.

## What runs on Inngest today

| Function | Triggers | Replaces |
|---|---|---|
| `sync-stats` ([syncStats.ts](../src/inngest/functions/syncStats.ts)) | cron `0 0 * * *` UTC, event `stats/sync.requested` | `TaskCron.syncStats` in `dailyJob` |

Everything is behind `INNGEST_ENABLED`:
- **unset or `false`:** `/api/inngest` is not mounted and the legacy cron runs these jobs, exactly as before.
- **`true`:** `/api/inngest` is mounted, Inngest owns these jobs, and the legacy cron skips them, so nothing runs twice.

## Local development

1. Add these to `.env`:
   ```
   INNGEST_ENABLED=true
   INNGEST_DEV=1
   ```
2. Start the API: `npm run start:dev` (port 3000).
3. Start the Dev Server in another terminal:
   ```bash
   npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
   ```
4. Open http://localhost:8288. Under **Functions** you should see `sync-stats`. Send the event `stats/sync.requested` (or click **Invoke**) and follow the run's steps (`sync-info`, then `mail-new-users`) under **Runs**.

## Production (Inngest Cloud)

1. Create an app in Inngest Cloud (the free Hobby plan is enough to start) and copy the event key and signing key.
2. Set the Heroku config vars `INNGEST_ENABLED=true`, `INNGEST_EVENT_KEY`, and `INNGEST_SIGNING_KEY`.
3. Deploy, then in the Inngest dashboard go to **Apps → Sync new app** and enter `https://<api-host>/api/inngest`. Sync again after deploys that add or change functions.
4. **Rollback:** set `INNGEST_ENABLED=false`. The legacy cron takes the jobs back.

## Adding a function

1. Create it in `src/inngest/functions/`, keeping the handler exported separately so it can be unit-tested with a fake `step` (see [test/api/inngest/syncStats.test.ts](../test/api/inngest/syncStats.test.ts)).
2. Register it in [src/inngest/index.ts](../src/inngest/index.ts).
3. If it replaces a cron job, skip that job in `cron.ts` when `isInngestEnabled()` is true.

SDK note: the Inngest Dev Server and Cloud refuse to sync apps on SDK versions below 3.54.0. The SDK (`inngest@3.54.x`) needs TypeScript 5.8 or newer, so the repo's TypeScript is pinned to 5.8.3.
