import moment from 'moment'
import { Op } from 'sequelize'
import Models from '../../../models'

const models = Models as any
const { Task, History, Order, Wallet, WalletOrder, User } = models

// === Console helpers (same as balance_summary.ts) ===
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')
const visibleLen = (s: string) => stripAnsi(s).length
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
const termWidth = () => clamp(process.stdout.columns ?? 160, 60, 220)

type Align = 'left' | 'right' | 'center'
const padTo = (s: string, w: number, align: Align = 'left') => {
  const len = visibleLen(s)
  if (len >= w) return s
  const pad = w - len
  if (align === 'right') return `${' '.repeat(pad)}${s}`
  if (align === 'center') {
    const left = Math.floor(pad / 2)
    const right = pad - left
    return `${' '.repeat(left)}${s}${' '.repeat(right)}`
  }
  return `${s}${' '.repeat(pad)}`
}
const truncate = (s: string, w: number) => {
  if (w <= 0) return ''
  if (visibleLen(s) <= w) return s
  if (w <= 1) return stripAnsi(s).slice(0, 1)
  const raw = stripAnsi(s)
  return `${raw.slice(0, Math.max(0, w - 1))}…`
}

type TableColumn<Row extends Record<string, any>> = {
  key: keyof Row
  header: string
  align?: Align
  minWidth?: number
  maxWidth?: number
}

function printTable<Row extends Record<string, any>>(
  title: string,
  columns: Array<TableColumn<Row>>,
  rows: Row[],
  opts?: { maxWidth?: number }
) {
  const maxWidth = opts?.maxWidth ?? termWidth()
  const colWidths = columns.map((c) => {
    const headerLen = visibleLen(c.header)
    const cellMax = rows.reduce((m, r) => {
      const v = r[c.key]
      const s = v === null || v === undefined ? '' : String(v)
      return Math.max(m, visibleLen(s))
    }, 0)
    const base = Math.max(headerLen, cellMax, c.minWidth ?? 0)
    return clamp(base, c.minWidth ?? 0, c.maxWidth ?? 999)
  })

  const tableOverhead = 1 + columns.length * 3
  const totalWidth = () => tableOverhead + colWidths.reduce((a, b) => a + b, 0)
  while (totalWidth() > maxWidth) {
    let widestIdx = -1
    let widest = 0
    for (let i = 0; i < colWidths.length; i++) {
      const min = columns[i].minWidth ?? 0
      if (colWidths[i] > min && colWidths[i] > widest) {
        widest = colWidths[i]
        widestIdx = i
      }
    }
    if (widestIdx === -1) break
    colWidths[widestIdx] -= 1
  }

  const top = '┌' + colWidths.map((w) => '─'.repeat(w + 2)).join('┬') + '┐'
  const mid = '├' + colWidths.map((w) => '─'.repeat(w + 2)).join('┼') + '┤'
  const bottom = '└' + colWidths.map((w) => '─'.repeat(w + 2)).join('┴') + '┘'

  console.log('')
  console.log(`${C.bold}${title}${C.reset}`)
  console.log(`${C.gray}${top}${C.reset}`)
  const headerRow =
    '│' +
    columns
      .map((c, i) => {
        const cell = padTo(truncate(c.header, colWidths[i]), colWidths[i], 'center')
        return ` ${cell} `
      })
      .join('│') +
    '│'
  console.log(`${C.gray}${headerRow}${C.reset}`)
  console.log(`${C.gray}${mid}${C.reset}`)

  if (rows.length === 0) {
    const empty =
      '│' +
      padTo(
        `${C.dim}(no rows)${C.reset}`,
        colWidths.reduce((a, b) => a + b, 0) + 3 * columns.length - 1
      ) +
      '│'
    console.log(empty)
  } else {
    for (const r of rows) {
      const line =
        '│' +
        columns
          .map((c, i) => {
            const raw = r[c.key]
            const cellStr = raw === null || raw === undefined ? '' : String(raw)
            const cell = padTo(truncate(cellStr, colWidths[i]), colWidths[i], c.align ?? 'left')
            return ` ${cell} `
          })
          .join('│') +
        '│'
      console.log(line)
    }
  }
  console.log(`${C.gray}${bottom}${C.reset}`)
}

const toCents = (n: number) => Math.round((Number(n) || 0) * 100)
const formatUSD = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

