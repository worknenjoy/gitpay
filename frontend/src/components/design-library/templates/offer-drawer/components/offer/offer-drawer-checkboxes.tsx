import {
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Link
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import Checkboxes from '../../../../molecules/checkboxes/checkboxes';

const useStyles = makeStyles((theme) => ({
  container: {
    fontFamily: 'Roboto',
    color: '#a9a9a9',
  },
  item: {
    paddingBottom: 0,
  },
  starterCheckbox: {
    // Add any specific styles for starterCheckbox if needed
  },
  termsLabel: {
    paddingTop: 0,
  },
  checkbox: {
    paddingRight: 5,
  },
}));

const OfferDrawerCheckboxes = ({
  termsAgreed,
  handleCheckboxTerms,
  ...props
}) => {
  const classes = useStyles();

  const checkboxes = [
    {
      value: 'checkbox1',
      label: <FormattedMessage id='task.bounties.interested.iWillDoFor' defaultMessage='I will do for'>
        {msg => (
          <Typography variant='caption'> {msg} <span style={{ fontWeight: 'bold' }}>${props.currentPrice}</span> </Typography>
        )}
      </FormattedMessage>
    },
    {
      value: 'checkbox2',
      label: <FormattedMessage id='task.bounties.interested.iAmStarter' defaultMessage='I want to do for learning purposes'>
        {msg => (
          <Typography variant='caption'> {msg} </Typography>
        )}
      </FormattedMessage>
    }
  ];

  return (
    <Checkboxes checkboxes={checkboxes} />
  )

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={12} sm={6} className={classes.item}>
        <FormattedMessage id='task.bounties.interested.iWillDoFor' defaultMessage='I will do for'>
          {msg => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.priceConfirmed}
                  onChange={props.handleCheckboxIwillDoFor}
                  color='primary'
                  className={classes.checkbox}
                />
              }
              label={<Typography variant='caption'> {msg} <span style={{ fontWeight: 'bold' }}>${props.currentPrice}</span> </Typography>}
            />
          )}
        </FormattedMessage>
      </Grid>
      <Grid item xs={12} sm={6} className={`${classes.item} ${classes.starterCheckbox}`}>
        <FormattedMessage id='task.bounties.interested.iAmStarter' defaultMessage='I want to do for learning purposes'>
          {msg => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.interestedLearn}
                  onChange={props.handleCheckboxLearn}
                  color='primary'
                  className={classes.checkbox}
                />
              }
              label={<Typography variant='caption'> {msg} </Typography>}
            />
          )}
        </FormattedMessage>
      </Grid>
      <Grid item xs={12} className={classes.termsLabel}>
        <FormControlLabel
          control={
            <Checkbox
              checked={termsAgreed}
              onChange={handleCheckboxTerms}
              color='primary'
              className={classes.checkbox}
            />
          }
          onClick={
            (e) => {
              e.preventDefault();
            }
          }
          label={<Typography variant='caption' >
            <FormattedMessage id='task.bounties.interested.termsOfUseLabel' defaultMessage='I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION' values={{
              termsOfUseAnchor: (
                <Link onClick={props.handleTermsDialog}>
                  <FormattedMessage id='task.bounties.interested.termsOfUse' defaultMessage='TERMS OF USE' />
                </Link>
              )
            }} />
          </Typography>}
        />
      </Grid>
    </Grid>
  );
};

export default OfferDrawerCheckboxes;