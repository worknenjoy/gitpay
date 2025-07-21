const Decimal = require('decimal.js'); // Assuming decimal.js is installed

function handleAmount(amount, percent, type) {
  let decimalAmount;
  if (type === 'centavos') {
    decimalAmount = new Decimal(amount).div(100);
  } else {
    decimalAmount = new Decimal(amount);
  }
  const percentDecimal = new Decimal(1).minus(new Decimal(percent).div(100));
  const resultDecimal = decimalAmount.mul(percentDecimal);
  const centavos = resultDecimal.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
  const decimal = resultDecimal.toNumber();
  return { centavos, decimal };
}

module.exports = { handleAmount };
