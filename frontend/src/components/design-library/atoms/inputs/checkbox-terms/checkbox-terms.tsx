import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox, FormControlLabel, Grid, Link, Typography } from '@mui/material';
import getCheckboxTermsStyles from './checkbox-terms.styles';
import { useTheme } from '@mui/material/styles';
import TermsDialog from './terms-dialog';
// import { on } from 'events';


const CheckboxTerms = ({ onAccept }) => {
  const theme = useTheme();
  const styles = getCheckboxTermsStyles(theme);
  const [checked, setChecked] = useState(false);
  const [ openTerms, setOpenTerms ] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    onAccept?.(checked);
  }, [checked]);

  return (
  <Grid size={{ xs: 12 }} sx={styles.termsLabel}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              color="primary"
              sx={styles.checkbox}
            />
          }
          onClick={handleChange}
          label={<Typography variant="caption" >
            <FormattedMessage id="task.bounties.interested.termsOfUseLabel" defaultMessage="I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION" values={{
              termsOfUseAnchor: (
                <Link onClick={() => setOpenTerms(true)}>
                  <FormattedMessage id="task.bounties.interested.termsOfUse" defaultMessage="TERMS OF USE" />
                </Link>
              )
            }} />
          </Typography>}
        />
        <TermsDialog
          open={openTerms}
          onClose={() => setOpenTerms(false) } onAccept={() => setChecked(true)} onDisagree={() => setChecked(false)}
        />
      </Grid>
  );
};

export default CheckboxTerms;