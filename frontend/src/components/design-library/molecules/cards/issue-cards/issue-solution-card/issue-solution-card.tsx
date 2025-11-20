import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import DoneIcon from '@mui/icons-material/Done'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Typography, Alert, AlertTitle } from '@mui/material'
import { lightGreen } from '@mui/material/colors'
import { formatCurrency } from '../../../../../../utils/format-currency'

const IssueSolutionCard = ({ task, taskSolution }) => {
  const { paid, transfer_id: transferId, Transfer } = task
  const paymentSentChip = () => {
    return (
      <Chip
        size="small"
        style={{ backgroundColor: lightGreen[200], marginLeft: 10 }}
        avatar={
          <Avatar sizes="small" style={{ backgroundColor: lightGreen[600] }}>
            <DoneIcon fontSize="small" style={{ backgroundColor: lightGreen[400] }} />
          </Avatar>
        }
        label="Payment Sent"
      />
    )
  }

  const issueClosedChip = () => {
    return (
      <Chip
        size="small"
        avatar={
          <Avatar sizes="small">
            <DoneIcon fontSize="small" />
          </Avatar>
        }
        label="Issue Closed"
        style={{ marginLeft: 10 }}
      />
    )
  }

  const pullRequestMergedChip = () => {
    return (
      <Chip
        size="small"
        avatar={
          <Avatar sizes="small">
            <DoneIcon fontSize="small" />
          </Avatar>
        }
        label="Merged"
      />
    )
  }

  return (
    <>
      {(transferId || Transfer) && (
        <Alert
          severity="success"
          action={
            <Link to={`/profile/claims`}>
              <Button size="small" variant="outlined" color="primary">
                <FormattedMessage id="task.payment.claims.view" defaultMessage="view claims" />
              </Button>
            </Link>
          }
        >
          <AlertTitle>
            <Typography variant="subtitle1" color="primary" gutterBottom noWrap>
              <FormattedMessage
                id="issue.claimn.card.done"
                defaultMessage="Your issue was claimed"
              />
            </Typography>
          </AlertTitle>

          {transferId ? (
            <Typography variant="subtitle2" color="primary" gutterBottom noWrap>
              <FormattedMessage
                id="issue.transfer.card.id"
                defaultMessage="Transfer id: {value}"
                values={{
                  value: transferId
                }}
              />
            </Typography>
          ) : (
            <div>
              <Typography variant="subtitle2" color="primary" gutterBottom noWrap>
                <FormattedMessage
                  id="issue.claim.card.value"
                  defaultMessage="Claim of {value} requested"
                  values={{
                    value: formatCurrency(Transfer.value)
                  }}
                />
              </Typography>
            </div>
          )}
        </Alert>
      )}
      <Card style={{ display: 'flex', marginTop: 12 }}>
        <CardHeader
          title={`Pull Request # ${taskSolution?.pullRequestURL?.split('/')[6]}`}
          subheader="Updated 5 min ago"
        />
        <CardContent
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            flexDirection: 'row'
          }}
        >
          {taskSolution.isPRMerged && pullRequestMergedChip()}
          {taskSolution.isIssueClosed && issueClosedChip()}
          {(paid || transferId || Transfer) && paymentSentChip()}
        </CardContent>
      </Card>
    </>
  )
}

export default IssueSolutionCard
