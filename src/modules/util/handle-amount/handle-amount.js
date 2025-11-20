const Decimal = require('decimal.js')
const currencyMap = require('../currency-info')

function handleAmount(amount, percent, type, currency = 'usd') {
  const decimalPlaces = currencyMap[currency.toLowerCase()]?.decimalPlaces || 2
  const centsFactor = Math.pow(10, decimalPlaces)
  let decimalAmount

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

module.exports = { handleAmount }
