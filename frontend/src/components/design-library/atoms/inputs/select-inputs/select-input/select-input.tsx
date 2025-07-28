import React from 'react';
import { Select, MenuItem } from '@material-ui/core';
import ReactPlaceholder from 'react-placeholder';

const SelectInput = ({ options, value, onChange, completed = true }) => {
  
  return (
    <ReactPlaceholder type='text' rows={1} ready={completed} showLoadingAnimation>
      <Select value={value} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} selected={option.value === value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </ReactPlaceholder>
  );
};

export default SelectInput;