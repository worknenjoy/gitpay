import React from 'react'
import SectionTable from '../section-table/section-table'
import IssueLinkField from '../section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import IssueStatusField from '../section-table/section-table-custom-fields/issue/issue-status-field/issue-status-field'
import IssueProjectField from '../section-table/section-table-custom-fields/issue/issue-project-field/issue-project-field'
import AmountField from '../section-table/section-table-custom-fields/base/amount-field/amount-field'
import IssueLabelsField from '../section-table/section-table-custom-fields/issue/issue-labels-field/issue-labels-field'
import IssueLanguageField from '../section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import IssueCreatedField from '../section-table/section-table-custom-fields/issue/issue-created-field/issue-created-field'
import IssueFilterBar from '../../sections/issue-filter-bar/issue-filter-bar'

const issueMetadata = {
  "issue": { sortable: true, numeric: false, dataBaseKey: "title", label: 'issue' },
  "status": { sortable: true, numeric: false, dataBaseKey: "description", label: 'Status'},
  "value": { sortable: true, numeric: true, dataBaseKey: "value", label: 'Amount' },
  "labels": { sortable: true, numeric: false, dataBaseKey: "Labels", label: 'Labels' },
  "languages": { sortable: true, numeric: false, dataBaseKey: "ProgrammingLanguage", label: 'Languages' },
  "createdAt": { sortable: true, numeric: false, dataBaseKey: "createdAt", label: 'Created At' }
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

  const customColumnRenderer = {
    issue: (item:any) => (
      <IssueLinkField issue={item} />
    ),
    status: (item:any) => (
      <IssueStatusField issue={item} />
    ),
    value: (item:any) => (
      <AmountField value={item.value} />
    ),
    labels: (item:any) => (
      <IssueLabelsField issue={item} />
    ),
    languages: (item:any) => (
      <IssueLanguageField issue={item} />
    ),
    createdAt: (item:any) => (
      <IssueCreatedField issue={item} />
    )
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