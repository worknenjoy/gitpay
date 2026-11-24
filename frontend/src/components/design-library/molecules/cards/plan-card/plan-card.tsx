import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { TwoWheeler as Motorcycle } from '@mui/icons-material'
import {
  PlanGridItem,
  PlanCard as StyledCard,
  PlanCardContent as StyledCardContent,
  PlanButton,
  PlanBullets,
  PlanIcon,
  CompactCard,
  CompactFee,
  CompactIcon
} from './plan-card.styles'

// styles migrated to plan-card.styles.ts

type PlanDetails = {
  fee?: number
  category?: React.ReactNode
  title?: React.ReactNode
  items?: React.ReactNode[]
}

type PlanProps = {
  plan?: PlanDetails
  /** compact: just the fee and category, small enough to sit in a form row (e.g. the Add bounty amount row). */
  variant?: 'default' | 'compact'
}

const PlanCard = ({ plan, variant = 'default' }: PlanProps) => {
  const { fee, category, title, items = [] } = plan

  if (variant === 'compact') {
    return (
      <CompactCard>
        <CompactFee>
          <CompactIcon>
            <Motorcycle color="primary" fontSize="small" />
          </CompactIcon>
          <span>
            <b>
              <FormattedMessage
                id="actions.task.payment.plan.percentagefee"
                defaultMessage="{fee}% fee"
                values={{ fee: fee }}
              />
            </b>
            <em>{category}</em>
          </span>
        </CompactFee>
      </CompactCard>
    )
  }

  return (
    <PlanGridItem>
      <StyledCard>
        <StyledCardContent>
          <PlanButton>
            <PlanIcon>
              <Motorcycle color={'primary'} />
            </PlanIcon>
            <Typography align="center" color="textPrimary" variant="h5">
              <FormattedMessage
                id="actions.task.payment.plan.percentagefee"
                defaultMessage="{fee}% fee"
                values={{ fee: fee }}
              />
            </Typography>
            <Typography align="center" color="textSecondary" variant="h6" gutterBottom>
              {category}
            </Typography>
          </PlanButton>
          <PlanBullets>
            <Typography align="center" variant="caption" gutterBottom>
              {title}
            </Typography>
            {items.map(
              (item, index) =>
                item && (
                  <Typography>
                    <CheckIcon fontSize="small" color="primary" />
                    {item}
                  </Typography>
                )
            )}
          </PlanBullets>
        </StyledCardContent>
      </StyledCard>
    </PlanGridItem>
  )
}

export default PlanCard
