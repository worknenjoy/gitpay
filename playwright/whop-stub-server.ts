import http from 'http'

const PORT = 4310

/**
 * Fakes just enough of Whop's REST API for the Import Pull Request e2e flow to create a
 * real payment request end-to-end. The real Whop client (src/providers/whop/client.ts)
 * already resolves its base URL from WHOP_API_BASE_URL, so pointing that env var at this
 * server (see playwright.config.js) requires no changes to any production code — this is
 * the same "external service base URL is configurable" seam that already lets WHOP_SANDBOX
 * point at Whop's real sandbox for manual testing, just pointed at a local fake instead.
 *
 * Playwright's backend process (src/index.ts) is spawned separately from the test runner
 * (see playwright.config.js's webServer), so nock — used throughout test/api/** — has
 * nothing to patch there; page.route() also doesn't apply since this call is made
 * server-side, never by the browser. A real local HTTP server is the standard fix for
 * exactly this shape of problem.
 */
function send(res: http.ServerResponse, status: number, body: unknown) {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json)
  })
  res.end(json)
}

const server = http.createServer((req, res) => {
  let raw = ''
  req.on('data', (chunk) => {
    raw += chunk
  })
  req.on('end', () => {
    const path = (req.url || '').split('?')[0]

    if (req.method === 'POST' && path === '/products') {
      return send(res, 200, { id: 'prod_stub_123' })
    }

    if (req.method === 'POST' && path === '/checkout_configurations') {
      return send(res, 200, {
        plan: { id: 'plan_stub_123' },
        purchase_url: 'https://whop.test/checkout/plan_stub_123'
      })
    }

    // Anything else (e.g. a PATCH from an activate/deactivate step this flow doesn't
    // exercise) — a permissive default keeps this stub from being a maintenance burden
    // every time WhopPaymentProvider adds a call the two Import PR tests don't reach.
    // eslint-disable-next-line no-console
    console.log(`[whop-stub] unhandled ${req.method} ${path}`, raw)
    return send(res, 200, {})
  })
})

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Whop stub server listening on port ${PORT}`)
})
