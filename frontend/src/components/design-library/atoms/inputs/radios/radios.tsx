import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Skeleton } from '@mui/material';

type RadioOption = {
  label: string | React.ReactNode;
  caption?: string | React.ReactNode;
  content?: string | React.ReactNode;
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
    <>
      {
        !completed ? (
          <>
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
          </>
        ) : (
          <FormControl component="fieldset">
            {label && <FormLabel component="legend">
              <Typography variant="body1" gutterBottom>{label}</Typography>
            </FormLabel>}
            <RadioGroup name={name} value={value} onChange={onChange}>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  style={{ margin: '4px 0', display: 'flex', alignItems: 'flex-start' }}
                  label={
                    <Box style={{marginTop: 6}}>
                      <Typography variant="body1">{option.label}</Typography>
                      {option.caption && (
                        <Typography variant="caption" color="textSecondary">
                          {option.caption}
                        </Typography>
                      )}
                      {option.content ? option.content : null}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        )
      }
    </>
  );
}
