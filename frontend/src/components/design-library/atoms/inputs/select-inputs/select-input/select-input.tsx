import React from 'react';
import { Select, MenuItem } from '@material-ui/core';

const SelectInput = ({ options, value, onChange }) => {
  
  return (
    <Select value={value} onChange={onChange}>
      <MenuItem value="" selected={value === ''}>Select an option</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} selected={option.value === value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectInput;