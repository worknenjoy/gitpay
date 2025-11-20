// simulatePayout.js
const readline = require('readline')
const payoutPaid = require('../modules/webhooks/payoutPaid')

process.stdin.setEncoding('utf8')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('📥 Paste your payout event JSON, then press Enter and Ctrl+D (or Ctrl+Z on Windows):')

let json = ''

rl.on('line', (line) => {
  json += line
})

rl.on('close', async () => {
  try {
    const event = JSON.parse(json)
    console.log('📦 Event received:', event)
    const result = await payoutPaid(event, {
      status: (code) => {
        return {
          json: (res) => console.log(`Response status: ${code}`)
        }
      }
    })
    console.log('✅ Handler executed successfully:', result)
  } catch (err) {
    console.error('❌ Error processing event:', err.message)
    console.error(err)
  }
})
