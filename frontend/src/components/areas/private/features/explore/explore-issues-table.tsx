import React from 'react'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import { tableHeaderDefault } from '../../../../shared/table-metadata/task-header-metadata'
import IssueLinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import IssueStatusField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-status-field/issue-status-field'
import IssueProjectField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-project-field/issue-project-field'
import IssuePriceField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-price-field/issue-price-field'
import IssueLabelsField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-labels-field/issue-labels-field'
import IssueLanguageField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import IssueCreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-created-field/issue-created-field'

export const ExploreIssuesTable = ({ issues }) => {

  const customColumnRenderer = {
    title: (item:any) => (
      <IssueLinkField
        issue={item}
      />
    ),
    status: (item:any) => (
      <IssueStatusField
        issue={item}
      />
    ),
    project: (item:any) => (
      <IssueProjectField
        issue={item}
      />
    ),
    value: (item:any) => (
      <IssuePriceField
        issue={item}
      />
    ),
    labels: (item:any) => (
      <IssueLabelsField
        issue={item}
      />
    ),
    languages: (item:any) => (
      <IssueLanguageField
        issue={item}
      />
    ),
    createdAt: (item:any) => (
      <IssueCreatedField
        issue={item}
      />
    )
  }

  return (
    <SectionTable
      tableData={issues}
      tableHeaderMetadata={tableHeaderDefault}
      customColumnRenderer={customColumnRenderer}
    />
  )
}

export default ExploreIssuesTable