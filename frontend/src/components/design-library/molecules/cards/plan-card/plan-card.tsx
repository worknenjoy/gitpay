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
  PlanIcon
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
}

const PlanCard = ({ plan }: PlanProps) => {
  const { fee, category, title, items } = plan
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
                  <Typography key={index}>
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
