import { useEffect, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { getWhopAccountStatus } from 'design-library/pages/private-pages/settings-pages/payout-settings-whop/getWhopAccountStatus'

type WhopAccountVerificationReturnPageProps = {
  /** 'return' after a completed hosted flow, 'refresh' when the link expired mid-flow */
  outcome: 'return' | 'refresh'
  fetchAccount?: () => Promise<any> | void
  fetchAccountCountries?: () => void
  addNotification?: (message: string, options: { severity: string; extra?: string }) => void
}

/**
 * Shown after Whop's hosted verification redirects back through the API. Neither Stripe nor
 * Whop's return_url callback carries a trustworthy success/failure signal — reaching this route
 * only means the hosted flow finished, not that the account is actually okay. So instead of
 * trusting the `status` query param, this re-fetches the account and runs it through the same
 * getWhopAccountStatus() the persistent header badge/banner uses (payout-settings-whop.tsx) —
 * so the toast can never contradict what the user then sees on the page — before landing back
 * on the real identity form with fresh data.
 */
const WhopAccountVerificationReturnPage = ({
  outcome,
  fetchAccount,
  fetchAccountCountries,
  addNotification
}: WhopAccountVerificationReturnPageProps) => {
  const history = useHistory()
  const location = useLocation()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const params = new URLSearchParams(location.search)

    const run = async () => {
      if (typeof fetchAccountCountries === 'function') fetchAccountCountries()

      if (outcome === 'refresh') {
        if (typeof addNotification === 'function') {
          addNotification('actions.user.account.verification.expired', { severity: 'warning' })
        }
        history.replace('/profile/payout-settings/whop/identity')
        return
      }

      const result = typeof fetchAccount === 'function' ? await fetchAccount() : undefined
      const { status } = getWhopAccountStatus({ data: (result as any)?.data })
      const explicitError = params.get('error')

      if (typeof addNotification === 'function') {
        if (explicitError) {
          addNotification('actions.user.account.verification.error', {
            severity: 'error',
            extra: explicitError
          })
        } else if (status === 'active') {
          addNotification('actions.user.account.verification.success', { severity: 'success' })
        } else if (status === 'rejected') {
          addNotification('actions.user.account.verification.error', { severity: 'error' })
        } else {
          addNotification('actions.user.account.verification.pending', { severity: 'warning' })
        }
      }

      history.replace('/profile/payout-settings/whop/identity')
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default WhopAccountVerificationReturnPage
