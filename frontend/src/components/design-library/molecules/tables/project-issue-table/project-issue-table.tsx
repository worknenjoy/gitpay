import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import SectionTable from '../section-table/section-table'
import IssueLinkField from '../section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import IssueStatusField from '../section-table/section-table-custom-fields/issue/issue-status-field/issue-status-field'
import AmountField from '../section-table/section-table-custom-fields/base/amount-field/amount-field'
import IssueLabelsField from '../section-table/section-table-custom-fields/issue/issue-labels-field/issue-labels-field'
import IssueLanguageField from '../section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import IssueCreatedField from '../section-table/section-table-custom-fields/issue/issue-created-field/issue-created-field'
import IssueFilterBar from '../../sections/issue-filter-bar/issue-filter-bar'

const messages = defineMessages({
  issue: {
    id: 'table.header.issue',
    defaultMessage: 'issue'
  },
  status: {
    id: 'table.header.status',
    defaultMessage: 'Status'
  },
  amount: {
    id: 'table.header.amount',
    defaultMessage: 'Amount'
  },
  labels: {
    id: 'table.header.labels',
    defaultMessage: 'Labels'
  },
  languages: {
    id: 'table.header.languages',
    defaultMessage: 'Languages'
  },
  createdAt: {
    id: 'table.header.createdAt',
    defaultMessage: 'Created at'
  }
})

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
  const intl = useIntl()
  
  const issueMetadata = {
    issue: { sortable: true, numeric: false, dataBaseKey: 'title', label: intl.formatMessage(messages.issue) },
    status: { sortable: true, numeric: false, dataBaseKey: 'description', label: intl.formatMessage(messages.status) },
    value: { sortable: true, numeric: true, dataBaseKey: 'value', label: intl.formatMessage(messages.amount) },
    labels: { sortable: true, numeric: false, dataBaseKey: 'Labels', label: intl.formatMessage(messages.labels) },
    languages: {
      sortable: true,
      numeric: false,
      dataBaseKey: 'ProgrammingLanguage',
      label: intl.formatMessage(messages.languages)
    },
    createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: intl.formatMessage(messages.createdAt) }
  }
  
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