// === Helpers ===

const parseNewValue = (v: any): string => {
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

const isTruthyDbValue = (v: string): boolean => {
  const s = v.trim().toLowerCase()
  if (!s) return false
  if (s === 'null' || s === 'undefined') return false
  if (s === '0' || s === 'false') return false
  return true
}

function feeMultiplierForWalletSpend(amountUsd: number): number {
  return amountUsd >= 5000 ? 1 : 1.08
}

async function loadTaskEndPendingAt(taskIds: number[]): Promise<Map<number, Date | null>> {
  if (taskIds.length === 0) return new Map()

  const histories: Array<any> = await History.findAll({
    where: {
      TaskId: { [Op.in]: taskIds },
      fields: {
        [Op.overlap]: ['paid', 'transfer_id', 'TransferId']
      }
    },
    attributes: ['TaskId', 'fields', 'newValues', 'createdAt'],
    order: [
      ['TaskId', 'ASC'],
      ['createdAt', 'ASC']
    ]
  })

  const paidAtByTask = new Map<number, Date>()
  const transferredAtByTask = new Map<number, Date>()

  for (const h of histories) {
    const taskId = Number(h?.TaskId)
    if (!Number.isFinite(taskId)) continue
    const createdAt: Date | undefined = h?.createdAt
    if (!createdAt) continue

    const fields: string[] = Array.isArray(h?.fields) ? h.fields : []
    const newValues: any[] = Array.isArray(h?.newValues) ? h.newValues : []

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const nv = parseNewValue(newValues[i])

      if (field === 'paid' && nv.toLowerCase() === 'true') {
        const existing = paidAtByTask.get(taskId)
        if (!existing || createdAt < existing) paidAtByTask.set(taskId, createdAt)
      }

      if ((field === 'transfer_id' || field === 'TransferId') && isTruthyDbValue(nv)) {
        const existing = transferredAtByTask.get(taskId)
        if (!existing || createdAt < existing) transferredAtByTask.set(taskId, createdAt)
      }
    }
  }

  const out = new Map<number, Date | null>()
  for (const id of taskIds) {
    const paidAt = paidAtByTask.get(id) || null
    const transferAt = transferredAtByTask.get(id) || null
    const endPendingAt =
      paidAt && transferAt ? (paidAt < transferAt ? paidAt : transferAt) : paidAt || transferAt
    out.set(id, endPendingAt)
  }
  return out
}

function isTaskPendingAsOf(
  task: any,
  endPendingAt: Date | null | undefined,
  asOfExclusive: Date
): boolean {
  const createdAt: Date | undefined = task?.createdAt
  if (!createdAt) return false
  if (createdAt >= asOfExclusive) return false

  if (endPendingAt && endPendingAt < asOfExclusive) return false

  const paidNow = Boolean(task?.paid)
  const transferredNow = Boolean(task?.transfer_id) || Boolean(task?.TransferId)
  if (paidNow || transferredNow) {
    const updatedAt: Date | undefined = task?.updatedAt
    if (updatedAt && updatedAt < asOfExclusive) return false
  }

  return true
}

async function buildStripeChargeIdsByTask(taskIds: number[]): Promise<Map<number, string[]>> {
  if (taskIds.length === 0) return new Map()

  const orders: Array<any> = await Order.findAll({
    where: {
      TaskId: { [Op.in]: taskIds },
      provider: 'stripe',
      status: 'succeeded'
    },
    attributes: ['TaskId', 'source_id', 'source_type', 'source', 'paid', 'createdAt']
  })

  const chargeIdsByTask = new Map<number, Set<string>>()

  for (const o of orders) {
    const taskId = Number(o?.TaskId)
    if (!Number.isFinite(taskId)) continue

    const candidates: string[] = []

    if (typeof o?.source_id === 'string' && o.source_id.startsWith('ch_')) {
      candidates.push(o.source_id)
    }

    if (typeof o?.source === 'string' && o.source.startsWith('ch_')) {
      candidates.push(o.source)
    }

    if (candidates.length === 0) continue

    if (!chargeIdsByTask.has(taskId)) chargeIdsByTask.set(taskId, new Set())
    const set = chargeIdsByTask.get(taskId)!
    for (const c of candidates) set.add(c)
  }

  const out = new Map<number, string[]>()
  for (const [taskId, set] of chargeIdsByTask.entries()) {
    out.set(taskId, [...set].sort())
  }
  return out
}

