const paypal = require('@paypal/paypal-server-sdk')
const readline = require('readline')

// Replace with your actual client ID and client secret
const clientId = process.env.PAYPAL_CLIENT
const clientSecret = process.env.PAYPAL_SECRET

// Initialize the PayPal client with the correct credentials
const client = new paypal.Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: clientId,
    oAuthClientSecret: clientSecret,
  },
})

// Create readline interface for input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Function to get the authorization status
async function getAuthorizationStatus(authorizationId) {
  try {
    // Use the PaymentsController directly to create a request (based on the available structure)
    const request = new paypal.PaymentsController(client)

    const response = await request.getAuthorizedPayment({ authorizationId })

    // Output the authorization status
    console.log('Authorization Status:', response.result.state) // Authorization state
    console.log('Full Authorization Details:', response.result) // The response will contain the full details

    const captured = await request.captureAuthorizedPayment({ authorizationId })
    console.log('Captured Payment:', captured.result)
    console.log('Capture Status:', captured.result.state) // Capture state
  } catch (error) {
    console.error('Error:', error)
  }
}

// Ask for the authorization ID
rl.question('Enter Authorization ID: ', (authorizationId) => {
  if (authorizationId) {
    // Fetch the authorization status
    getAuthorizationStatus(authorizationId)
  } else {
    console.log('Authorization ID is required.')
  }

  // Close the readline interface
  rl.close()
})
