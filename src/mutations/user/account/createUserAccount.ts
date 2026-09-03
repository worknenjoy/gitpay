import models from '../../../models'

import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'
import { createAccount, deleteAccount } from '../../provider/stripe/user'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../../providers'
import type { WhopPaymentProvider } from '../../../providers/whop/WhopPaymentProvider'
import { isEmailValid } from '../../../validators/emailValidator'
import { currencyForCountry } from '../../../utils/currency/currency-map'

const currentModels = models as any

type UserAccountCreateParams = {
  id: number
  /** Required for Stripe (Connect custom accounts); optional for Whop, which collects
   * country itself during account_onboarding/KYC. */
  country?: string
  /**
   * Whop only. Set after the user confirms linking an existing connected company found by
   * `findConnectedAccountForUser` (surfaced via `requiresConfirmation` on a prior attempt).
   * Re-verified server-side by re-running that same lookup before use — never trusted blindly
   * from the client.
   */
  confirmExistingAccountId?: string
}

/**
 * Resolve a deliverable email for payment providers.
 * Prefer Users.email (required at signup); fall back to provider_email for older OAuth rows.
 */
function resolveUserEmail(user: any): string | null {
  const raw =
    user?.dataValues?.email ??
    user?.email ??
    user?.dataValues?.provider_email ??
    user?.provider_email

  if (raw == null || typeof raw !== 'string') return null
  const email = raw.trim().toLowerCase()
  if (!email || !isEmailValid(email)) return null
  // Whop rejects many synthetic / privacy-proxy addresses
  if (email.endsWith('@users.noreply.github.com')) return null
  if (email.includes('noreply') && email.includes('github')) return null
  return email
}

function resolveUserDisplayName(user: any, email: string): string {
  const name =
    user?.dataValues?.name ||
    user?.name ||
    user?.dataValues?.username ||
    user?.username ||
    user?.dataValues?.provider_username ||
    user?.provider_username ||
    email
  return String(name).trim() || email
}

export async function createUserAccount(userParameters: UserAccountCreateParams) {
  const { country } = userParameters
  const providerName = getDefaultPaymentProviderName()

  // Whop connected company (sub-merchant)
  if (providerName === 'whop') {
    let createdAccountId: string | null = null
    try {
      return await currentModels.sequelize.transaction(async (t: any) => {
        const user = await findUserByIdSimple(userParameters.id, { transaction: t })

        if (!user) {
          throw new Error('user.not_found')
        }

        if (user?.dataValues?.whop_account_id) {
          return { error: 'user already have a Whop account' }
        }

        const email = resolveUserEmail(user)
        if (!email) {
          const rawEmail = user?.dataValues?.email ?? user?.email ?? null
          const err: any = new Error(
            [
              'A deliverable email is required to create a Whop payout account.',
              rawEmail
                ? `Stored email "${rawEmail}" is missing, invalid, or not usable (e.g. GitHub noreply).`
                : 'Users.email is empty for this account.',
              'Update your Gitpay profile to a real inbox and try again.'
            ].join(' ')
          )
          err.statusCode = 422
          throw err
        }

        // eslint-disable-next-line no-console
        console.log('[createUserAccount][whop] using user email', {
          userId: user.dataValues.id,
          email,
          source:
            user.dataValues.email === email ||
            String(user.dataValues.email || '')
              .trim()
              .toLowerCase() === email
              ? 'Users.email'
              : 'Users.provider_email'
        })

        const whop = getPaymentProvider('whop') as WhopPaymentProvider
        const accountName = resolveUserDisplayName(user, email)
        const gitpayUserId = String(user.dataValues.id)

        // User confirmed linking a pre-existing connected company found on an earlier
        // attempt (see the whop_account_name_conflict recovery below). Re-verify server-side
        // by re-running the exact same scoped lookup that produced the offer in the first
        // place, rather than trusting the client-supplied id directly — this also keeps
        // "what we offered" and "what we accept" consistent (a single-resource GET here could
        // return a different/thinner shape than the list lookup and reject a legitimate,
        // already-vetted match).
        if (userParameters.confirmExistingAccountId) {
          const verified = await whop.findConnectedAccountForUser({
            title: accountName,
            gitpayUserId,
            email
          })

          if (!verified || verified.accountId !== userParameters.confirmExistingAccountId) {
            const err: any = new Error('This Whop account does not belong to your Gitpay user')
            err.statusCode = 403
            throw err
          }

          await user.update(
            {
              whop_account_id: userParameters.confirmExistingAccountId,
              country
            },
            { transaction: t }
          )

          return {
            id: userParameters.confirmExistingAccountId,
            provider: 'whop',
            ...((verified.raw as object) || {})
          }
        }

        // Whop companies.create expects lowercase ISO country (us, br, …)
        const countryCode = country ? String(country).trim().toLowerCase() : country
        const defaultCurrency = currencyForCountry(country)

        let account
        try {
          // Pass everything we already know so Whop pre-fills the connected company
          // (email, country, currency, gitpay user relation). Bank / payout method
          // is completed later on Whop via account_links — not stored in Gitpay.
          account = await whop.createConnectedAccount({
            email,
            country: countryCode,
            title: accountName,
            metadata: {
              internal_user_id: gitpayUserId,
              gitpay_user_id: gitpayUserId,
              title: accountName,
              email,
              country: countryCode || '',
              currency: defaultCurrency,
              default_currency: defaultCurrency,
              name: user.dataValues.name || '',
              username: user.dataValues.username || user.dataValues.provider_username || ''
            }
          })
        } catch (createError: any) {
          if (createError?.code !== 'whop_account_name_conflict') throw createError

          // The title collided with a company already enrolled under our own platform —
          // almost always an orphan from an earlier attempt by this same user. Look it up
          // (scoped to our own parent_company_id) instead of asking the user to change their
          // name to work around it.
          const existing = await whop.findConnectedAccountForUser({
            title: createError.title || accountName,
            gitpayUserId,
            email
          })

          if (!existing) throw createError

          return {
            requiresConfirmation: true,
            provider: 'whop',
            existingAccountId: existing.accountId,
            existingAccountTitle: (existing.raw as any)?.title || accountName
          }
        }

        createdAccountId = account.accountId

        await user.update(
          {
            whop_account_id: account.accountId,
            country
          },
          { transaction: t }
        )

        return {
          id: account.accountId,
          provider: 'whop',
          ...((account.raw as object) || {})
        }
      })
    } catch (error) {
      // Whop has no delete-company guarantee; leave orphan for manual cleanup
      console.error('Failed to create Whop connected account', error, createdAccountId)
      throw error
    }
  }

  // Stripe Connect (default)
  let createdAccountId: string | null = null

  try {
    return await currentModels.sequelize.transaction(async (t: any) => {
      const user = await findUserByIdSimple(userParameters.id, { transaction: t })

      if (!user) {
        throw new Error('user.not_found')
      }

      if (user?.dataValues?.account_id) {
        return { error: 'user already have an account' }
      }

      const account = await createAccount({
        type: 'custom',
        country,
        email: user.dataValues.email,
        business_type: 'individual',
        capabilities: {
          transfers: {
            requested: true
          }
        },
        tos_acceptance: {
          service_agreement: country === 'US' ? 'full' : 'recipient'
        }
      })

      createdAccountId = account.id

      await user.update(
        {
          account_id: account.id,
          country
        },
        { transaction: t }
      )

      return account
    })
  } catch (error) {
    if (createdAccountId) {
      await deleteAccount(createdAccountId).catch(() => null)
    }
    throw error
  }
}
