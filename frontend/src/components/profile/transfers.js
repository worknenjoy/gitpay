import React, { useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import slugify from '@sindresorhus/slugify'
import moment from 'moment'
import {
  Container,
  Typography,
  withStyles,
  Chip
} from '@material-ui/core'
import { messages } from '../task/messages/task-messages'
import CustomPaginationActionsTable from './transfer-table'

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
});

const Transfers = ({searchTransfer, transfers, user, intl}) => {
  console.log('user', user)
  useEffect(() => {
    const getTransferData = async () =>  await searchTransfer({userId: user.user.id})
    getTransferData().then(t => t)
  }, [])

  return (
    <div style={{margin: '40px 0'}}>
      <Container>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id='profile.transfer.title' defaultMessage='Transfers' />
        </Typography>
        <div>
          <CustomPaginationActionsTable
            tableHead={[
              intl.formatMessage(messages.cardTableHeaderStatus),
              intl.formatMessage(messages.cardTableHeaderValue),
              intl.formatMessage(messages.cardTableHeaderCreated),
              intl.formatMessage(messages.cardTableHeaderIssue)
            ]}
            transfers={
              transfers && transfers.data && { 
              ...transfers,
              data: transfers.data.map(t => [
                <Chip label={t.status} />,
                `$ ${t.value}`,
                moment(t.createdAt).format('LLL'),
                <a href={`/#/task/${t.Task.id}/${slugify(t.Task.title)}`}>
                  {t.Task.title}
                </a>
              ])} || {}
            }
          />
        </div>
      </Container>
    </div>
  )
}

export default injectIntl(withStyles(styles)(Transfers));