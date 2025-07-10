const FAILED_REASON = {
  declined_by_network: 'Denied by card',
  not_sent_to_network: 'Hight risk card, please provide all the information'
};

const CURRENCIES = {
  aud: '$',
  eur: '€',
  brl: 'R$',
  cad: 'C$',
  czk: 'Kč',
  dkk: 'DK',
  hkd: 'HK$',
  inr: '₹',
  jpy: '¥',
  myr: 'RM',
  mxn: 'Mex$',
  nzd: 'NZ$',
  nok: 'kr',
  isk: 'kr',
  pln: 'zł',
  ron: 'lei',
  ngn: '₦',
  sgd: 'S$',
  sek: 'kr',
  chf: 'fr',
  gbp: '£',
  usd: '$',
  bgn: 'лв',
  hrk: 'kn',
  ghs: '₵',
  gip: '£',
  huf: 'Ft',
  kes: 'KSh',
  php: '₱',
  zar: 'R',
  thb: '฿',
  aed: 'د.إ',
  cop: '$'
};

function formatStripeAmount(amountInCents) {
  let amount = Number(amountInCents);
  if (isNaN(amount)) {
    return 'Invalid amount';
  }
  return (amount / 100).toFixed(2);
}

module.exports = {
  FAILED_REASON,
  CURRENCIES,
  formatStripeAmount
};
