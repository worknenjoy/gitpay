require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'], // <— important
  ignore: [/node_modules/],
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties'],
})

const fs = require('node:fs')
const path = require('node:path')
const React = require('react')

// react-router v6 helpers to turn JSX into route objects
// If you're on v6.4+, createRoutesFromChildren is in 'react-router'
let createRoutesFromChildren
try {
  ;({ createRoutesFromChildren } = require('react-router'))
} catch {
  // Fallback if not available; we'll handle object routes only
  createRoutesFromChildren = null
}

const { Readable } = require('node:stream')
const { SitemapStream } = require('sitemap')

// 1) Load your export
const routesExport = require('./src/main/routes-sitemap')
const exported = routesExport.default || routesExport

// 2) Normalize to an array of route objects
function normalizeToObjects(input) {
  // Case A: already an array/object of route objects
  if (Array.isArray(input)) return input
  if (input && typeof input === 'object' && !React.isValidElement(input)) {
    return [input]
  }

  // Case B: JSX tree <Routes> / <Route>
  if (React.isValidElement(input)) {
    if (!createRoutesFromChildren) {
      console.warn(
        '⚠️ createRoutesFromChildren not available. Export route objects instead of JSX.',
      )
      return []
    }
    return createRoutesFromChildren(input.props?.children ?? input)
  }

  console.warn('⚠️ Unrecognized routes export. Expected route objects or JSX tree.')
  return []
}

// 3) Collect paths (supports v6: path, index, children)
const joinUrl = (...parts) =>
  ('/' + parts.filter(Boolean).join('/')).replace(/\/+/g, '/').replace(/\/$/, '') || '/'

function collectPathsV6(nodes, base = '') {
  const out = []

  for (const node of nodes || []) {
    const hasPath = typeof node.path === 'string' && node.path.length > 0
    const isIndex = !!node.index

    if (isIndex) {
      // index route => same URL as the parent "base"
      const url = base || '/'
      if (url && !out.includes(url)) out.push(url)
    }

    let current = base || '/'
    if (hasPath) {
      if (!node.path.includes('*')) {
        current = joinUrl(base, node.path)
        if (!out.includes(current)) out.push(current)
      }
    }

    // descend into children
    const kids = node.children || []
    out.push(...collectPathsV6(kids, current))
  }

  return out
}

// 4) Build list (normalize + collect)
const routeObjs = normalizeToObjects(exported)
let rawPaths = Array.from(new Set(collectPathsV6(routeObjs))).sort()

// Always include root if applicable
if (!rawPaths.includes('/')) rawPaths.unshift('/')

// 5) Expand dynamic params if you have them
// Example: { '/task/:id': ['123','456'] }
const PARAM_MAP = {
  // '/blog/:slug': ['post-1','post-2'],
}

function expandParams(paths) {
  const result = new Set()

  for (const p of paths) {
    if (!p.includes(':')) {
      result.add(p)
      continue
    }

    const patternKey = Object.keys(PARAM_MAP).find((k) => {
      const a = k.split('/').filter(Boolean)
      const b = p.split('/').filter(Boolean)
      if (a.length !== b.length) return false
      return a.every((seg, i) => seg.startsWith(':') || seg === b[i])
    })

    const values = patternKey ? PARAM_MAP[patternKey] : []
    if (!values.length) continue

    const tplSegs = patternKey.split('/').filter(Boolean)
    for (const val of values) {
      let vi = 0
      const filled = tplSegs
        .map((seg) => (seg.startsWith(':') ? (Array.isArray(val) ? val[vi++] : val) : seg))
        .join('/')
      result.add('/' + filled)
    }
  }

  return Array.from(result)
}

const expanded = expandParams(rawPaths)
const finalPaths = expanded.length
  ? Array.from(new Set([...rawPaths.filter((p) => !p.includes(':')), ...expanded])).sort()
  : rawPaths

// Debug: see what we found
console.log('🔎 Routes found:', finalPaths.length)
for (const u of finalPaths) console.log(' •', u)

// 6) Write sitemap.xml
const hostname = 'https://gitpay.me'
const links = finalPaths.map((url) => ({
  url,
  changefreq: 'weekly',
  priority: url === '/' ? 1.0 : 0.7,
}))

const outDir = path.resolve(__dirname, 'public')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const outFile = path.join(outDir, 'sitemap.xml')
const smStream = new SitemapStream({ hostname })
const writeStream = fs.createWriteStream(outFile)

Readable.from(links).pipe(smStream).pipe(writeStream)

writeStream.on('finish', () => {
  console.log(`✅ sitemap.xml written: ${outFile}`)
})
writeStream.on('error', (e) => {
  console.error('❌ Failed to write sitemap:', e)
})