async function buildWalletBalanceByUserAsOf(
  asOfExclusive: Date,
  walletToUser: Map<number, number>
): Promise<Map<number, number>> {
  const [walletAdds, walletSpends] = await Promise.all([
    WalletOrder.findAll({
      where: {
        status: 'paid',
        createdAt: { [Op.lt]: asOfExclusive }
      },
      attributes: ['walletId', 'amount', 'createdAt'],
      order: [['createdAt', 'ASC']]
    }),
    Order.findAll({
      where: {
        provider: 'wallet',
        source_type: 'wallet-funds',
        status: 'succeeded',
        createdAt: { [Op.lt]: asOfExclusive }
      },
      attributes: ['source_id', 'amount', 'createdAt'],
      order: [['createdAt', 'ASC']]
    })
  ])

  const centsByUser = new Map<number, number>()

  for (const a of walletAdds) {
    const walletId = Number(a?.walletId)
    const userId = walletToUser.get(walletId)
    if (!userId) continue
    const delta = Math.round((Number(a?.amount) || 0) * 100)
    centsByUser.set(userId, (centsByUser.get(userId) || 0) + delta)
  }

  for (const s of walletSpends) {
    const walletId = Number(s?.source_id)
    const userId = walletToUser.get(walletId)
    if (!userId) continue
    const amountUsd = Number(s?.amount) || 0
    const fee = feeMultiplierForWalletSpend(amountUsd)
    const delta = -Math.round(amountUsd * fee * 100)
    centsByUser.set(userId, (centsByUser.get(userId) || 0) + delta)
  }

  return centsByUser
}

async function loadUserLogins(userIds: number[]): Promise<Map<number, string>> {
  if (!User || userIds.length === 0) return new Map()
  const users: Array<any> = await User.findAll({
    where: { id: { [Op.in]: userIds } },
    attributes: ['id', 'username', 'name', 'email']
  })
  const map = new Map<number, string>()
  for (const u of users) {
    const id = Number(u?.id)
    if (!Number.isFinite(id)) continue
    const login = u?.username || u?.name || (u?.email ? String(u.email) : '')
    map.set(id, login ? String(login) : '')
  }
  return map
}

// === Main ===

