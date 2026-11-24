import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import IssueSidebarCardBase from '../issue-sidebar-card-base/issue-sidebar-card-base'
import AvatarStack, {
  AvatarStackPerson
} from 'design-library/atoms/data-display/avatar-stack/avatar-stack'
import PaymentTimingAlert, {
  PaymentTiming
} from 'design-library/atoms/alerts/payment-timing-alert/payment-timing-alert'
import AddBountyButton, {
  AddBountyWhen
} from 'design-library/atoms/buttons/add-bounty-button/add-bounty-button'
import EmptyBounty from 'design-library/molecules/content/empty/empty-bounty/empty-bounty'
import { Total, Unit, Sponsors } from './issue-bounty-card.styles'

type IssueBountyCardProps = {
  total: number
  sponsors?: AvatarStackPerson[]
  /** How the bounty is paid. Defaults to 'advance' (everything paid up front). */
  timing?: PaymentTiming
  /** Amount pledged to pay later (flex / later). */
  pledged?: number
  onAdd: (when: AddBountyWhen) => void
  /** Offer pay later in the add menu — only when pay later is available. */
  allowLater?: boolean
  onBreakdown?: () => void
  /** Bounty already paid out → no more funding. */
  disabled?: boolean
  completed?: boolean
}

const money = (value: number) => (
  <FormattedNumber value={value} style="currency" currency="USD" minimumFractionDigits={2} />
)

/** Fund this issue: total, how it's paid, who sponsored it, and Add bounty. */
const IssueBountyCard = ({
  total,
  sponsors = [],
  timing = 'advance',
  pledged,
  onAdd,
  allowLater = false,
  onBreakdown,
  disabled = false,
  completed = true
}: IssueBountyCardProps) => {
  const hasBounty = total > 0
  const addButton = (
    <AddBountyButton
      hasBounty={hasBounty}
      onAdd={onAdd}
      allowLater={allowLater}
      laterDisabledReason={
        allowLater && timing === 'advance' ? (
          <FormattedMessage
            id="issue.bounty.later.disabled"
            defaultMessage="This issue requires payment in advance."
          />
        ) : undefined
      }
      disabled={disabled}
    />
  )

  const footer =
    timing === 'flex' ? (
      <FormattedMessage
        id="issue.bounty.footer.flex"
        defaultMessage="For maintainers and sponsors. Choose to pay now or when a solution is accepted."
      />
    ) : timing === 'later' ? (
      <FormattedMessage
        id="issue.bounty.footer.later"
        defaultMessage="For maintainers and sponsors. Paid when a solution is accepted."
      />
    ) : (
      <FormattedMessage
        id="issue.bounty.footer.advance"
        defaultMessage="For maintainers and sponsors. Paid out when a solution is merged."
      />
    )

  return (
    <IssueSidebarCardBase
      caption={<FormattedMessage id="issue.bounty.caption" defaultMessage="Bounty" />}
      headerAction={
        hasBounty && onBreakdown
          ? {
              label: (
                <FormattedMessage id="issue.bounty.breakdown" defaultMessage="View breakdown" />
              ),
              onClick: onBreakdown
            }
          : undefined
      }
      footer={footer}
      completed={completed}
    >
      {hasBounty ? (
        <>
          <Total>
            {money(total)}
            <Unit>
              {timing === 'later' ? (
                <FormattedMessage
                  id="issue.bounty.unit.estimated"
                  defaultMessage="USD · estimated"
                />
              ) : timing === 'flex' && pledged ? (
                <FormattedMessage
                  id="issue.bounty.unit.pledged"
                  defaultMessage="USD · {amount} pledged"
                  values={{ amount: money(pledged) }}
                />
              ) : (
                'USD'
              )}
            </Unit>
          </Total>
          <PaymentTimingAlert
            timing={timing}
            description={
              timing === 'flex' && pledged ? (
                <FormattedMessage
                  id="issue.bounty.flex.split"
                  defaultMessage="{paid} paid in advance, {pledged} pledged. Sponsors can pay now or when a solution is accepted."
                  values={{ paid: money(total - pledged), pledged: money(pledged) }}
                />
              ) : undefined
            }
          />
          {sponsors.length > 0 && (
            <Sponsors>
              <AvatarStack people={sponsors} max={5} />
              <FormattedMessage
                id="issue.bounty.sponsors"
                defaultMessage="{count, plural, one {# sponsor} other {# sponsors}}"
                values={{ count: sponsors.length }}
              />
            </Sponsors>
          )}
          {addButton}
        </>
      ) : (
        <EmptyBounty actionComponent={addButton} />
      )}
    </IssueSidebarCardBase>
  )
}

export default IssueBountyCard
