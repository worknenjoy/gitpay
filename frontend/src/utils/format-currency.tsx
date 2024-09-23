export const formatCurrency = (amount: number | bigint) => {
  return (new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 4
  }).format(amount))
}