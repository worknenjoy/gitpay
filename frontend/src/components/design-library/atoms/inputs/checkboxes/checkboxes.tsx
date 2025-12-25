import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { Grid, FormControlLabel } from '@mui/material'
import { CheckboxesContainer, CheckboxItem, StyledCheckbox } from './checkboxes.styles'
import CheckboxesPlaceholder from './checkboxes.placeholder'

type CheckboxesProps = {
  checkboxes: any[]
  includeSelectAll?: boolean
  onChange?: (checked: Array<String>) => void
  completed?: boolean
}

const Checkboxes = ({
  checkboxes,
  onChange,
  includeSelectAll = false,
  completed = true
}: CheckboxesProps) => {
  // Initialize once, don’t reset on every parent re-render
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    checkboxes.reduce((acc, checkbox) => {
      acc[checkbox.name] = !!checkbox.defaultChecked
      return acc
    }, {} as Record<string, boolean>)
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, onChangeCheckbox) => {
      const { name, checked: isChecked } = event.target

      setChecked(prev => {
        if (name === 'all') {
          // toggle all others
          const next = checkboxes.reduce((acc, cb) => {
            acc[cb.name] = isChecked
            return acc
          }, {} as Record<string, boolean>)
          return next
        }
        return { ...prev, [name]: isChecked }
      })

      onChangeCheckbox?.(isChecked)
    },
    [checkboxes]
  )

  // Derive "all" state instead of storing it
  const allOptionsChecked = useMemo(
    () =>
      checkboxes
        .filter(cb => cb.name !== 'all')
        .every(cb => checked[cb.name] || false),
    [checkboxes, checked]
  )

  useEffect(() => {
    const selectedCheckboxes = Object.keys(checked)
      .filter(key => key !== 'all')
      .filter(key => checked[key])
      .map(key => checkboxes.find(checkbox => checkbox.name === key)?.value)
    onChange?.(selectedCheckboxes)
  }, [checked, onChange, checkboxes])

  const selectBoxesWithAll = [
    ...checkboxes,
    { label: 'All', name: 'all', value: 'all' }
  ]
  const checkboxesToRender = includeSelectAll ? selectBoxesWithAll : checkboxes

  const items = checkboxesToRender.length > 0 ? checkboxesToRender.length : 3

  return completed ? (
    <CheckboxesContainer>
      <Grid container spacing={3}>
        {checkboxesToRender.map((checkbox, index) => (
          <Grid key={checkbox?.name || index} size={{ xs: 12, sm: 12 / checkboxesToRender.length }}>
            <CheckboxItem>
              <FormControlLabel
                control={
                  <StyledCheckbox
                    checked={checkbox.name === 'all' ? allOptionsChecked : (checked[checkbox.name] || false)}
                    onChange={(e) => handleChange(e, checkbox?.onChange)}
                    color="primary"
                    name={checkbox.name}
                    value={checkbox.value}
                    disabled={checkbox.disabled}
                  />
                }
                label={checkbox.label}
              />
            </CheckboxItem>
          </Grid>
        ))}
      </Grid>
    </CheckboxesContainer>
  ) : (
    <CheckboxesPlaceholder items={items} />
  )
}

export default Checkboxes