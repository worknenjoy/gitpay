import React from 'react';
import { Typography, Tabs, Tab } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Drawer, Container, Chip, Card, CardContent, CardMedia, CardHeader } from '@material-ui/core';
import { ArrowUpwardTwoTone as ArrowUpIcon } from '@material-ui/icons';

const TransferDetails = ({ open, onClose, fetchTransfer, transfer, id }) => {
  const { data } = transfer
  const [currentTab, setCurrentTab] = React.useState(0)

  React.useEffect(() => {
    id && fetchTransfer(id)
  }, [fetchTransfer, id])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{ style: { width: '40%' } }}
    >
      <Container>
        <div style={{ padding: 20 }}>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="transfer.details" defaultMessage='Transfer details' />
          </Typography>
          <Card style={{ padding: 5, marginBottom: 10, marginTop: 10 }} title={data.id} elevation={1}>
            <CardHeader
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Typography variant="body1">
                    <FormattedMessage id="transfer.amount" defaultMessage='Sending money to {value}'
                      values={{ value: <strong>{data?.User?.username}</strong> }}
                    />
                  </Typography>
                  <Typography variant="h5">
                    $ {data.value}
                  </Typography>
                </div>
              }
              subheader={
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Typography variant="caption">
                    <FormattedMessage id="transfer.status" defaultMessage='Status' />
                  </Typography>
                  <Typography variant="body2">
                    <Chip label={data.status} color={data.status === 'completed' ? 'primary' : 'secondary'} size='small' />
                  </Typography>
                </div>
              }
              action={
                data.created_at
              }
              avatar={<ArrowUpIcon />}

            />
          </Card>
          <Tabs
            indicatorColor="secondary"
            textColor="secondary"
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}
          >
            <Tab label="Bank Transfer" value={0} />
            <Tab label="Paypal" value={1} />
          </Tabs>
          <div style={{ margin: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Typography variant="caption">
                <FormattedMessage id="transfer.amount" defaultMessage='Amount' />
              </Typography>
              <Typography variant="body2">
                $ {data.value}
              </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Typography variant="caption">
                <FormattedMessage id="transfer.status" defaultMessage='Status' />
              </Typography>
              <Typography variant="body2">
                <Chip label={data.status} color={data.status === 'completed' ? 'primary' : 'secondary'} size='small' />
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </Drawer>
  );
}

export default TransferDetails;