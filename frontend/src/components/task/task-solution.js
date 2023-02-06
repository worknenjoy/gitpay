import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import Avatar from '@material-ui/core/Avatar'

const TaskSolution = props => {
  const paymentSentChip = () => {
    return (
      <Chip avatar={ <Avatar><DoneIcon /></Avatar> } label='Payment Sent' />
    )
  }

  const issueClosedChip = () => {
    return (
      <Chip avatar={ <Avatar><DoneIcon /></Avatar> } label='Issue Closed' />
    )
  }

  const pullRequestMergedChip = () => {
    return (
      <Chip avatar={ <Avatar><DoneIcon /></Avatar> } label='Merged' />
    )
  }

  return (
    <Card style={ { display: 'flex' } }>
      <CardHeader title={ `Pull Request # ${props.taskSolution.pullRequestURL.split('/')[6]}` } subheader='Updated 5 min ago' />
      <CardContent style={ { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: 'row' } }>
        { props.taskSolution.isPRMerged && pullRequestMergedChip() }
        { props.taskSolution.isIssueClosed && issueClosedChip() }
        { props.paid && paymentSentChip() }
      </CardContent>
    </Card>
  )
}

export default TaskSolution
