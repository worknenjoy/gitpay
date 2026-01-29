const Decimal = require('decimal.js')
import currencyInfo from '../currency-info'

type HandleAmountResult = {
  centavos: number
  decimal: number
  decimalFee: number
  centavosFee: number
}

export function handleAmount(
  amount: number,
  percent: number,
  type: string,
  currency: string = 'usd'
): HandleAmountResult {
  const decimalPlaces = currencyInfo[currency.toLowerCase()]?.decimalPlaces || 2
  const centsFactor = Math.pow(10, decimalPlaces)
  let decimalAmount: any

  if (type === 'centavos') {
    decimalAmount = new Decimal(amount).div(centsFactor)
  } else {
    decimalAmount = new Decimal(amount)
  }

  const percentDecimal = new Decimal(1).minus(new Decimal(percent).div(100))
  const resultDecimal = decimalAmount.mul(percentDecimal)

  // Fee is the discounted portion
  const feeDecimal = decimalAmount.minus(resultDecimal)

  const rawCentavos = resultDecimal.mul(centsFactor)
  const centavos = Math.ceil(rawCentavos.toNumber())
  const decimal = resultDecimal.toDecimalPlaces(decimalPlaces).toNumber()

  const rawCentavosFee = feeDecimal.mul(centsFactor)
  const centavosFee = Math.ceil(rawCentavosFee.toNumber())
  const decimalFee = feeDecimal.toDecimalPlaces(decimalPlaces).toNumber()

  return { centavos, decimal, decimalFee, centavosFee }
}
