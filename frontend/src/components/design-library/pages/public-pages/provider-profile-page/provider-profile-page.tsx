import React from 'react'
import { Container, Divider } from '@mui/material'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import ProfileUserHeader from 'design-library/molecules/headers/profile-user-header/profile-user-header'
import StatusCard from 'design-library/molecules/cards/status-card/status-card'
import ServicePackageCard from 'design-library/molecules/cards/service-package-card/service-package-card'
import PaymentLinkItem, {
  PaymentLink
} from 'design-library/molecules/lists/payment-link-item/payment-link-item'
import { Page } from '../../../../../styleguide/components/Page'
import { Root, StatsRow, PackagesRow } from './provider-profile-page.styles'

type PaymentLinkOrPackage = PaymentLink & {
  description?: string
  tier?: string | null
  featured?: boolean
}

type ProviderProfilePageProps = {
  profile: any
  stats?: {
    jobsDeliveredCount?: number
    totalReceived?: number
    activeLinksCount?: number
    repeatClientsPct?: number | null
    providerSince?: string
  }
  /** Whether `stats` has finished loading — controls the stat tiles' skeleton state. */
  statsCompleted?: boolean
  paymentLinks: PaymentLinkOrPackage[]
  onPay?: (link: PaymentLinkOrPackage) => void
}

const ProviderProfilePage = ({
  profile,
  stats = {},
  statsCompleted = true,
  paymentLinks,
  onPay
}: ProviderProfilePageProps) => {
  const packages = paymentLinks.filter((l) => l.tier)
  const links = paymentLinks.filter((l) => !l.tier)

  return (
    <Page>
      <Container fixed maxWidth="lg">
        <ProfileUserHeader
          profile={profile}
          roles={[{ name: 'service provider', tone: 'yellow', active: true }]}
          cta={[
            { label: <FormattedMessage id="providerProfile.payNow" defaultMessage="Pay now →" /> },
            {
              label: (
                <FormattedMessage
                  id="providerProfile.requestQuote"
                  defaultMessage="Request a quote"
                />
              ),
              variant: 'outlined'
            }
          ]}
          meta={{
            identity: [
              stats.providerSince && (
                <FormattedMessage
                  key="since"
                  id="providerProfile.providerSince"
                  defaultMessage="Provider since {year}"
                  values={{ year: new Date(stats.providerSince).getFullYear() }}
                />
              ),
              stats.jobsDeliveredCount != null && (
                <FormattedMessage
                  key="jobs"
                  id="providerProfile.jobsDelivered"
                  defaultMessage="{count} jobs delivered"
                  values={{ count: stats.jobsDeliveredCount }}
                />
              )
            ].filter(Boolean),
            context:
              stats.repeatClientsPct != null
                ? [
                    <FormattedMessage
                      key="repeat"
                      id="providerProfile.repeatClients"
                      defaultMessage="{pct}% repeat clients"
                      values={{ pct: stats.repeatClientsPct }}
                    />
                  ]
                : []
          }}
        />
      </Container>

      <Container fixed maxWidth="lg">
        <Root container>
          <StatsRow>
            <StatusCard
              completed={statsCompleted}
              name={
                <FormattedMessage id="providerProfile.stat.jobs" defaultMessage="Jobs delivered" />
              }
              status={stats.jobsDeliveredCount ?? '—'}
            />
            <StatusCard
              completed={statsCompleted}
              name={
                <FormattedMessage
                  id="providerProfile.stat.received"
                  defaultMessage="Total received"
                />
              }
              status={
                <FormattedNumber
                  value={stats.totalReceived ?? 0}
                  style="currency"
                  currency="USD"
                  maximumFractionDigits={0}
                />
              }
            />
            <StatusCard
              completed={statsCompleted}
              name={
                <FormattedMessage id="providerProfile.stat.links" defaultMessage="Active links" />
              }
              status={stats.activeLinksCount ?? '—'}
            />
            <StatusCard
              completed={statsCompleted}
              name={
                <FormattedMessage
                  id="providerProfile.stat.repeat"
                  defaultMessage="Repeat clients"
                />
              }
              status={stats.repeatClientsPct != null ? `${stats.repeatClientsPct}%` : '—'}
            />
          </StatsRow>

          {packages.length > 0 && (
            <>
              <Divider textAlign="left">
                <FormattedMessage id="providerProfile.packages" defaultMessage="Service packages" />
              </Divider>
              <PackagesRow>
                {packages.map((pkg) => (
                  <ServicePackageCard
                    key={pkg.id}
                    tier={pkg.title}
                    price={
                      <FormattedNumber
                        value={Number(pkg.amount) || 0}
                        style="currency"
                        currency={(pkg.currency || 'usd').toUpperCase()}
                        maximumFractionDigits={0}
                      />
                    }
                    features={(pkg.description || '').split('\n').filter(Boolean)}
                    featured={!!pkg.featured}
                    ctaLabel={<FormattedMessage id="providerProfile.book" defaultMessage="Book" />}
                    onSelect={() => onPay?.(pkg)}
                  />
                ))}
              </PackagesRow>
            </>
          )}

          <Divider textAlign="left">
            <FormattedMessage id="providerProfile.paymentLinks" defaultMessage="Payment links" />
          </Divider>
          {links.length === 0 ? (
            <FormattedMessage
              id="providerProfile.noPaymentLinks"
              defaultMessage="No payment links yet."
            />
          ) : (
            links.map((link) => <PaymentLinkItem key={link.id} link={link} onPay={onPay} />)
          )}
        </Root>
      </Container>
    </Page>
  )
}

export default ProviderProfilePage
