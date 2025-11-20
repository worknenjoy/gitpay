const convertParamsToStripeObject = (params) => {
  const account = {}

  account.country = params?.['country'] || ''
  account.default_currency = params?.['default_currency'] || ''

  account.business_profile = {
    url: params?.['business_profile[url]'] || ''
  }

  account.individual = {
    address: {
      city: params?.['individual[address][city]'] || '',
      line1: params?.['individual[address][line1]'] || '',
      line2: params?.['individual[address][line2]'] || '',
      postal_code: params?.['individual[address][postal_code]'] || '',
      state: params?.['individual[address][state]'] || ''
    },
    dob: {
      day: params?.['individual[dob][day]'] || '',
      month: params?.['individual[dob][month]'] || '',
      year: params?.['individual[dob][year]'] || ''
    },
    email: params?.['individual[email]'] || undefined,
    first_name: params?.['individual[first_name]'] || '',
    last_name: params?.['individual[last_name]'] || '',
    phone: params?.['individual[phone]'] || ''
  }

  return account
}

export default convertParamsToStripeObject
