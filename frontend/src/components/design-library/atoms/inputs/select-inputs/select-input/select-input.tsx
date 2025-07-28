import React from 'react';
import { Select, MenuItem, FormControl } from '@material-ui/core';
import ReactPlaceholder from 'react-placeholder';

const SelectInput = ({ options, value, onChange, completed = true }) => {

  return (
    <ReactPlaceholder type="text" rows={1} ready={completed} showLoadingAnimation>
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
    </ReactPlaceholder>
  );

}

export default SelectInput;