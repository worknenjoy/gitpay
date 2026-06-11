import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_KEY as string)

import Models from '../../models'
import moment from 'moment'

const models = Models as any
const { Order, Task } = models

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
const termWidth = () => clamp(process.stdout.columns ?? 100, 60, 160)

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

async function getPendingTasks() {
  console.log(
    `${C.cyan}${C.bold}📝 [Step] Calculating total amount for pending Tasks in database...${C.reset}`
  )
  console.time('[Step] Pending Tasks amount calculation time')

  const pendingTasks = await Task.findAll({
    where: {
      //value: { [Op.gt]: 0 }
      state: 'funded'
    },
    include: [models.Order]
  })

  let totalPendingTasksAmount = 0
  for (const t of pendingTasks) {
    totalPendingTasksAmount += Number(t.value) * 0.92 || 0
  }

  const pendingTaskRows = pendingTasks.map((t: any) => {
    const sources =
      t.Orders?.map((o: any) => `${o.provider} ${formatUSD(toCents(o.amount))}`).join(' · ') ||
      'N/A'
    return {
      id: String(t.id),
      value: formatUSD(toCents(t.value)),
      created: moment(t.createdAt).format('YYYY-MM-DD HH:mm'),
      age: moment(t.createdAt).fromNow(),
      status: t.status ?? '',
      state: t.state ?? '',
      stale: t.stale_at ? moment(t.stale_at).format('YYYY-MM-DD') : '',
      source: sources,
      TransferId: t.TransferId ?? '',
      transfer_id: t.transfer_id ?? ''
    }
  })

  printTable(
    `Pending Tasks (${pendingTasks.length})`,
    [
      { key: 'id', header: 'Task', align: 'right', minWidth: 4, maxWidth: 8 },
      { key: 'value', header: 'Value', align: 'right', minWidth: 10, maxWidth: 14 },
      { key: 'created', header: 'Created', minWidth: 16, maxWidth: 16 },
      { key: 'age', header: 'Age', minWidth: 10, maxWidth: 14 },
      { key: 'status', header: 'Status', minWidth: 8, maxWidth: 12 },
      { key: 'state', header: 'State', minWidth: 8, maxWidth: 16 },
      { key: 'stale', header: 'Stale At', minWidth: 10, maxWidth: 12 },
      { key: 'source', header: 'Source', minWidth: 18, maxWidth: 60 },
      { key: 'TransferId', header: 'TransferId', minWidth: 8, maxWidth: 12 },
      { key: 'transfer_id', header: 'transfer_id', minWidth: 8, maxWidth: 12 }
    ],
    pendingTaskRows,
    { maxWidth: termWidth() }
  )

  let totalPendingPaypalOrdersAmount = 0
  const pendingPaypalRows: Array<{
    task: string
    order: string
    amount: string
    created: string
    age: string
  }> = []
  for (const t of pendingTasks) {
    if (t.Orders?.length > 0) {
      for (const order of t.Orders) {
        if (order.provider === 'paypal' && order.status === 'succeeded') {
          pendingPaypalRows.push({
            task: String(t.id),
            order: String(order.id),
            amount: formatUSD(toCents(order.amount)),
            created: moment(t.createdAt).format('YYYY-MM-DD HH:mm'),
            age: moment(t.createdAt).fromNow()
          })
          totalPendingPaypalOrdersAmount += Number(order.amount) * 0.92 || 0
        }
      }
    }
  }

  printTable(
    `Pending Tasks with PayPal Orders (${pendingPaypalRows.length})`,
    [
      { key: 'task', header: 'Task', align: 'right', minWidth: 4, maxWidth: 8 },
      { key: 'order', header: 'Order', align: 'right', minWidth: 5, maxWidth: 10 },
      { key: 'amount', header: 'Amount', align: 'right', minWidth: 10, maxWidth: 14 },
      { key: 'created', header: 'Created', minWidth: 16, maxWidth: 16 },
      { key: 'age', header: 'Age', minWidth: 10, maxWidth: 14 }
    ],
    pendingPaypalRows,
    { maxWidth: termWidth() }
  )

  if (totalPendingPaypalOrdersAmount > 0) {
    console.log(
      `${C.yellow}⚠️  Note: Pending Tasks total includes ${formatUSD(toCents(totalPendingPaypalOrdersAmount))} from PayPal-related orders.${C.reset}`
    )
  }

  console.log(
    `${C.blue}ℹ️  [Database] Total pending tasks: ${pendingTasks.length}` +
      ` | Total amount (after 8% fee): ${formatUSD(toCents(totalPendingTasksAmount))}${C.reset}`
  )

  console.timeEnd('[Step] Pending Tasks amount calculation time')
  return { totalPendingTasksAmount, totalPendingPaypalOrdersAmount }
}

;(async () => {
  console.log(`${C.bold}${C.magenta}📋 Gitpay — Pending Issues/Tasks Report${C.reset}`)
  console.time('[Total] Pending tasks report time')
  try {
    await getPendingTasks()
  } catch (err) {
    console.error(`${C.red}❌ Failed to compute pending tasks report:${C.reset}`, err)
    process.exitCode = 1
  } finally {
    if (models?.sequelize?.close) {
      await models.sequelize.close()
    }
    console.timeEnd('[Total] Pending tasks report time')
  }
})()
