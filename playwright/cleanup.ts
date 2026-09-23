import fs from 'fs'
import path from 'path'
import Models from '../src/models'

const models = Models as any
const SEED_FILE = path.join(__dirname, '.seed.json')

async function cleanup() {
  if (!fs.existsSync(SEED_FILE)) return

  const { userId, paymentRequestId } = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'))
  await models.PaymentRequest.destroy({ where: { id: paymentRequestId } })
  await models.User.destroy({ where: { id: userId } })
  fs.unlinkSync(SEED_FILE)
}

cleanup()
  .then(() => process.exit(0))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('playwright/cleanup.ts failed:', error)
    process.exit(1)
  })
