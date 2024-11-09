import React, { useState, useEffect } from 'react';
import { 
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  withStyles 
} from '@material-ui/core';
import { Theme, createStyles } from '@material-ui/core/styles';


const styles = (theme: Theme) =>
  createStyles({
    formPayment: {
      marginTop: 10,
      marginBottom: 10
    }
  });

const PriceInput = ({ classes, priceLabel, value, onChange, defaultValue, currency = '$', endAdornment = true }) => {
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
    <form className={classes.formPayment} action='POST'>
      <FormControl>
        <InputLabel htmlFor='adornment-amount'>
          {priceLabel}
        </InputLabel>
        <Input
          id='adornment-amount'
          endAdornment={
            endAdornment ? <InputAdornment position='end'> + </InputAdornment> : null
          }
          startAdornment={
            <InputAdornment position='start'>
              <span style={{ fontSize: 28 }}> {currency} </span>
            </InputAdornment>
          }
          type='number'
          inputProps={{ 'min': 0, style: { textAlign: 'right', height: 98 } }}
          defaultValue={defaultValue}
          value={price}
          onChange={handleChange}
          style={{ fontSize: 42, fontWeight: 'bold' }}
        />
      </FormControl>
    </form>
  );
}

export default withStyles(styles)(PriceInput)