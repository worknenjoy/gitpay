export const formatCurrency = (amount: number | bigint, locale: string = 'en-US', currency: string = 'USD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}
