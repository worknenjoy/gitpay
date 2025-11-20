import React from 'react'
import { Typography, Tabs, Tab } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Button, Drawer, Container, Chip, Card, CardContent, CardHeader } from '@mui/material'
import { ArrowUpwardTwoTone as ArrowUpIcon } from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import { Skeleton } from '@mui/material'

import { formatCurrency } from '../../../../../utils/format-currency'

const TransactionRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
    <Typography variant="caption">{label}</Typography>
    <Typography variant="body2">{value}</Typography>
  </div>
)

const TransferDetails = ({ open, onClose, fetchTransfer, transfer, id, history, user }) => {
  const { data, completed } = transfer
  const [currentTab, setCurrentTab] = React.useState(0)

  React.useEffect(() => {
    id && fetchTransfer(id)
  }, [fetchTransfer, id])

  React.useEffect(() => {
    if (data) {
      if (data.stripeTransfer) {
        setCurrentTab(0)
      } else if (data.paypalTransfer) {
        setCurrentTab(1)
      }
    }
  }, [data])

  const getUserDisplayName = (user) => {
    if (!user) return 'unknown user'
    if (user?.name && user?.name !== '') return user.name
    if (user?.username && user?.username !== '') return user.username
    if (user?.provider_username && user?.provider_username !== '') return user.provider_username
    return `User #${user.id}`
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ style: { width: '40%' } }}>
      <Container>
        <div style={{ padding: 20 }}>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="transfer.details" defaultMessage="Transfer details" />
          </Typography>
          {!completed ? (
            <div style={{ padding: 5, marginBottom: 10, marginTop: 10 }}>
              <Skeleton variant="rectangular" animation="wave" width="100%" height={120} />
            </div>
          ) : (
            <Card
              style={{ padding: 5, marginBottom: 10, marginTop: 10 }}
              title={data.id}
              elevation={1}
            >
              <CardHeader
                title={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                  >
                    <Typography variant="body1">
                      <FormattedMessage
                        id="transfer.destination.label"
                        defaultMessage="Sending bounty to {value}"
                        values={{ value: <strong>{getUserDisplayName(data?.destination)}</strong> }}
                      />
                    </Typography>
                    <Typography variant="h5">{formatCurrency(data.value)}</Typography>
                  </div>
                }
                subheader={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                  >
                    <Typography variant="caption">
                      <FormattedMessage id="transfer.status" defaultMessage="Status" />
                    </Typography>
                    <Typography variant="body2">
                      <Chip
                        label={data.status}
                        color={data.status === 'completed' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </Typography>
                  </div>
                }
                action={data.created_at}
                avatar={<ArrowUpIcon />}
              />
              {!user.account_id &&
                (data.transfer_method === 'multiple' || data.transfer_method === 'stripe') &&
                data.to === user.id && (
                  <CardContent>
                    <Alert
                      severity="warning"
                      action={
                        <Button
                          size="small"
                          onClick={() => {
                            history.push('/profile/payout-settings')
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          <FormattedMessage
                            id="transfers.alert.button"
                            defaultMessage="Update your account"
                          />
                        </Button>
                      }
                    >
                      <Typography variant="body2" gutterBottom>
                        <FormattedMessage
                          id="profile.transfer.notactive"
                          defaultMessage="Your account is not active, please finish the setup of your account to receive payouts"
                        />
                      </Typography>
                    </Alert>
                  </CardContent>
                )}
              {!user.paypal_id &&
                (data.transfer_method === 'multiple' || data.transfer_method === 'paypal') &&
                data.to === user.id && (
                  <CardContent>
                    <Alert
                      severity="warning"
                      action={
                        <Button
                          size="small"
                          onClick={() => {
                            history.push('/profile/payout-settings')
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          <FormattedMessage
                            id="transfers.alert.button.paypal"
                            defaultMessage="Link your Paypal account"
                          />
                        </Button>
                      }
                    >
                      <Typography variant="body2" gutterBottom>
                        <FormattedMessage
                          id="profile.transfer.paypal.notactive"
                          defaultMessage="Your Paypal account is not active, please finish the setup of your account to receive the missing Paypal payment"
                        />
                      </Typography>
                    </Alert>
                  </CardContent>
                )}
            </Card>
          )}
          {!completed ? (
            <div style={{ padding: 5, marginBottom: 10, marginTop: 10 }}>
              <Skeleton variant="text" animation="wave" width="100%" />
            </div>
          ) : (
            <Tabs
              indicatorColor="secondary"
              textColor="secondary"
              value={currentTab}
              onChange={(_, value) => setCurrentTab(value)}
            >
              {data.stripeTransfer && <Tab label="Bank Transfer" value={0} />}
              {data.paypalTransfer && <Tab label="Paypal" value={1} />}
            </Tabs>
          )}
          {!completed ? (
            <div style={{ padding: 5, marginBottom: 10, marginTop: 10 }}>
              <Skeleton variant="text" animation="wave" width="100%" />
            </div>
          ) : (
            <>
              {currentTab === 0 && data.stripeTransfer && (
                <div style={{ margin: '20px 0' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
                  >
                    <Typography variant="caption">
                      <FormattedMessage id="transfer.amount" defaultMessage="Amount" />
                    </Typography>
                    <Typography variant="body2">
                      $ {(data.stripeTransfer.amount / 100).toFixed(2)}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
                  >
                    <Typography variant="caption">
                      <FormattedMessage id="transfer.status" defaultMessage="Status" />
                    </Typography>
                    <Typography variant="body2">
                      <Chip
                        label={data.status}
                        color={data.status === 'completed' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </Typography>
                  </div>
                </div>
              )}
              {currentTab === 1 && data.paypalTransfer && (
                <div style={{ margin: '20px 0' }}>
                  <TransactionRow
                    label={
                      <FormattedMessage
                        id="transfer.details.transaction_id"
                        defaultMessage="Transaction ID"
                      />
                    }
                    value={'#' + data.paypalTransfer.batch_header.payout_batch_id}
                  />
                  <TransactionRow
                    label={
                      <FormattedMessage id="transfer.details.status" defaultMessage="Status" />
                    }
                    value={data.paypalTransfer.batch_header.batch_status}
                  />
                  <TransactionRow
                    label={
                      <FormattedMessage id="transfer.details.amount" defaultMessage="Amount" />
                    }
                    value={data.paypalTransfer.batch_header.amount.value}
                  />
                  <TransactionRow
                    label={<FormattedMessage id="transfer.details.time" defaultMessage="Time" />}
                    value={data.paypalTransfer.batch_header.time_completed}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Drawer>
  )
}

export default TransferDetails
