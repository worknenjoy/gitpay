import requestPromise from 'request-promise'

type PaypalConnectProps = {
  uri: string
  method?: string
  headers?: Record<string, string>
  body?: unknown
}

function getPaypalBasicAuthHeader(): string {
  const client = process.env.PAYPAL_CLIENT
  const secret = process.env.PAYPAL_SECRET

  if (!client || !secret) {
    throw new Error('Missing PAYPAL_CLIENT or PAYPAL_SECRET')
  }

  return 'Basic ' + Buffer.from(client + ':' + secret).toString('base64')
}

function resolvePaypalHostFromUri(uri: string): string {
  try {
    return new URL(uri).origin
  } catch {
    if (!process.env.PAYPAL_HOST) {
      throw new Error('Missing PAYPAL_HOST')
    }
    return process.env.PAYPAL_HOST
  }
}

async function requestPaypalOAuthToken(host: string) {
  return requestPromise({
    method: 'POST',
    uri: `${host}/v1/oauth2/token`,
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      Authorization: getPaypalBasicAuthHeader(),
      'Content-Type': 'application/json',
      grant_type: 'client_credentials'
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  })
}

async function fetchPaypalAccessToken(hostOrUri: string): Promise<string> {
  const host = hostOrUri.includes('://') ? resolvePaypalHostFromUri(hostOrUri) : hostOrUri

  const response = await requestPaypalOAuthToken(host)

  const accessToken = response?.access_token
  if (!accessToken) {
    throw new Error('PayPal access token missing in response')
  }

  return accessToken
}

function isOauthTokenEndpoint(uri: string): boolean {
  return /\/v1\/oauth2\/token\/?$/.test(uri)
}

export const PaypalConnect = async ({
  uri,
  method = 'POST',
  headers = {},
  body
}: PaypalConnectProps) => {
  if (isOauthTokenEndpoint(uri)) {
    const host = resolvePaypalHostFromUri(uri)
    return requestPaypalOAuthToken(host)
  }

  const token = await fetchPaypalAccessToken(uri)

  const response = await requestPromise({
    method,
    uri,
    headers: {
      Accept: '*/*',
      Prefer: 'return=representation',
      'Accept-Language': 'en_US',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      ...headers
    },
    body,
    json: true
  })

  return response
}
