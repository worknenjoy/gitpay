import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import MomentComponent from 'moment'
import { Input, InputAdornment, FormControl, InputLabel, Typography } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import CalendarIcon from '@mui/icons-material/CalendarToday'
import DateIcon from '@mui/icons-material/DateRange'
import {
  Container,
  Header,
  Row,
  IconBox,
  Content,
  GrayCaption,
  DeliveryDateSuggestion,
  DateSuggestionBtn,
  SpanText,
} from './delivery-date.styles'

const DeliveryDate = ({ date, onDateChange }) => {
  const intl = useIntl()
  const [showSuggestAnotherDateField, setShowSuggestAnotherDateField] = React.useState(false)
  const [interestedSuggestedDate, setInterestedSuggestedDate] = React.useState('')

  const deliveryDate =
    date !== null ? MomentComponent(date).utc().format('MM-DD-YYYY') : 'No delivery date'
  const deadline = date !== null ? MomentComponent(date).diff(MomentComponent(), 'days') : false

  const handleSuggestAnotherDate = (e) => {
    e.preventDefault()
    setShowSuggestAnotherDateField(true)
  }

  const handleInputChangeCalendar = (e) => {
    e.preventDefault()
    setInterestedSuggestedDate(e.target.value)
    onDateChange(e.target.value)
  }

  return (
    <Container>
      <Header>
        <Typography variant="body1">
          <FormattedMessage
            id="task.bounties.interested.deliveryDateTitle"
            defaultMessage="Review Delivery Dates"
          />
        </Typography>
      </Header>
      <Row>
        <IconBox>
          <WarningIcon style={{ color: '#D7472F', fontSize: 18 }} />
        </IconBox>
        <Content>
          <GrayCaption variant="caption" gutterBottom>
            <FormattedMessage
              id="task.bounties.interested.deliveryDateSuggest"
              defaultMessage={'You can suggest other delivery date.'}
            >
              {(msg) => <SpanText>{msg}</SpanText>}
            </FormattedMessage>
          </GrayCaption>
        </Content>
      </Row>
      <Row>
        <IconBox>
          <CalendarIcon style={{ color: 'gray' }} />
        </IconBox>
        <DeliveryDateSuggestion>
          <GrayCaption variant="caption">
            <SpanText>
              <FormattedMessage
                id="task.bounties.interested.deliveryDate"
                defaultMessage="Delivery date at {deliveryDate}"
                values={{ deliveryDate: deliveryDate }}
              />
              {deadline ? (
                <FormattedMessage
                  id="task.bounties.interested.deadline"
                  defaultMessage=" (in {deadline} days)"
                  values={{ deadline: deadline }}
                />
              ) : null}
            </SpanText>
          </GrayCaption>
          <DateSuggestionBtn onClick={handleSuggestAnotherDate} variant="body1">
            <FormattedMessage
              id="task.bounties.actions.sugggestAnotherDate"
              defaultMessage="SUGGEST ANOTHER DATE"
            />
            &nbsp;
          </DateSuggestionBtn>
        </DeliveryDateSuggestion>
      </Row>

      {showSuggestAnotherDateField && (
        <FormControl fullWidth>
          <FormattedMessage id="task.status.deadline.day.label" defaultMessage="Day">
            {(msg) => (
              <InputLabel htmlFor="interested-date" shrink={true}>
                {msg}
              </InputLabel>
            )}
          </FormattedMessage>
          <Input
            id="interested-date"
            startAdornment={
              <InputAdornment position="start">
                <DateIcon />
              </InputAdornment>
            }
            placeholder={intl.formatMessage({
              id: 'task.status.deadline.day.insert.label',
              defaultMessage: 'Choose a date',
            })}
            type="date"
            value={
              `${MomentComponent(interestedSuggestedDate).format('YYYY-MM-DD')}` ||
              `${MomentComponent().format('YYYY-MM-DD')}`
            }
            onChange={handleInputChangeCalendar}
          />
        </FormControl>
      )}
    </Container>
  )
}

export default DeliveryDate
