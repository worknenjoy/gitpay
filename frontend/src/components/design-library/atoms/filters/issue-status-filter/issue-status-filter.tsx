import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IssueStatus from 'design-library/atoms/status/issue-status/issue-status';

const IssueStatusFilter = function() {

  const statuses = [
    { id: 'all', name: 'All' },
    { id: 'open', name: 'Open' },
    { id: 'closed', name: 'Closed' }
  ];

  return (
    <div>
      <FormControl sx={{ m: 1 }} fullWidth>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          name={'issueStatus'}
          variant="outlined"
          value={'all'}
          input={
            <OutlinedInput 
              size="small"
            />
          }
        >
          {statuses?.map(({name, id}) => (
            <MenuItem key={id} value={id}>
              {id === 'all' ? name : <IssueStatus status={id} />}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default IssueStatusFilter;