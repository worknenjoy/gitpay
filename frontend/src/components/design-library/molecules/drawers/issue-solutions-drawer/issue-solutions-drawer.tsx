import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { InfoOutlined as InfoIcon } from '@mui/icons-material'
import DetailsSidePanel from 'design-library/molecules/drawers/details-side-panel/details-side-panel'
import IssueSolutionsList, {
  IssueSolution
} from 'design-library/molecules/lists/issue-solutions-list/issue-solutions-list'
import { Note } from '../bounty-breakdown-drawer/bounty-breakdown-drawer.styles'

type IssueSolutionsDrawerProps = {
  open: boolean
  onClose: () => void
  solutions: IssueSolution[]
  onSendSolution?: () => void
  completed?: boolean
}

/** Pull requests sent as solutions for an issue. */
const IssueSolutionsDrawer = ({
  open,
  onClose,
  solutions,
  onSendSolution,
  completed = true
}: IssueSolutionsDrawerProps) => {
  const intl = useIntl()
  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      mode="medium"
      completed={completed}
      title={<FormattedMessage id="issueSolutions.title" defaultMessage="Solutions sent" />}
      subtitle={
        <FormattedMessage
          id="issueSolutions.subtitle"
          defaultMessage="Pull requests sent as solutions for this issue. Payment is released to the solution that gets merged."
        />
      }
      actions={[
        {
          label: intl.formatMessage({ id: 'general.close', defaultMessage: 'Close' }),
          onClick: onClose,
          variant: 'contained',
          color: 'primary'
        }
      ]}
    >
      <IssueSolutionsList solutions={solutions} onSendSolution={onSendSolution} />
      <Note>
        <InfoIcon />
        <FormattedMessage
          id="issueSolutions.note"
          defaultMessage="Only merged pull requests that reference this issue can be paid."
        />
      </Note>
    </DetailsSidePanel>
  )
}

export default IssueSolutionsDrawer
