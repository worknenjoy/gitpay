import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';
import Typography from '@mui/material/Typography/Typography';
import ReactPlaceholder from 'react-placeholder';

type RadioOption = {
  label: string | React.ReactNode;
  value: string;
}

type RadiosProps = {
  name: string;
  label?: string | React.ReactNode;
  options: RadioOption[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  completed?: boolean;
}

export default function Radios({ name, label, options, value, onChange, completed = true }: RadiosProps) {
  return (
    <ReactPlaceholder type='text' rows={3} ready={completed} showLoadingAnimation>
      <FormControl component="fieldset">
        {label && <FormLabel component="legend">
          <Typography variant="body1">{label}</Typography>
        </FormLabel>}
        <RadioGroup name={name} value={value} onChange={onChange}>
          {options.map((option) => (
            <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
          ))}
        </RadioGroup>
      </FormControl>
    </ReactPlaceholder>
  );
}
