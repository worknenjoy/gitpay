const Decimal = require('decimal.js'); // Assuming decimal.js is installed
const currencyMap = require('../currency-info'); // Adjust the path as necessary

function handleAmount(amount, percent, type, currency = 'usd') {
  const decimalPlaces = currencyMap[currency.toLowerCase()]?.decimalPlaces || 2;
  const centsFactor = Math.pow(10, decimalPlaces);
  let decimalAmount;
  if (type === 'centavos') {
    decimalAmount = new Decimal(amount).div(centsFactor);
  } else {
    decimalAmount = new Decimal(amount);
  }
  
  const percentDecimal = new Decimal(1).minus(new Decimal(percent).div(100));
  const resultDecimal = decimalAmount.mul(percentDecimal);
  const centavos = resultDecimal.mul(centsFactor).toDecimalPlaces(decimalPlaces, Decimal.ROUND_HALF_UP).toNumber();
  const decimal = resultDecimal.toNumber();
  return { centavos, decimal };
}

module.exports = { handleAmount };
