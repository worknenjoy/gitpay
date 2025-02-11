import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Container,
  Button,
  Paper,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  withStyles
} from '@material-ui/core'

// import TaskFilter from '../task/task-filters'
import Taskfilters from '../../containers/task-filter'
import ExploreIssuesTable from './explore/explore-issues-table';

import logoGithub from '../../images/github-logo.png'
import logoBitbucket from '../../images/bitbucket-logo.png'

import imageGettingStarted from '../../images/octodex.png'

import api from '../../consts'

const styles = theme => ({
  icon: {
    backgroundColor: 'black'
  },
  card: {},
  gutterLeft: {
    marginLeft: 10
  },
  media: {
    width: 600
  }
})

const UserTasksExplore = ({ classes, filterTasks, listTasks, tasks, user }) => {

  const baseUrl = '/profile/explore/'

  const getListTasks = async () => {
    await filterTasks({})
    await listTasks({})
  }

  useEffect(() => {
    getListTasks()
  }, [])

  return (
    <Paper elevation={ 0 } style={{backgroundColor: 'transparent'}}>
      <Container>
        <Typography variant='h5' gutterBottom style={{marginTop: 40}}>
          <FormattedMessage id='issues.explore.title' defaultMessage='Explore issues' />
        </Typography>
        <Typography variant='caption' gutterBottom>
          <FormattedMessage
            id='issues.explore.description'
            defaultMessage="Here you can see all the issues on our network"
          />
        </Typography>
        <div style={{marginBottom: 20}}>
          { !user.id ? (
            <Card className={ classes.card }>
              <CardMedia
                className={ classes.media }
                src={ imageGettingStarted }
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  <FormattedMessage
                    id='task.user.account.create.headline'
                    defaultMessage='Login / signup to work in our tasks'
                  />
                </Typography>
                <Typography component='p'>
                  <FormattedMessage
                    id='task.user.account.create.description'
                    defaultMessage='Creating your account, you can be assigned to a task and receive bounties'
                  />
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  style={ { marginRight: 10 } }
                  href={ `${api.API_URL}/authorize/github` }
                  variant='contained'
                  size='small'
                  color='secondary'
                  className={ classes.logButtons }
                >
                  <img width='16' src={ logoGithub } />
                  <span className={ classes.gutterLeft }>Github</span>
                </Button>

                <Button
                  href={ `${api.API_URL}/authorize/bitbucket` }
                  variant='contained'
                  size='small'
                  color='secondary'
                  className={ classes.logButtons }
                >
                  <img width='16' src={ logoBitbucket } />
                  <span className={ classes.gutterLeft }>Bitbucket</span>
                </Button>
              </CardActions>
            </Card>
          ) : (
            <div style={{marginTop: 20, marginBottom: 20}}>
              <Taskfilters
                filterTasks={ filterTasks }
                baseUrl={ baseUrl }
              />
              <ExploreIssuesTable issues={ tasks } />
            </div>
          ) }
        </div>
      </Container>
    </Paper>
  )
}

export default withStyles(styles)(UserTasksExplore)
