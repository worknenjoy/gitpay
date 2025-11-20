import { BuildTotals, Charge, ReportRow, BalanceTransaction } from './types'
import { listChargesForRange, listTransfersForRange } from './stripe'
import { centsToDecimal, formatDateForSheets } from './format'
import {
  computeServiceType,
  getChargeUSDCents,
  getTransactionTypeForCharge,
  stripeFeeUSDCentsFromBT,
  transferUSDCents
} from './finance'

export async function buildRowsForYear(
  startUnix: number,
  endUnix: number
): Promise<{ rows: ReportRow[]; totals: BuildTotals }> {
  const rows: ReportRow[] = []
  const totals: BuildTotals = { transferTotal: 0, chargeTotal: 0, fee: 0, revenue: 0 }

  const transfers = await listTransfersForRange(startUnix, endUnix)
  const oneYearSec = 366 * 24 * 3600
  const chargeIndexStart = Math.max(0, startUnix - oneYearSec)
  const chargesWide = await listChargesForRange(chargeIndexStart, endUnix)

  const chargeByTG = new Map<string, Charge>()
  for (const ch of chargesWide) {
    if (ch?.transfer_group && !chargeByTG.has(ch.transfer_group))
      chargeByTG.set(ch.transfer_group, ch)
  }

  // Transfer rows
  for (const t of transfers) {
    const ch = t?.transfer_group ? chargeByTG.get(t.transfer_group) : undefined
    const bt: BalanceTransaction | undefined = ch?.balance_transaction
    const originalCents = getChargeUSDCents(ch)
    const feeCents = stripeFeeUSDCentsFromBT(bt)
    const transferCents = transferUSDCents(t)
    const revenueCents = originalCents - feeCents - transferCents
    const serviceType = computeServiceType(ch, t)
    const row: ReportRow = {
      Status: 'completed',
      TransactionType: 'transfer',
      TransferId: t.id || '',
      ChargeId: ch?.id || '',
      ServiceType: serviceType,
      'Transfer Amount': transferCents > 0 ? centsToDecimal(transferCents, 'usd') : '',
      'Original Charge Amount': originalCents > 0 ? centsToDecimal(originalCents, 'usd') : '',
      'Stripe Fee': feeCents > 0 ? centsToDecimal(feeCents, 'usd') : '',
      'Transfer Date': formatDateForSheets(t?.created),
      'Charge Date': formatDateForSheets(ch?.created),
      Revenue: originalCents > 0 || transferCents > 0 ? centsToDecimal(revenueCents, 'usd') : ''
    }
    rows.push(row)

    totals.transferTotal += transferCents
    totals.chargeTotal += originalCents
    totals.fee += feeCents
    totals.revenue += revenueCents
  }

  // Charge-only rows (no transfer_group) in the year
  const chargesYear = await listChargesForRange(startUnix, endUnix)
  for (const ch of chargesYear) {
    if (ch?.transfer_group) continue
    const serviceType = computeServiceType(ch, null)
    const originalCents = getChargeUSDCents(ch)
    const feeCents = stripeFeeUSDCentsFromBT(ch?.balance_transaction)
    const txType = getTransactionTypeForCharge(ch)
    const isPending = txType === 'charge' || txType === 'payment_intent'
    const revenueCents = isPending ? 0 : originalCents - feeCents

    const row: ReportRow = {
      Status: isPending ? 'pending' : 'completed',
      TransactionType: txType,
      TransferId: '',
      ChargeId: ch?.id || '',
      ServiceType: serviceType,
      'Transfer Amount': '',
      'Original Charge Amount': originalCents > 0 ? centsToDecimal(originalCents, 'usd') : '',
      'Stripe Fee': feeCents > 0 ? centsToDecimal(feeCents, 'usd') : '',
      'Transfer Date': '',
      'Charge Date': formatDateForSheets(ch?.created),
      Revenue: originalCents > 0 ? centsToDecimal(revenueCents, 'usd') : ''
    }
    rows.push(row)

    totals.chargeTotal += originalCents
    totals.fee += feeCents
    totals.revenue += revenueCents
  }

  return { rows, totals }
}
