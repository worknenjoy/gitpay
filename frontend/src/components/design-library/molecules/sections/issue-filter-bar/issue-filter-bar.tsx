import React, { useCallback, useMemo } from 'react'
import { AppBar } from '@mui/material'
import { defineMessages } from 'react-intl'
import LabelsFilter from '../../../atoms/filters/labels-filter/labels-filter'
import LanguageFilter from '../../../atoms/filters/languages-filter/languages-filter'
import IssueFilter from '../../../atoms/filters/issue-filter/issue-filter'
import IssueFilterStatus from '../../../atoms/filters/issue-status-filter/issue-status-filter'
import {
  FiltersToolbar,
  IssueFilterWrapper,
  IssueStatusFilterWrapper,
  LabelsFilterWrapper,
  LanguageFilterWrapper
} from './issue-filter.styles'

const classesStatic = {
  select: { backgroundColor: 'transparent' },
  chip: { marginLeft: 8 },
  chipActive: { marginLeft: 8, color: '#1a237e', borderColor: '#90caf9' }
} as const

const messages = defineMessages({
  allTasks: {
    id: 'task.list.lable.filterAllTasks',
    defaultMessage: 'All public issues available'
  },
  allPublicTasksWithBounties: {
    id: 'task.list.lable.filterWithBounties',
    defaultMessage: 'Issues with bounties'
  },
  allPublicTasksNoBounties: {
    id: 'task.list.lable.filterNoBounties',
    defaultMessage: 'Issues without bounties'
  }
})

interface TaskFiltersProps {
  issues: any
  labels: any
  listLabels?: any
  listTasks?: any
  filterTasks?: any
  languages: any
  listLanguages?: any
  // Server-side mode props
  serverSideMode?: boolean
  onServerFilterChange?: (filters: Record<string, any>) => void
}

const IssueFiltersBar: React.FC<TaskFiltersProps> = ({
  issues,
  labels,
  listLabels,
  listTasks,
  filterTasks,
  languages,
  listLanguages,
  serverSideMode = false,
  onServerFilterChange
}) => {
  // Keep the currently applied filters here
  const [activeFilters, setActiveFilters] = React.useState<Record<string, any>>({})

  // Client-side mode: merge new partial filters and call listTasks
  const mergedListTasks = useCallback(
    (partial: Record<string, any> = {}) => {
      setActiveFilters((prev) => {
        const next = Object.fromEntries(
          Object.entries({ ...prev, ...partial }).filter(([, v]) => v !== undefined)
        )
        listTasks?.(next)
        return next
      })
    },
    [listTasks]
  )

  // Server-side mode: merge new partial filters and notify parent
  const mergedServerFilters = useCallback(
    (partial: Record<string, any> = {}) => {
      setActiveFilters((prev) => {
        const next = Object.fromEntries(
          Object.entries({ ...prev, ...partial }).filter(([, v]) => v !== undefined)
        )
        onServerFilterChange?.(next)
        return next
      })
    },
    [onServerFilterChange]
  )

  const counts = useMemo(() => {
    if (serverSideMode) {
      // Counts are not meaningful when only the current page is loaded
      return { allIssues: -1, withBounties: -1, noBounties: -1 }
    }
    const base = issues ?? []
    const toNum = (v: any) => (typeof v === 'number' ? v : parseFloat(v)) || 0
    return {
      allIssues: base.length,
      withBounties: base.filter((t: any) => toNum(t.value) > 0).length,
      noBounties: base.filter((t: any) => toNum(t.value) === 0).length
    }
  }, [issues, serverSideMode])

  const handleFilter = (value: string) => {
    if (serverSideMode) {
      switch (value) {
        case 'withBounties':
          mergedServerFilters({ hasBounty: 'true' })
          break
        case 'noBounties':
          mergedServerFilters({ hasBounty: 'false' })
          break
        default:
          mergedServerFilters({ hasBounty: undefined })
      }
    } else {
      switch (value) {
        case 'withBounties':
          filterTasks('issuesWithBounties')
          break
        case 'noBounties':
          filterTasks('contribution')
          break
        default:
          filterTasks('all')
      }
    }
  }

  const handleStatusFilter = (value: string) => {
    const statusValue = value === 'all' ? undefined : value
    if (serverSideMode) {
      mergedServerFilters({ status: statusValue })
    } else {
      switch (value) {
        case 'all':
          mergedListTasks({ status: undefined })
          break
        case 'open':
          mergedListTasks({ status: 'open' })
          break
        case 'closed':
          mergedListTasks({ status: 'closed' })
          break
        default:
          mergedListTasks({})
          break
      }
    }
  }

  // The listTasks prop passed to sub-filters (labels/languages)
  const subFilterListTasks = serverSideMode ? mergedServerFilters : mergedListTasks

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ md: { p: 0, m: 0 } }}>
      <FiltersToolbar>
        <IssueFilterWrapper>
          <IssueFilter onFilter={handleFilter} counts={counts} />
        </IssueFilterWrapper>
        <IssueStatusFilterWrapper>
          <IssueFilterStatus onFilter={handleStatusFilter} />
        </IssueStatusFilterWrapper>
        <LabelsFilterWrapper>
          <LabelsFilter labels={labels} listLabels={listLabels} listTasks={subFilterListTasks} />
        </LabelsFilterWrapper>
        <LanguageFilterWrapper>
          <LanguageFilter
            languages={languages}
            listLanguages={listLanguages}
            listTasks={subFilterListTasks}
          />
        </LanguageFilterWrapper>
      </FiltersToolbar>
    </AppBar>
  )
}

export default IssueFiltersBar
