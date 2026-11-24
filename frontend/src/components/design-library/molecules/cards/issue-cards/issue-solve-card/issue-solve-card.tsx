import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { HowToReg as SendIcon } from '@mui/icons-material'
import Button from 'design-library/atoms/buttons/button/button'
import DetailsSection from 'design-library/molecules/data-display/details-section/details-section'
import NumberedSteps from 'design-library/molecules/lists/numbered-steps/numbered-steps'
import IssueSidebarCardBase from '../issue-sidebar-card-base/issue-sidebar-card-base'

type IssueSolveCardProps = {
  bountyTotal: number
  /** Paid when accepted instead of on merge. */
  payLater?: boolean
  solutionsCount?: number
  /** Opens the list of solutions sent. Without it the header link is hidden. */
  onSolutions?: () => void
  onSend: () => void
  /** Issue level (difficulty). A value, or the owner's level picker. Omit → hidden. */
  level?: React.ReactNode
  disabled?: boolean
  completed?: boolean
}

/** Solve this issue: three steps and the Send solution action. */
const IssueSolveCard = ({
  bountyTotal,
  payLater = false,
  solutionsCount = 0,
  onSolutions,
  onSend,
  level,
  disabled = false,
  completed = true
}: IssueSolveCardProps) => {
  const amount = (
    <FormattedNumber value={bountyTotal} style="currency" currency="USD" minimumFractionDigits={2} />
  )
  return (
  <IssueSidebarCardBase
    caption={<FormattedMessage id="issue.solve.caption" defaultMessage="Solve this issue" />}
    headerAction={
      solutionsCount > 0 && onSolutions
        ? {
            label: (
              <FormattedMessage
                id="issue.solve.solutionsSent"
                defaultMessage="{count, plural, one {# solution sent} other {# solutions sent}}"
                values={{ count: solutionsCount }}
              />
            ),
            onClick: onSolutions
          }
        : undefined
    }
    completed={completed}
  >
    <NumberedSteps
      steps={[
        <FormattedMessage
          key="open"
          id="issue.solve.step.open"
          defaultMessage="<b>Open a pull request</b> on GitHub that fixes the issue"
          values={{ b: (chunks) => <b>{chunks}</b> }}
        />,
        <FormattedMessage
          key="send"
          id="issue.solve.step.send"
          defaultMessage="<b>Send it here</b> as your solution"
          values={{ b: (chunks) => <b>{chunks}</b> }}
        />,
        bountyTotal > 0 && payLater ? (
          <FormattedMessage
            key="paid"
            id="issue.solve.step.paid.later"
            defaultMessage="<b>Get paid</b> {amount} when a solution is accepted"
            values={{ b: (chunks) => <b>{chunks}</b>, amount }}
          />
        ) : bountyTotal > 0 ? (
          <FormattedMessage
            key="paid"
            id="issue.solve.step.paid"
            defaultMessage="<b>Get paid</b> {amount} when it's merged"
            values={{ b: (chunks) => <b>{chunks}</b>, amount }}
          />
        ) : (
          <FormattedMessage
            key="request"
            id="issue.solve.step.request"
            defaultMessage="<b>Get paid</b> on request when it's merged"
            values={{ b: (chunks) => <b>{chunks}</b> }}
          />
        )
      ]}
    />
    {level && (
      <DetailsSection
        items={[
          {
            label: <FormattedMessage id="task.level.label" defaultMessage="Level" />,
            value: level
          }
        ]}
      />
    )}
    <Button
      variant="contained"
      color="secondary"
      fullWidth
      endIcon={<SendIcon />}
      onClick={onSend}
      disabled={disabled}
      label={<FormattedMessage id="issue.actions.sendSolution" defaultMessage="Send solution" />}
    />
  </IssueSidebarCardBase>
  )
}

export default IssueSolveCard
