import React from 'react'
import { Radio, RadioGroup, FormControl, FormLabel } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Skeleton } from '@mui/material'
import { RowFormControlLabel, ContentBox } from './radios.styles'

type RadioOption = {
  label: string | React.ReactNode
  caption?: string | React.ReactNode
  content?: string | React.ReactNode
  value: string
}

type RadiosProps = {
  name: string
  label?: string | React.ReactNode
  options: RadioOption[]
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  completed?: boolean
}

export default function Radios({
  name,
  label,
  options,
  value,
  onChange,
  completed = true
}: RadiosProps) {
  return (
    <>
      {!completed ? (
        <>
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
        </>
      ) : (
        <FormControl component="fieldset">
          {label && (
            <FormLabel component="legend">
              <Typography variant="body1" gutterBottom>
                {label}
              </Typography>
            </FormLabel>
          )}
          <RadioGroup name={name} value={value} onChange={onChange}>
            {options.map((option) => (
              <RowFormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={
                  <ContentBox>
                    <Typography variant="body1">{option.label}</Typography>
                    {option.caption && (
                      <Typography variant="caption" color="textSecondary">
                        {option.caption}
                      </Typography>
                    )}
                    {option.content ? option.content : null}
                  </ContentBox>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </>
  )
}
