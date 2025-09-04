import React, { useEffect, useState } from 'react';
import { Grid, FormControlLabel } from '@mui/material';
import { CheckboxesContainer, CheckboxItem, StyledCheckbox } from './checkboxes.styles';

type CheckboxesProps = {
  checkboxes: any;
  includeSelectAll?: boolean;
  onChange?: (checked: Array<String>) => void;
};


const Checkboxes = ({ checkboxes, onChange, includeSelectAll = false }:CheckboxesProps) => {
  const [checked, setChecked] = useState({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, onChangeCheckbox) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked
    });
    onChangeCheckbox?.(event.target.checked);
  };

  useEffect(() => {
    const selectedCheckboxes = Object.keys(checked)
      .filter((key) => key !== 'all')
      .filter((key) => checked[key])
      .map((key) => checkboxes.find((checkbox) => checkbox.name === key)?.value);
    onChange?.(selectedCheckboxes);
  }, [checked]);

  const selectBoxesWithAll = [...checkboxes, {
    label: 'All',
    name: 'all',
    value: 'all',
    onChange: (selected) => {
      if(selected) {
        setChecked(
          checkboxes.reduce((acc, checkbox) => {
            acc[checkbox.name] = true;
            return acc;
          }
          , {all: true})
        );
      } else {
        setChecked(
          checkboxes.reduce((acc, checkbox) => {
            acc[checkbox.name] = false;
            return acc;
          }
          , {all: false})
        );
      }
    }
  }];
  const checkboxesToRender = includeSelectAll ? selectBoxesWithAll : checkboxes;

  useEffect(() => {
    const allOptionsChecked = checkboxes
      .filter((checkbox) => checkbox.name !== 'all')
      .every((checkbox) => checked[checkbox.name] || false);

    if (checked['all'] !== allOptionsChecked) {
      setChecked((prevChecked) => ({
        ...prevChecked,
        all: allOptionsChecked
      }));
    }
  }, [checked, checkboxes]);


  return (
    <CheckboxesContainer>
      <Grid container spacing={3}>
        {checkboxesToRender.map((checkbox, index) => (
          <Grid key={checkbox?.name || index} size={{ xs: 12, sm: 12 / checkboxesToRender.length }}>
            <CheckboxItem>
              <FormControlLabel
                control={
                  <StyledCheckbox
                    checked={checked[checkbox.name] || false}
                    onChange={(e) => handleChange(e, checkbox?.onChange)}
                    color="primary"
                    name={checkbox.name}
                    value={checkbox.value}
                  />
                }
                label={checkbox.label}
              />
            </CheckboxItem>
          </Grid>
        ))}
      </Grid>
    </CheckboxesContainer>
  );
};

export default Checkboxes;