import React from 'react'
import { OutlinedInput, MenuItem, FormControl, Select } from '@mui/material'
import IssueStatus from 'design-library/atoms/status/issue-status/issue-status'

const IssueStatusFilter = function ({ onFilter }) {
  const [value, setValue] = React.useState('all')

  const handleChange = (event) => {
    setValue(event.target.value)
    onFilter?.(event.target.value)
  }

  const statuses = [
    { id: 'all', name: 'All Statuses' },
    { id: 'open', name: 'Open' },
    { id: 'closed', name: 'Closed' },
  ]

  return (
    <div>
      <FormControl sx={{ m: 1 }} fullWidth>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          name={'issueStatus'}
          variant="outlined"
          onChange={handleChange}
          value={value}
          input={<OutlinedInput size="small" />}
        >
          {statuses?.map(({ name, id }) => (
            <MenuItem key={id} value={id}>
              {id === 'all' ? name : <IssueStatus status={id} />}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default IssueStatusFilter
