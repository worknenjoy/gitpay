import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { lightGreen } from '@material-ui/core/colors'

const TaskSolution = props => {
  const paymentSentChip = () => {
    return (
      <Chip size='small' style={{backgroundColor: lightGreen[200], marginLeft: 10}} avatar={ <Avatar size='small' style={{backgroundColor: lightGreen[600]}}><DoneIcon size='small' style={{backgroundColor: lightGreen[400]}} /></Avatar> } label='Payment Sent' />
    )
  }

  const issueClosedChip = () => {
    return (
      <Chip size='small' avatar={ <Avatar size='small'><DoneIcon size='small' /></Avatar> } label='Issue Closed' style={{marginLeft: 10}} />
    )
  }

  const pullRequestMergedChip = () => {
    return (
      <Chip size='small' avatar={ <Avatar size='small'><DoneIcon size='small' /></Avatar> } label='Merged' />
    )
  }

  return (
    <>
      {props.task.transfer_id || props.task.Transfer && (
        <Alert 
          severity='success'
          action={<Link to={`/profile/transfers`}>
          <Button size='small' variant='outlined' color='primary'>
            <FormattedMessage id='task.payment.transfer.view' defaultMessage='view transfers' />
          </Button>
        </Link>}
        >
          <AlertTitle>
            <Typography type='subheading' color='primary' gutterBottom noWrap>
              <FormattedMessage id='task.payment.transfer.done' defaultMessage='All your transfer was concluded' />
            </Typography>
          </AlertTitle>
          
          {props.transferId ?
            <Typography type='subheading' color='primary' gutterBottom noWrap>
              { `${props.transferId}` }
            </Typography>
          : 
            <div>
              <Typography type='heading' color='primary' gutterBottom noWrap>
                <FormattedMessage id='task.payment.transfer.id' defaultMessage='Transfer of ${value} requested' values={{
                  value: props.task.Transfer.value
                }}
              />
              </Typography>
              
            </div>
          }
        </Alert>  
      )}
      <Card style={ { display: 'flex' } }>
        <CardHeader title={ `Pull Request # ${props.taskSolution.pullRequestURL.split('/')[6]}` } subheader='Updated 5 min ago' />
        <CardContent style={ { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: 'row' } }>
          { props.taskSolution.isPRMerged && pullRequestMergedChip() }
          { props.taskSolution.isIssueClosed && issueClosedChip() }
          { props.paid || props.task.transfer_id || props.task.Transfer && paymentSentChip() }
        </CardContent>
      </Card>
    </>
  )
}

export default TaskSolution
