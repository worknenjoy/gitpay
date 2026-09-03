import * as user from '../../../modules/users'

export const account = async (req: any, res: any) => {
  try {
    const data = await user.userAccount({ id: req.user.id, provider: req.query?.provider })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountCreate = async (req: any, res: any) => {
  req.body.id = req.user.id
  try {
    const data = await user.userAccountCreate(req.body)
    if (data?.requiresConfirmation) {
      res.status(409).json(data)
      return
    }
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    const status = error?.statusCode || error?.status || 400
    res.status(status).json({
      error: error?.message || 'account_create_failed',
      details: error?.body || undefined
    })
  }
}

export const accountCountries = async (req: any, res: any) => {
  try {
    const data = await user.userAccountCountries({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountBalance = async (req: any, res: any) => {
  try {
    const data = await user.userAccountBalance({
      account_id: req.user.account_id,
      userId: req.user.id
    })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountUpdate = async (req: any, res: any) => {
  try {
    const data = await user.userAccountUpdate({ userParams: req.user, accountParams: req.body })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on account update', error)
    res.status(401).send(error)
  }
}

export const accountDelete = async (req: any, res: any) => {
  try {
    const data = await user.userAccountDelete({
      userId: req.user.id,
      provider: req.body?.provider || req.query?.provider
    })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on account delete', error)
    res.status(401).send(error)
  }
}

export const accountVerificationLink = async (req: any, res: any) => {
  try {
    const data = await user.userAccountLink({
      id: req.user.id,
      provider: req.body?.provider || req.query?.provider,
      purpose: req.body?.purpose || req.query?.purpose
    })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on account verification link', error)
    res.status(401).send(error)
  }
}

/**
 * Public browser callbacks after Stripe/Whop hosted verification.
 * Redirect back into the SPA (same tab) with a success/refresh hash route.
 * Pattern matches /orders/authorize.
 */
function frontendHost(): string {
  return (process.env.FRONTEND_HOST || 'http://localhost:8082').replace(/\/$/, '')
}

export const accountVerificationReturn = async (req: any, res: any) => {
  const base = frontendHost()
  const provider = String(req.query?.provider || '').toLowerCase()

  if (provider === 'whop') {
    const status = req.query?.error ? 'error' : 'success'
    const params = new URLSearchParams({ status })
    if (req.query?.error) params.set('error', String(req.query.error))
    res.redirect(
      `${base}/#/profile/payout-settings/whop/account-verification/return?${params.toString()}`
    )
    return
  }

  res.redirect(
    `${base}/#/profile/payout-settings/bank-account/account-verification/return?status=success`
  )
}

export const accountVerificationRefresh = async (req: any, res: any) => {
  const base = frontendHost()
  const provider = String(req.query?.provider || '').toLowerCase()

  if (provider === 'whop') {
    res.redirect(
      `${base}/#/profile/payout-settings/whop/account-verification/refresh?status=expired`
    )
    return
  }

  res.redirect(
    `${base}/#/profile/payout-settings/bank-account/account-verification/refresh?status=expired`
  )
}
