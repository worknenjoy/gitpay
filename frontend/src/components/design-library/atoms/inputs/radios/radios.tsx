import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';
import Typography from '@mui/material/Typography/Typography';

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
}

export default function Radios({ name, label, options, value, onChange }: RadiosProps) {
  return (
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
  );
}
