import React from 'react'
import { FormattedMessage } from 'react-intl'
import SectionTable from '../section-table/section-table'
import IssueLinkField from '../section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import IssueStatusField from '../section-table/section-table-custom-fields/issue/issue-status-field/issue-status-field'
import AmountField from '../section-table/section-table-custom-fields/base/amount-field/amount-field'
import IssueLabelsField from '../section-table/section-table-custom-fields/issue/issue-labels-field/issue-labels-field'
import IssueLanguageField from '../section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import IssueCreatedField from '../section-table/section-table-custom-fields/issue/issue-created-field/issue-created-field'
import IssueFilterBar from '../../sections/issue-filter-bar/issue-filter-bar'

export const issueMetadata = {
  issue: { sortable: true, numeric: false, dataBaseKey: 'title', label: <FormattedMessage id="table.header.issue" defaultMessage="issue" /> },
  status: { sortable: true, numeric: false, dataBaseKey: 'description', label: <FormattedMessage id="table.header.status" defaultMessage="Status" /> },
  value: { sortable: true, numeric: true, dataBaseKey: 'value', label: <FormattedMessage id="table.header.amount" defaultMessage="Amount" /> },
  labels: { sortable: true, numeric: false, dataBaseKey: 'Labels', label: <FormattedMessage id="table.header.labels" defaultMessage="Labels" /> },
  languages: {
    sortable: true,
    numeric: false,
    dataBaseKey: 'ProgrammingLanguage',
    label: <FormattedMessage id="table.header.languages" defaultMessage="Languages" />
  },
  createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: <FormattedMessage id="table.header.createdAt" defaultMessage="Created at" /> }
}

export const customColumnRenderer = {
  issue: (item: any) => <IssueLinkField issue={item} />,
  status: (item: any) => <IssueStatusField issue={item} />,
  value: (item: any) => <AmountField value={item.value} />,
  labels: (item: any) => <IssueLabelsField issue={item} />,
  languages: (item: any) => <IssueLanguageField issue={item} />,
  createdAt: (item: any) => <IssueCreatedField issue={item} />
}

export const ProjectIssuesTable = ({
  filterTasks,
  issues,
  labels,
  languages,
  listLabels,
  listLanguages,
  listTasks
}) => {
  return (
    <>
      <IssueFilterBar
        labels={labels}
        languages={languages}
        listLabels={listLabels}
        listLanguages={listLanguages}
        listTasks={listTasks}
        filterTasks={filterTasks}
        issues={issues.data}
      />
      <SectionTable
        tableData={issues}
        tableHeaderMetadata={issueMetadata}
        customColumnRenderer={customColumnRenderer}
      />
    </>
  )
}

export default ProjectIssuesTable
