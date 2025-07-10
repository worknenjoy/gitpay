import React, { useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';

import { countryCodes } from '../../../../areas/private/shared/country-codes';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  countryContainer: {
    padding: 20,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: 8,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  countryItem: {
    display: 'inline-block',
    textAlign: 'center',
    padding: 25,
    [theme.breakpoints.down('sm')]: {
      padding: 10,
      margin: 8,
      width: '100%',
      maxWidth: 200,
      boxSizing: 'border-box',
      flex: '1 1 100%',
      minWidth: 0,
      fontSize: '0.8rem'
    }
  },
  fullWidthMobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 100%',
      padding: 12,
      minWidth: 0,
      width: '100%',
      boxSizing: 'border-box',
      fontSize: '0.7rem'
    }
  },
  actionsWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '8px 16px',
      boxSizing: 'border-box'
    }
  },
  creditTextMobile: {
    [theme.breakpoints.down('sm')]: {
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      order: 3
    }
  },
  buttomPrimaryActionMobile: {
    [theme.breakpoints.down('sm')]: {
      order: 1
    }
  },
  buttomSecondaryActionMobile: {
    [theme.breakpoints.down('sm')]: {
      order: 2,
      marginTop: 8,
      marginBottom: 8
    }
  }
}));

const CountryPicker = ({ open, onClose, onSelectCountry }) => {
  const classes = useStyles();
  const [currentCountry, setCurrentCountry] = useState({
    label: null,
    code: null,
    image: null
  });

  const handleCountry = (item) => {
    setCurrentCountry({
      code: item.code,
      label: item.country,
      image: item.image
    });
  };

  const Alert = (props) => {
    return <MuiAlert elevation={2} variant="outlined" {...props} />;
  };

  const getCountryButtons = () => {
    return countryCodes.map((item) => {
      const imageModule = require(`images/countries/${item.image}.png`);
      const countryImageSrc = imageModule.default || imageModule;
      return (
        <Button
          key={item.code}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          variant={currentCountry.code === item.code ? 'outlined' : 'text'}
          onClick={() => handleCountry(item)}
          className={classes.countryItem}
        >
          <img
            width="48"
            style={{ marginRight: 10 }}
            src={countryImageSrc}
            alt={item.country}
          />
          <Typography component="span" gutterBottom>
            {item.country}
          </Typography>
        </Button>
      );
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={(e) =>
          onClose(e, {
            code: null,
            country: null,
            image: null
          })
        }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">{'Choose your country'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Alert severity="info">
              <Typography variant="body1">
                <FormattedMessage
                  id="countryPicker.info"
                  defaultMessage="If your country is not listed, please contact us at contact@gitpay.me"
                />
              </Typography>
            </Alert>
          </DialogContentText>
          <div className={classes.countryContainer}>{getCountryButtons()}</div>
        </DialogContent>
        <DialogActions
          className={classes.fullWidthMobile}
        >
          <DialogContent id="alert-dialog-footer" className={classes.creditTextMobile}>
            <DialogContentText>
              Icons made by{' '}
              <a href="http://www.freepik.com/" title="Freepik">
                Freepik
              </a>
              ,{' '}
              <a
                href="https://www.flaticon.com/free-icons/pakistan"
                title="pakistan icons"
              >
                Pakistan icons created by Roundicons - Flaticon
              </a>
              ,{' '}
              <a
                href="https://www.flaticon.com/free-icons/turkey"
                title="turkey icons"
              >
                Turkey icons created by IconsBox - Flaticon
              </a>{' '}
              and{' '}
              <a
                href="https://www.flaticon.com/free-icons/flags"
                title="flags icons"
              >
                Icon.doit - Flaticon
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>{' '}
              is licensed by{' '}
              <a
                href="http://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noreferrer"
              >
                CC 3.0 BY
              </a>
            </DialogContentText>
          </DialogContent>
          
            <Button
              onClick={(e) =>
                onClose(e, {
                  country: null,
                  code: null,
                  image: null
                })
              }
              size="large"
              className={classes.buttomSecondaryActionMobile}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={(e) => {
                onSelectCountry(currentCountry);
                onClose(e, {
                  country: currentCountry.label,
                  code: currentCountry.code,
                  image: currentCountry.image
                })
              }}
              size="large"
              color="secondary"
              autoFocus
              style={{
                minWidth: 'auto'
              }}
              className={classes.buttomPrimaryActionMobile}
            >
              <FormattedMessage id="dialog.picker.choose" defaultMessage={`Choose {country}`} values={{
                country: currentCountry.label
              }} /> 
            </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CountryPicker;
