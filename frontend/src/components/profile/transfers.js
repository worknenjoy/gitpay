import React, { useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import slugify from '@sindresorhus/slugify'
import {
  Container,
  Typography,
  withStyles
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

  useEffect(() => {
    const getTransferData = async () =>  await searchTransfer({userId: user.id})
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
              intl.formatMessage(messages.cardTableHeaderActions)
            ]}
            transfers={
              transfers && transfers.data && { 
              ...transfers,
              data: transfers.data.map(t => [
                t.status,
                t.value,
                t.createdAt,
                <a href={`/#/task/${t.Task.id}/${slugify(t.Task.title)}`}>
                  <FormattedMessage id='profile.transfer.view' defaultMessage='View' />
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