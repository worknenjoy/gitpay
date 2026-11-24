import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  CreditCard as CardIcon,
  LockOutlined as LockIcon,
  History as LaterIcon
} from '@mui/icons-material'
import Button from 'design-library/atoms/buttons/button/button'
import SplitButton from 'design-library/atoms/buttons/split-button/split-button'

export type AddBountyWhen = 'now' | 'later'

type AddBountyButtonProps = {
  /** The issue already has a bounty → "Add to bounty". */
  hasBounty?: boolean
  onAdd: (when: AddBountyWhen) => void
  /**
   * Offer "Pay later" next to "Pay now" as a menu. Omit (default) when pay-later
   * isn't available — the button then adds a bounty paid now.
   */
  allowLater?: boolean
  /** Shown as the disabled reason on "Pay later" when the issue requires payment in advance. */
  laterDisabledReason?: React.ReactNode
  disabled?: boolean
  completed?: boolean
}

const AddBountyButton = ({
  hasBounty = false,
  onAdd,
  allowLater = false,
  laterDisabledReason,
  disabled = false,
  completed = true
}: AddBountyButtonProps) => {
  const intl = useIntl()
  const label = hasBounty ? (
    <FormattedMessage id="addBounty.button.addTo" defaultMessage="Add to bounty" />
  ) : (
    <FormattedMessage id="addBounty.button.add" defaultMessage="Add bounty" />
  )

  if (!allowLater) {
    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={disabled}
        completed={completed}
        onClick={() => onAdd('now')}
        endIcon={<CardIcon />}
        label={label}
      />
    )
  }

  return (
    <SplitButton
      fullWidth
      label={label}
      disabled={disabled}
      completed={completed}
      actions={[
        {
          key: 'now',
          label: intl.formatMessage({ id: 'addBounty.menu.now', defaultMessage: 'Pay now' }),
          description: intl.formatMessage({
            id: 'addBounty.menu.now.description',
            defaultMessage: 'Charged now and held until a solution is merged.'
          }),
          icon: <LockIcon fontSize="small" />,
          onClick: () => onAdd('now')
        },
        {
          key: 'later',
          label: intl.formatMessage({ id: 'addBounty.menu.later', defaultMessage: 'Pay later' }),
          description:
            laterDisabledReason ||
            intl.formatMessage({
              id: 'addBounty.menu.later.description',
              defaultMessage: 'Nothing charged now. Pay when a solution is accepted.'
            }),
          icon: <LaterIcon fontSize="small" />,
          disabled: Boolean(laterDisabledReason),
          onClick: () => onAdd('later')
        }
      ]}
    />
  )
}

export default AddBountyButton
