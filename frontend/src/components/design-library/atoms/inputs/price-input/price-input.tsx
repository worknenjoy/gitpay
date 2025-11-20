import React, { useState, useEffect } from 'react'
import { FormControl, InputLabel, Input, InputAdornment } from '@mui/material'
import getPriceInputStyles from './price-input.styles'
import { useTheme } from '@mui/material/styles'

const PriceInput = ({
  priceLabel,
  value,
  onChange,
  defaultValue,
  currency = '$',
  endAdornment = true
}) => {
  const theme = useTheme()
  const styles = getPriceInputStyles(theme)
  const [price, setPrice] = useState(0)

  const handleChange = (event) => {
    const currentValue = event.target.value
    setPrice(currentValue)
    onChange(currentValue)
  }

  useEffect(() => {
    setPrice(value)
    onChange(value)
  }, [value])

  return (
    <form style={styles.formPayment as React.CSSProperties} action="POST">
      <FormControl>
        <InputLabel htmlFor="adornment-amount">{priceLabel}</InputLabel>
        <Input
          id="adornment-amount"
          endAdornment={endAdornment ? <InputAdornment position="end"> + </InputAdornment> : null}
          startAdornment={
            <InputAdornment position="start">
              <span style={styles.currencySymbol as React.CSSProperties}> {currency} </span>
            </InputAdornment>
          }
          type="number"
          inputProps={{ min: 0 }}
          defaultValue={defaultValue}
          value={price}
          onChange={handleChange}
          sx={styles.input}
        />
      </FormControl>
    </form>
  )
}

export default PriceInput
