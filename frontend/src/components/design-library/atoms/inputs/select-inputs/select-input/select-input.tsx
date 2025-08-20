import React from 'react';
import { Select, MenuItem, FormControl, Skeleton } from '@mui/material';

const SelectInput = ({ options, value, onChange, completed = true }) => {

  return (
    completed ? (
      <FormControl variant="standard" size="medium" style={{ margin: '10px 0', width: '100%' }}>
        <Select
          SelectDisplayProps={{ style: { paddingTop: 8, paddingBottom: 8 } }}
          value={value}
          onChange={onChange}
          style={{ width: "100%" }}
          MenuProps={{
            PaperProps: {
              style: { maxHeight: 400 }
            }
          }}
          inputProps={{
            style: { height: 130, boxSizing: 'border-box', padding: 10 }
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              selected={option.value === value}
              style={{ padding: 10, height: 30 }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ) : (
      <Skeleton variant="rectangular" width="100%" height={56} animation="wave" />
    )
  );
}

export default SelectInput;