;(async () => {
  console.log(`${C.bold}${C.magenta}🚀 Year-End Open Tasks & Wallet Balances Report${C.reset}`)
  console.time('[Total] Report time')

  // Determine year range from earliest task to current year.
  const tasks: Array<any> = await Task.findAll({
    where: {
      value: { [Op.gt]: 0 }
    },
    attributes: [
      'id',
      'value',
      'status',
      'paid',
      'transfer_id',
      'TransferId',
      // 'assigneeId',
      'userId',
      'createdAt',
      'updatedAt'
    ],
    include: [models.Order],
    order: [['createdAt', 'ASC']]
  })

  const nowYear = moment.utc().year()
  const firstTaskYear = tasks.length ? moment.utc(tasks[0].createdAt).year() : nowYear
  const fromYear = firstTaskYear
  const toYear = nowYear

  console.log(
    `${C.blue}ℹ️  Year range: ${fromYear} – ${toYear}  |  Tasks with value > 0: ${tasks.length}${C.reset}`
  )

  const taskIds = tasks.map((t) => Number(t?.id)).filter((id) => Number.isFinite(id))
  const endPendingAtByTask = await loadTaskEndPendingAt(taskIds)
  const stripeChargeIdsByTask = await buildStripeChargeIdsByTask(taskIds)

  const contributorIds = tasks.map((t) => Number(t?.userId)).filter((id) => Number.isFinite(id))
  const contributorLoginById = await loadUserLogins([...new Set(contributorIds)])

  // ── Table 1: Open tasks as-of 12/31 for each year ──

  for (let year = fromYear; year <= toYear; year++) {
    const asOfExclusive = moment
      .utc({ year: year + 1, month: 0, day: 1 })
      .startOf('day')
      .toDate()

    type TaskRow = {
      id: string
      status: string
      value: string
      contributor: string
      source: string
      chargeIds: string
    }

    const rows: TaskRow[] = []
    for (const t of tasks) {
      const endPendingAt = endPendingAtByTask.get(Number(t?.id)) || null
      if (!isTaskPendingAsOf(t, endPendingAt, asOfExclusive)) continue

      const taskId = Number(t.id)
      const userId = Number(t?.userId)
      const login = userId ? contributorLoginById.get(userId) || '' : ''
      const contributorLabel = login ? `${login} (${userId})` : userId ? String(userId) : ''

      const sources =
        t.Orders?.map((o: any) => `${o.provider} ${formatUSD(toCents(Number(o.amount)))}`).join(
          ' · '
        ) || 'N/A'

      const chargeIds = stripeChargeIdsByTask.get(taskId) || []

      rows.push({
        id: String(taskId),
        status: String(t?.status || ''),
        value: formatUSD(toCents(Number(t?.value))),
        contributor: contributorLabel,
        source: sources,
        chargeIds: chargeIds.join(' ')
      })
    }

    rows.sort((a, b) => Number(a.id) - Number(b.id))

    const totalValueCents = rows.reduce(
      (sum, r) => sum + toCents(Number(r.value.replace(/[^0-9.\-]/g, ''))),
      0
    )

    printTable(
      `📝 Open Tasks as of 12/31/${year} (${rows.length}) – Total: ${formatUSD(totalValueCents)}`,
      [
        { key: 'id', header: 'Task', align: 'right', minWidth: 4, maxWidth: 8 },
        { key: 'status', header: 'Status', minWidth: 6, maxWidth: 12 },
        { key: 'value', header: 'Value', align: 'right', minWidth: 10, maxWidth: 14 },
        { key: 'contributor', header: 'Contributor', minWidth: 10, maxWidth: 30 },
        { key: 'source', header: 'Source', minWidth: 12, maxWidth: 50 },
        { key: 'chargeIds', header: 'Stripe Charge ID(s)', minWidth: 10, maxWidth: 60 }
      ],
      rows,
      { maxWidth: termWidth() }
    )
  }

  // ── Table 2: Wallet balances per user as-of 12/31 for each year ──

  const wallets: Array<any> = await Wallet.findAll({
    attributes: ['id', 'userId']
  })

  const walletToUser = new Map<number, number>()
  for (const w of wallets) {
    const walletId = Number(w?.id)
    const userId = Number(w?.userId)
    if (!Number.isFinite(walletId) || !Number.isFinite(userId)) continue
    walletToUser.set(walletId, userId)
  }

  const allUserIds = [...new Set([...walletToUser.values()])]
  const userLoginById = await loadUserLogins(allUserIds)

  for (let year = fromYear; year <= toYear; year++) {
    const asOfExclusive = moment
      .utc({ year: year + 1, month: 0, day: 1 })
      .startOf('day')
      .toDate()

    const centsByUser = await buildWalletBalanceByUserAsOf(asOfExclusive, walletToUser)

    type WalletRow = {
      userId: string
      user: string
      walletId: string
      balance: string
    }

    const rows: WalletRow[] = []
    for (const w of wallets) {
      const walletId = Number(w?.id)
      const userId = Number(w?.userId)
      if (!Number.isFinite(walletId) || !Number.isFinite(userId)) continue

      const cents = centsByUser.get(userId) || 0
      if (cents === 0) continue

      const login = userLoginById.get(userId) || ''
      rows.push({
        userId: String(userId),
        user: login,
        walletId: String(walletId),
        balance: formatUSD(cents)
      })
    }

    rows.sort((a, b) => Number(a.userId) - Number(b.userId))

    const totalBalanceCents = rows.reduce((sum, r) => {
      const raw = r.balance.replace(/[^0-9.\-]/g, '')
      return sum + toCents(Number(raw))
    }, 0)

    printTable(
      `💰 Wallet Balances as of 12/31/${year} (${rows.length} wallets) – Total: ${formatUSD(totalBalanceCents)}`,
      [
        { key: 'userId', header: 'User ID', align: 'right', minWidth: 6, maxWidth: 8 },
        { key: 'user', header: 'User', minWidth: 10, maxWidth: 30 },
        { key: 'walletId', header: 'Wallet ID', align: 'right', minWidth: 6, maxWidth: 10 },
        { key: 'balance', header: 'Balance', align: 'right', minWidth: 10, maxWidth: 14 }
      ],
      rows,
      { maxWidth: termWidth() }
    )
  }

  console.log('')
  console.timeEnd('[Total] Report time')
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
