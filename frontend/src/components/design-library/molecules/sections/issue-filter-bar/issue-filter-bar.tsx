import React, { useCallback, useMemo } from 'react'
import { AppBar, Toolbar } from '@mui/material'
import { defineMessages } from 'react-intl'
import LabelsFilter from '../../../atoms/filters/labels-filter/labels-filter'
import LanguageFilter from '../../../atoms/filters/languages-filter/languages-filter'
import IssueFilter from '../../../atoms/filters/issue-filter/issue-filter'
import IssueFilterStatus from '../../../atoms/filters/issue-status-filter/issue-status-filter'

const classesStatic = {
  select: { backgroundColor: 'transparent' },
  chip: { marginLeft: 8 },
  chipActive: { marginLeft: 8, color: '#1a237e', borderColor: '#90caf9' },
} as const

const messages = defineMessages({
  allTasks: {
    id: 'task.list.lable.filterAllTasks',
    defaultMessage: 'All public issues available',
  },
  allPublicTasksWithBounties: {
    id: 'task.list.lable.filterWithBounties',
    defaultMessage: 'Issues with bounties',
  },
  allPublicTasksNoBounties: {
    id: 'task.list.lable.filterNoBounties',
    defaultMessage: 'Issues without bounties',
  },
})

interface TaskFiltersProps {
  issues: any
  labels: any
  listLabels?: any
  listTasks?: any
  filterTasks?: any
  languages: any
  listLanguages?: any
}

const IssueFiltersBar: React.FC<TaskFiltersProps> = ({
  issues,
  labels,
  listLabels,
  listTasks,
  filterTasks,
  languages,
  listLanguages,
}) => {
  // Keep the currently applied filters here
  const [activeFilters, setActiveFilters] = React.useState<Record<string, any>>({})

  // Wrap listTasks to merge new partial filters with the current ones
  const mergedListTasks = useCallback(
    (partial: Record<string, any> = {}) => {
      setActiveFilters((prev) => {
        // Merge and remove keys explicitly set to undefined (to "clear" a filter)
        const next = Object.fromEntries(
          Object.entries({ ...prev, ...partial }).filter(([, v]) => v !== undefined),
        )
        listTasks?.(next)
        return next
      })
    },
    [listTasks],
  )

  const counts = useMemo(() => {
    const base = issues ?? []
    const toNum = (v: any) => (typeof v === 'number' ? v : parseFloat(v)) || 0
    return {
      allIssues: base.length,
      withBounties: base.filter((t: any) => toNum(t.value) > 0).length,
      noBounties: base.filter((t: any) => toNum(t.value) === 0).length,
    }
  }, [issues])

  const handleFilter = (value: string) => {
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

  const handleStatusFilter = (value: string) => {
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

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar style={{ display: 'flex', placeContent: 'space-between', margin: 0, padding: 0 }}>
        <div style={{ width: '25%', marginRight: 12 }}>
          <IssueFilter onFilter={handleFilter} counts={counts} />
        </div>
        <div style={{ width: '15%', marginRight: 12 }}>
          <IssueFilterStatus onFilter={handleStatusFilter} />
        </div>
        <div style={{ width: '30%', marginRight: 12 }}>
          <LabelsFilter labels={labels} listLabels={listLabels} listTasks={mergedListTasks} />
        </div>
        <div style={{ width: '30%', marginRight: 12 }}>
          <LanguageFilter
            languages={languages}
            listLanguages={listLanguages}
            listTasks={mergedListTasks}
          />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default IssueFiltersBar
