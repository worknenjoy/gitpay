import React, { useState, useEffect } from 'react'
import { Select, Chip, FormControl, OutlinedInput } from '@mui/material'
import { useIntl, defineMessages } from 'react-intl'
import { useParams } from 'react-router-dom'
import { MenuItemCustom } from './issue-filter.styles'

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

interface IssueFilterProps {
  onFilter?: any
  counts: {
    allIssues: number
    withBounties: number
    noBounties: number
  }
}

const IssueFilter: React.FC<IssueFilterProps> = ({ onFilter, counts }) => {
  const { filter } = useParams<{ filter: string }>()
  const classes = classesStatic
  const intl = useIntl()

  const { allIssues, withBounties, noBounties } = counts

  const [taskListState, setTaskListState] = useState({
    tab: 'all',
    loading: true
  })

  const handleFilter = (value: string) => {
    setTaskListState({ ...taskListState, tab: value })
    onFilter?.(value)
  }

  useEffect(() => {
    setTaskListState({ ...taskListState, tab: filter ? filter : 'all' })
  }, [filter])

  const handleTabChange = async (event: any) => {
    const value = event.target.value
    handleFilter(value)
  }

  return (
    <FormControl sx={{ m: 1 }} fullWidth>
      <Select
        value={taskListState.tab}
        onChange={handleTabChange}
        sx={classes.select}
        input={<OutlinedInput size="small" />}
      >
        <MenuItemCustom value={'all'}>
          {intl.formatMessage(messages.allTasks)}
          <Chip
            label={allIssues}
            size="small"
            variant="outlined"
            sx={taskListState.tab === 'all' ? classes.chipActive : classes.chip}
          />
        </MenuItemCustom>
        <MenuItemCustom value={'withBounties'}>
          {intl.formatMessage(messages.allPublicTasksWithBounties)}
          <Chip
            label={withBounties}
            size="small"
            variant="outlined"
            sx={taskListState.tab === 'withBounties' ? classes.chipActive : classes.chip}
          />
        </MenuItemCustom>
        <MenuItemCustom value={'noBounties'}>
          {intl.formatMessage(messages.allPublicTasksNoBounties)}
          <Chip
            label={noBounties}
            size="small"
            variant="outlined"
            sx={taskListState.tab === 'noBounties' ? classes.chipActive : classes.chip}
          />
        </MenuItemCustom>
      </Select>
    </FormControl>
  )
}

export default IssueFilter
