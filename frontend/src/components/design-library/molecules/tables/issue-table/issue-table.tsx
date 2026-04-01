import React from 'react'
import SectionTable from '../../../molecules/tables/section-table/section-table'
import IssueLinkField from '../section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import IssueStatusField from '../section-table/section-table-custom-fields/issue/issue-status-field/issue-status-field'
import IssueProjectField from '../section-table/section-table-custom-fields/issue/issue-project-field/issue-project-field'
import AmountField from '../section-table/section-table-custom-fields/base/amount-field/amount-field'
import IssueLabelsField from '../section-table/section-table-custom-fields/issue/issue-labels-field/issue-labels-field'
import IssueLanguageField from '../section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import IssueCreatedField from '../section-table/section-table-custom-fields/issue/issue-created-field/issue-created-field'
import IssueFilterBar from '../../../molecules/sections/issue-filter-bar/issue-filter-bar'
import useIssueMetadata from '../../../../../hooks/use-issue-metadata'

export { useIssueMetadata }

export const customColumnRenderer = {
  issue: (item: any) => <IssueLinkField issue={item} />,
  status: (item: any) => <IssueStatusField issue={item} />,
  project: (item: any) => <IssueProjectField issue={item} />,
  value: (item: any) => <AmountField value={item.value} />,
  labels: (item: any) => <IssueLabelsField issue={item} />,
  languages: (item: any) => <IssueLanguageField issue={item} />,
  createdAt: (item: any) => <IssueCreatedField issue={item} />
}

interface IssuesTableProps {
  filterTasks: (...args: any[]) => void
  issues: { data: any[]; completed: boolean; totalCount?: number }
  labels: any
  languages: any
  listLabels?: () => void
  listLanguages?: () => void
  listTasks: (params: Record<string, any>) => void
  serverSidePagination?: boolean
  defaultRowsPerPage?: number
}

export const IssuesTable = ({
  filterTasks,
  issues,
  labels,
  languages,
  listLabels,
  listLanguages,
  listTasks,
  serverSidePagination = false,
  defaultRowsPerPage = 10
}: IssuesTableProps) => {
  const issueMetadata = useIssueMetadata({ includeProject: true })

  // Coordination state — only meaningful in server-side mode
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage)
  const [currentFilters, setCurrentFilters] = React.useState<Record<string, any>>({})

  // Called by IssueFiltersBar when any filter changes (server-side mode)
  const handleServerFilterChange = React.useCallback(
    (filters: Record<string, any>) => {
      setCurrentFilters(filters)
      setPage(0)
      listTasks({ ...filters, page: 0, limit: rowsPerPage })
    },
    [listTasks, rowsPerPage]
  )

  // Called by SectionTable when page changes (server-side mode)
  const handlePageChange = React.useCallback(
    (newPage: number) => {
      setPage(newPage)
      listTasks({ ...currentFilters, page: newPage, limit: rowsPerPage })
    },
    [listTasks, currentFilters, rowsPerPage]
  )

  // Called by SectionTable when rows-per-page changes (server-side mode)
  const handleRowsPerPageChange = React.useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPage(newRowsPerPage)
      setPage(0)
      listTasks({ ...currentFilters, page: 0, limit: newRowsPerPage })
    },
    [listTasks, currentFilters]
  )

  return (
    <>
      <IssueFilterBar
        labels={labels}
        languages={languages}
        listLabels={listLabels}
        listLanguages={listLanguages}
        listTasks={serverSidePagination ? undefined : listTasks}
        filterTasks={filterTasks}
        issues={issues.data}
        serverSideMode={serverSidePagination}
        onServerFilterChange={serverSidePagination ? handleServerFilterChange : undefined}
      />
      <SectionTable
        tableData={issues}
        tableHeaderMetadata={issueMetadata}
        customColumnRenderer={customColumnRenderer}
        serverSidePagination={
          serverSidePagination
            ? {
                enabled: true,
                totalCount: issues.totalCount ?? 0,
                page,
                rowsPerPage,
                onPageChange: handlePageChange,
                onRowsPerPageChange: handleRowsPerPageChange
              }
            : undefined
        }
      />
    </>
  )
}

export default IssuesTable
