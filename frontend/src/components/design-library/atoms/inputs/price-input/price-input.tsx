import React, { useState, useEffect } from 'react';
import { 
  FormControl,
  InputLabel,
  Input,
  InputAdornment
} from '@mui/material';
import useStyles from './price-input.styles';


const PriceInput = ({ priceLabel, value, onChange, defaultValue, currency = '$', endAdornment = true }) => {
  const classes = useStyles();
  const [ price, setPrice ] = useState(0)

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
    <form className={classes.formPayment} action="POST">
      <FormControl>
        <InputLabel htmlFor="adornment-amount">
          {priceLabel}
        </InputLabel>
        <Input
          id="adornment-amount"
          endAdornment={
            endAdornment ? <InputAdornment position="end"> + </InputAdornment> : null
          }
          startAdornment={
            <InputAdornment position="start">
              <span className={classes.currencySymbol}> {currency} </span>
            </InputAdornment>
          }
          type="number"
          inputProps={{ 'min': 0 }}
          defaultValue={defaultValue}
          value={price}
          onChange={handleChange}
          className={classes.input}
        />
      </FormControl>
    </form>
  );
}

export default PriceInput
