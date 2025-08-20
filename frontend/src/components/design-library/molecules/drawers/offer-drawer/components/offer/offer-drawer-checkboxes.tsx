import {
  Typography
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import Checkboxes from '../../../../../atoms/inputs/checkboxes/checkboxes';

const useStyles = makeStyles((theme) => ({
  container: {
    fontFamily: 'Roboto',
    color: '#a9a9a9'
  },
  item: {
    paddingBottom: 0
  },
  starterCheckbox: {
    // Add any specific styles for starterCheckbox if needed
  },
  termsLabel: {
    paddingTop: 0
  },
  checkbox: {
    paddingRight: 5
  }
}));

const OfferDrawerCheckboxes = ({
  currentPrice,
  onLearnCheckboxChange,
  onConfirmOfferChange
}) => {
  const classes = useStyles();

  const checkboxes = [
    {
      onChange: onConfirmOfferChange,
      value: 'price',
      label: <FormattedMessage id="task.bounties.interested.iWillDoFor" defaultMessage="I will do for">
        {msg => (
          <Typography variant="caption"> {msg} <span style={{ fontWeight: 'bold' }}>${currentPrice}</span> </Typography>
        )}
      </FormattedMessage>
    },
    {
      onChange: onLearnCheckboxChange,
      value: 'learning',
      label: <FormattedMessage id="task.bounties.interested.iAmStarter" defaultMessage="I want to do for learning purposes">
        {msg => (
          <Typography variant="caption"> {msg} </Typography>
        )}
      </FormattedMessage>
    }
  ];

  return (
    <Checkboxes checkboxes={checkboxes} />
  );
};

export default OfferDrawerCheckboxes;