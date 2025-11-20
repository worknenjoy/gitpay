const readline = require('readline')
const webhookPlatform = require('../modules/app/controllers/webhooks/webhook-platform')
const webhookConnect = require('../modules/app/controllers/webhooks/webhook-connect')
console.log('environment', process.env.NODE_ENV)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let step = 0
let eventSource = ''
let json = ''

console.log('👉 Step 1: Is this a platform or connect event? (type `platform` or `connect`)')

rl.on('line', (line) => {
  if (step === 0) {
    eventSource = line.trim().toLowerCase()
    if (!['platform', 'connect'].includes(eventSource)) {
      console.log('❌ Invalid source. Must be `platform` or `connect`.')
      rl.close()
    } else {
      step++
      console.log(
        '👉 Step 2: Paste the full event JSON and press Enter + Ctrl+D (or Ctrl+Z on Windows):'
      )
    }
  } else {
    json += line
  }
})

rl.on('close', async () => {
  if (!eventSource) return

  try {
    const event = JSON.parse(json)
    console.log(`📦 Event type: ${event.type}`)
    console.log(`🔗 Using ${eventSource} handler...`)

    const res = {
      status: (code) => ({
        send: (output) => console.log(`Response status: ${code}`, output),
        json: (output) => console.log(`✅ Response [${code}]:`, output)
      })
    }

    const mockReq = {
      body: event,
      headers: { 'stripe-signature': 'test_signature' } // not verified, just for mock
    }

    const handler =
      eventSource === 'platform' ? webhookPlatform.webhookPlatform : webhookConnect.webhookConnect
    const result = await handler(mockReq, res)

    if (result !== undefined) {
      console.log('✅ Handler executed successfully:', result)
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
    console.error(err)
  }
})
