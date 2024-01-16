import React, { useEffect } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import slugify from '@sindresorhus/slugify'
import moment from 'moment'
import {
  Container,
  Typography,
  withStyles,
  Chip,
  Tabs,
  Tab
} from '@material-ui/core'
import { messages } from '../task/messages/task-messages'
import CustomPaginationActionsTable from './transfer-table'

const transferMessages = defineMessages({
  cardTableHeaderFrom: {
    id: 'card.table.header.from',
    defaultMessage: 'Transfers sent'
  },
  cardTableHeaderTo: {
    id: 'card.table.header.to',
    defaultMessage: 'Transfers received'
  },
})

const styles = theme => ({
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  button: {
    width: 100,
    font: 10
  }
})

const Transfers = ({ searchTransfer, transfers, user, intl }) => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    let getTransfers = () => {}
    if (newValue === 'to') {
      getTransfers = async () => await searchTransfer({ to: user.user.id })
    }
    if (newValue === 'from') {
      getTransfers = async () => await searchTransfer({ userId: user.user.id })
    }
    getTransfers().then(t => console.log('transfers:', t))
  }

  useEffect(() => {
    setValue('from')
    const getTranfers = async () => await searchTransfer({ userId: user.user.id })
    getTranfers().then(t => console.log('transfers:', t))
  }, [user])

  return (
    <div style={ { margin: '40px 0' } }>
      <Container>
        <Typography variant='h5' gutterBottom>
          <FormattedMessage id='profile.transfer.title' defaultMessage='Transfers' />
        </Typography>
        <Tabs
          value={ value }
          onChange={ handleChange }
          indicatorColor='primary'
          textColor='primary'
          style={ { margin: '20px 0' } }
        >
          <Tab label={ intl.formatMessage(transferMessages.cardTableHeaderFrom) } value='from' />
          <Tab label={ intl.formatMessage(transferMessages.cardTableHeaderTo) } value='to' />
        </Tabs>
        <div>
          <CustomPaginationActionsTable
            tableHead={ [
              intl.formatMessage(messages.cardTableHeaderStatus),
              intl.formatMessage(messages.cardTableHeaderValue),
              intl.formatMessage(messages.cardTableHeaderCreated),
              intl.formatMessage(messages.cardTableHeaderIssue)
            ] }
            transfers={
              transfers && transfers.data && {
                ...transfers,
                data: transfers.data.map(t => [
                  <Chip label={ t.status } />,
                  `$ ${t.value}`,
                  moment(t.createdAt).format('LLL'),
                  <a href={ `/#/task/${t.Task.id}/${slugify(t.Task.title)}` }>
                    { t.Task.title }
                  </a>
                ]) } || {}
            }
          />
        </div>
      </Container>
    </div>
  )
}

export default injectIntl(withStyles(styles)(Transfers))
