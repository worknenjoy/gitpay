import React from 'react'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import IssueLinkField from '../section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import IssueStatusField from '../section-table/section-table-custom-fields/issue/issue-status-field/issue-status-field'
import IssueProjectField from '../section-table/section-table-custom-fields/issue/issue-project-field/issue-project-field'
import AmountField from '../section-table/section-table-custom-fields/base/amount-field/amount-field'
import IssueLabelsField from '../section-table/section-table-custom-fields/issue/issue-labels-field/issue-labels-field'
import IssueLanguageField from '../section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import IssueCreatedField from '../section-table/section-table-custom-fields/issue/issue-created-field/issue-created-field'
import IssueFilterBar from 'design-library/molecules/sections/issue-filter-bar/issue-filter-bar'

const issueMetadata = {
  "issue": { sortable: true, numeric: false, dataBaseKey: "title", label: 'issue' },
  "status": { sortable: true, numeric: false, dataBaseKey: "description", label: 'Status'},
  "project": { sortable: true, numeric: false, dataBaseKey: "Project", label: 'Project' },
  "value": { sortable: true, numeric: true, dataBaseKey: "value", label: 'Amount' },
  "labels": { sortable: true, numeric: false, dataBaseKey: "labels", label: 'Labels' },
  "languages": { sortable: true, numeric: false, dataBaseKey: "languages", label: 'Languages' },
  "createdAt": { sortable: true, numeric: false, dataBaseKey: "createdAt", label: 'Created At' }
}

export const IssuesTable = ({ 
  issues,
  filterTasks,
  filteredTasks,
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
    project: (item:any) => (
      <IssueProjectField issue={item} />
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
        filterTasks={filterTasks}
        filteredTasks={filteredTasks}
        labels={labels}
        languages={languages}
        listLabels={listLabels}
        listLanguages={listLanguages}
        listTasks={listTasks}
        tasks={issues.data}
        baseUrl='/test/issues' 
      />
      <SectionTable
        tableData={issues}
        tableHeaderMetadata={issueMetadata}
        customColumnRenderer={customColumnRenderer}
      />
    </>
  )
}

export default IssuesTable