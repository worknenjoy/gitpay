import React, { useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function TaskFilterLabels({labels, listLabels, listTasks}) {
  const [currentLabels, setCurrentLabels] = React.useState<typeof labels>([]);

  const handleChange = (event: SelectChangeEvent<typeof labels>) => {
    const {
      target: { value },
    } = event;
    setCurrentLabels(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    listTasks && value && listTasks({labelIds: value})
  };

  useEffect(() => {
    listLabels()
    console.log(labels)
  }, [listLabels])

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label" size='small'>
          Labels
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          name={'labelIds'}
          value={currentLabels}
          onChange={handleChange}
          input={
            <OutlinedInput 
              label="Labels"
              size='small'
            />
          }
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {labels?.data?.map(({name, id}) => (
            <MenuItem key={id} value={id}>
              <Checkbox checked={currentLabels.find(l => l === id)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}