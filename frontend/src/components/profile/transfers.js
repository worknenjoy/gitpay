import React, { useEffect } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { withRouter } from 'react-router-dom'
import slugify from '@sindresorhus/slugify'
import moment from 'moment'
import {
  Container,
  Button,
  Typography,
  withStyles,
  Chip,
  Tabs,
  Tab
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { messages } from '../task/messages/task-messages'
import CustomPaginationActionsTable from './transfer-table'

const Alert = (props) => {
  return <MuiAlert elevation={0} variant='standard' size='small' {...props} />
}

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

const Transfers = ({ searchTransfer, updateTransfer, transfers, user, intl, history }) => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    let getTransfers = () => {}
    if (newValue === 'to') {
      getTransfers = async () => await searchTransfer({ to: user.id })
    }
    if (newValue === 'from') {
      getTransfers = async () => await searchTransfer({ userId: user.id })
    }
    getTransfers().then(t => console.log('transfers:', t))
  }

  const getTranfers = async () => await searchTransfer({ userId: user.id })

  useEffect(() => {
    setValue('from')
    getTranfers().then(t => console.log('transfers:', t))
  }, [user])

  return (
    <div style={ { margin: '40px 0' } }>
      <Container>
        <Typography variant='h5' gutterBottom>
          <FormattedMessage id='profile.transfer.title' defaultMessage='Transfers' />
        </Typography>
        {
          !user.account_id && value === 'to' ?
            <Alert 
              severity='warning'
              action={
                <Button
                  size='small'
                  onClick={ () => {
                    history.push('/profile/user-account/details')
                  } }
                  variant='contained'
                  color='secondary'
                >
                  <FormattedMessage id='transfers.alert.button' defaultMessage='Update your account' />
                </Button>
              }
            >
              <Typography variant='subtitle1' gutterBottom>
                <FormattedMessage id='profile.transfer.notactive' defaultMessage='Your account is not active, please finish the setup of your account to receive payouts' />
              </Typography>
            </Alert>
            :
            null
        }
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
              intl.formatMessage(messages.cardTableHeaderIssue),
              intl.formatMessage(messages.cardTableHeaderActions)
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
                  </a>,
                  value === 'to' && (
                  (user.account_id && t.status === 'pending') ? 
                    <Button
                      size='small'
                      onClick={ async () => {
                        await updateTransfer({ id: t.id })
                        await searchTransfer({ to: user.id })
                      } }
                      variant='contained'
                      color='secondary'
                      disabled={ t.status !== 'pending'}
                    >
                      <FormattedMessage id='transfers.action.payout.button' defaultMessage='Request payout' />
                    </Button>
                    :
                    !user.account_id && <Button
                      size='small'
                      onClick={ () => {
                        history.push('/profile/user-account/details')
                      } }
                      variant='contained'
                      color='secondary'
                    >
                      <FormattedMessage id='transfers.alert.button' defaultMessage='Update your account' />
                    </Button>
              )]) } || {}
            }
          />
        </div>
      </Container>
    </div>
  )
}

export default injectIntl(withRouter(withStyles(styles)(Transfers)))
