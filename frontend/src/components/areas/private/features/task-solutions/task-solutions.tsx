import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import PrimaryDataPage from 'design-library/pages/private-pages/data-pages/primary-data-page/primary-data-page'
import SolutionStatus from 'design-library/atoms/status/solution-status/solution-status'
import IssueLinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import LinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/link-field/link-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import { AssignmentTurnedIn as SolutionIcon } from '@mui/icons-material'

const TaskSolutions = ({ user, taskSolutions, listTaskSolutions }) => {
  useEffect(() => {
    if (user?.id) {
      listTaskSolutions()
    }
  }, [user])

  return (
    <PrimaryDataPage
      title={<FormattedMessage id="account.profile.solutions.title" defaultMessage="Solutions" />}
      description={
        <FormattedMessage
          id="account.profile.solutions.description"
          defaultMessage="List of solutions submitted by you for issues with bounties."
        />
      }
      emptyComponent={
        <EmptyBase
          icon={<SolutionIcon />}
          text={
            <FormattedMessage
              id="account.profile.solutions.empty"
              defaultMessage="You have not submitted any solutions yet."
            />
          }
          secondaryText={
            <FormattedMessage
              id="account.profile.solutions.empty.subtitle"
              defaultMessage="Submit a pull request on an issue with a bounty to see your solutions here."
            />
          }
          completed={taskSolutions.completed}
        />
      }
      table={{
        tableData: taskSolutions,
        tableHeaderMetadata: {
          issue: {
            label: <FormattedMessage id="account.profile.solutions.issue" defaultMessage="Issue" />
          },
          pullRequestURL: {
            label: (
              <FormattedMessage
                id="account.profile.solutions.pullRequestURL"
                defaultMessage="Pull Request"
              />
            )
          },
          isPRMerged: {
            label: (
              <FormattedMessage id="account.profile.solutions.isPRMerged" defaultMessage="Status" />
            )
          },
          createdAt: {
            sortable: true,
            dataBaseKey: 'createdAt',
            label: (
              <FormattedMessage
                id="account.profile.solutions.createdAt"
                defaultMessage="Submitted At"
              />
            )
          }
        },
        customColumnRenderer: {
          issue: (item: any) => <IssueLinkField issue={item?.Task} />,
          pullRequestURL: (item: any) => (
            <LinkField
              url={item.pullRequestURL}
              title={item.pullRequestURL}
              tooltipTitle={item.pullRequestURL}
              copiable
              limit={40}
            />
          ),
          isPRMerged: (item: any) => (
            <SolutionStatus
              status={item.isPRMerged ? 'merged' : item.isIssueClosed ? 'closed' : 'open'}
            />
          ),
          createdAt: (item: any) => <CreatedField createdAt={item.createdAt} />
        }
      }}
    />
  )
}

export default TaskSolutions
