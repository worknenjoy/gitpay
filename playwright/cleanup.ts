import fs from 'fs'
import path from 'path'
import Models from '../src/models'

const models = Models as any
const SEED_FILE = path.join(__dirname, '.seed.json')

async function cleanup() {
  if (!fs.existsSync(SEED_FILE)) return

  const { userId, paymentRequestId, importPullRequestUserId } = JSON.parse(
    fs.readFileSync(SEED_FILE, 'utf-8')
  )
  await models.PaymentRequest.destroy({ where: { id: paymentRequestId } })
  await models.User.destroy({ where: { id: userId } })

  if (importPullRequestUserId) {
    // Payment requests created live by import-pull-request.spec.ts have no known id up
    // front (unlike the Whop fixture above) — clean up everything owned by that user instead.
    await models.PaymentRequest.destroy({ where: { userId: importPullRequestUserId } })

    // The User_Types join row must go first — deleting the user while it still exists
    // violates User_Types_UserId_fkey.
    const importPullRequestUser = await models.User.findByPk(importPullRequestUserId)
    if (importPullRequestUser) {
      await importPullRequestUser.setTypes([])
      await importPullRequestUser.destroy()
    }
  }

  fs.unlinkSync(SEED_FILE)
}

cleanup()
  .then(() => process.exit(0))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('playwright/cleanup.ts failed:', error)
    process.exit(1)
  })
