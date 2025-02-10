import React from 'react'
import SectionTable from '../../design-library/molecules/section-table/section-table'
import { tableHeaderDefault } from '../../task/task-header-metadata'
import IssueLinkField from '../../design-library/molecules/section-table/section-table-custom-fields/IssueLinkField/issue-link-field'

export const ExploreIssuesTable = ({ issues }) => {

  const customColumnRenderer = {
   title: (value:any) => (
      <IssueLinkField
        issue={value}
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