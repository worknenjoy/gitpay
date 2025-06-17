import React from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Link
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px'
  },
  checkbox: {
    marginBottom: '8px'
  }
});

const InviteDrawerCheckboxes = ({
  termsAgreed,
  handleCheckboxTerms,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} style={{ fontFamily: 'Roboto', color: '#a9a9a9' }}>
      <Grid item xs={12} style={{ paddingTop: 0 }} >
        <FormControlLabel
          control={
            <Checkbox
              checked={termsAgreed}
              onChange={handleCheckboxTerms}
              color="primary"
              style={{ paddingRight: 5 }}
            />
          }
          onClick={
            (e) => {
              e.preventDefault()
            }
          }
          label={
          <Typography variant="caption" >
            <FormattedMessage id="task.bounties.interested.termsOfUseLabel" defaultMessage="I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION" values={{
              termsOfUseAnchor: (
                <Link onClick={props.handleTermsDialog}>
                  <FormattedMessage id="task.bounties.interested.termsOfUse" defaultMessage="TERMS OF USE" />
                </Link>
              )
            }} />
          </Typography>}
        />
      </Grid>
    </Grid>
  );
};

export default InviteDrawerCheckboxes;