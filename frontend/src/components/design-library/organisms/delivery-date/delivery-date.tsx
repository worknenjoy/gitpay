import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import MomentComponent from 'moment';
import {
  Paper,
  Input,
  InputAdornment,
  FormControl,
  InputLabel,
  Link,
  Typography
} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import DateIcon from '@material-ui/icons/DateRange';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  spanText: {
    color: 'gray'
  },
  deliveryDateSuggestion: {
    display: 'flex',
    paddingLeft: 5,
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  dateSuggestionBtn: {
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      marginTop: 4,
      marginLeft: 10
    }
  },
}));

const DeliveryDate = ({ date }) => {
  const classes = useStyles();
  const [showSuggestAnotherDateField, setShowSuggestAnotherDateField] = React.useState(false);
  const [interestedSuggestedDate, setInterestedSuggestedDate] = React.useState('');

  const deliveryDate = date !== null ? MomentComponent(date).utc().format('MM-DD-YYYY') : 'No delivery date';
  const deadline = date !== null ? MomentComponent(date).diff(MomentComponent(), 'days') : false

  const handleSuggestAnotherDate = (e) => {
    e.preventDefault();
    setShowSuggestAnotherDateField(true);
  }

  const handleInputChangeCalendar = (e) => {
    e.preventDefault();
    setInterestedSuggestedDate(e.target.value);
  }

  return (
    <Paper style={{ background: '#F7F7F7', borderColor: '#F0F0F0', borderWidth: 1, borderStyle: 'solid', boxShadow: 'none', padding: 10, paddingTop: 0 }}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant='body1'>
          <FormattedMessage id='task.bounties.interested.deliveryDateTitle' defaultMessage='Review Delivery Dates' />
        </Typography>
      </div>
      <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
        <div style={{ width: 25, justifyContent: 'center', display: 'flex' }}><WarningIcon style={{ color: '#D7472F', fontSize: 18 }} /></div>
        <div style={{ paddingLeft: 5 }}>
          <Typography variant='caption' gutterBottom style={{ color: 'gray' }}>
            <FormattedMessage id='task.bounties.interested.deliveryDateSuggest' defaultMessage={'You can suggest other delivery date.'}>
              {(msg) => (
                <span className={classes.spanText}>
                  {msg}
                </span>
              )}
            </FormattedMessage>
          </Typography>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
        <div style={{ width: 25, justifyContent: 'center', display: 'flex', alignItems: 'center' }}><CalendarIcon style={{ color: 'gray' }} /></div>
        <div className={classes.deliveryDateSuggestion}>
          <Typography variant='caption' style={{ color: 'gray' }}>
            <span className={classes.spanText}>
              <FormattedHTMLMessage id='task.bounties.interested.deliveryDate' defaultMessage='Delivery date at {deliveryDate}' values={{ deliveryDate: deliveryDate }} />
              {deadline
                ? <FormattedHTMLMessage id='task.bounties.interested.deadline' defaultMessage=' (in {deadline} days)' values={{ deadline: deadline }} />
                : null}
            </span>
          </Typography>
          <Link onClick={handleSuggestAnotherDate} variant='body1' className={classes.dateSuggestionBtn}>
            <FormattedMessage id='task.bounties.actions.sugggestAnotherDate' defaultMessage='SUGGEST ANOTHER DATE' />&nbsp;
          </Link>
        </div>
      </div>

      {showSuggestAnotherDateField && (
        <FormControl fullWidth>
          <FormattedMessage id='task.status.deadline.day.label' defaultMessage='Day'>
            {(msg) => (
              <InputLabel htmlFor='interested-date' shrink={true}>{msg}</InputLabel>
            )}
          </FormattedMessage>
          <FormattedMessage id='task.status.deadline.day.insert.label' defaultMessage='Choose a date'>
            {(msg) => (
              <Input
                id='interested-date'
                startAdornment={<InputAdornment position='start'><DateIcon /></InputAdornment>}
                placeholder={msg}
                type='date'
                value={`${MomentComponent(interestedSuggestedDate).format('YYYY-MM-DD')}` || `${MomentComponent().format('YYYY-MM-DD')}`}
                onChange={handleInputChangeCalendar}
              />
            )}
          </FormattedMessage>
        </FormControl>
      )}
    </Paper>
  );
};

export default DeliveryDate;