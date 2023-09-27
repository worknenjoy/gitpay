import React, { useState } from 'react';
import { AppBar, Button, ButtonGroup } from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    backgroundColor: theme.palette.primary.light
  },
  buttonActive: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText
  }
});

const messages = defineMessages({
  allTasks: {
    id: 'task.list.lable.filterAllTasks',
    defaultMessage: 'All public issues available'
  },
  allPublicTasksWithBounties: {
    id: 'task.list.lable.filterWithBounties',
    defaultMessage: 'Issues with bounties'
  },
  allPublicTasksNoBounties: {
    id: 'task.list.lable.filterNoBounties',
    defaultMessage: 'Issues without bounties'
  }
})

const TaskFilters = ({
  intl,
  history,
  classes,
  filterTasks,
  baseUrl = '/tasks/'
}) => {
  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  })

  const handleTabChange = async (event, value) => {
    await setTaskListState({ ...taskListState, tab: value })
    switch (value) {
      case 0:
        history.push(baseUrl + 'open')
        filterTasks('status', 'open')
        break
      case 1:
        history.push(baseUrl + 'withBounties')
        filterTasks('issuesWithBounties')
        break
      case 2:
        history.push(baseUrl + 'contribution')
        filterTasks('contribution')
        break
      default:
        filterTasks('all')
    }
  }

  return(
    <AppBar position='static' color='transparent' elevation={ 0 }>
      <ButtonGroup
        disableElevation
        variant="contained"
        aria-label="Disabled elevation buttons"
        size='small'
      >
        <Button
          value={taskListState.tab}
          onClick={ (e) => handleTabChange(e, 0) }
          className={ taskListState.tab === 0 ? classes.buttonActive : classes.button }
        >
          { intl.formatMessage(messages.allTasks) }
        </Button>
        <Button
          value={taskListState.tab}
          onClick={ (e) => handleTabChange(e, 1) }
          className={ taskListState.tab === 1 ? classes.buttonActive : classes.button }
        >
          { intl.formatMessage(messages.allPublicTasksWithBounties) }
        </Button>
        <Button
          value={taskListState.tab}
          onClick={ (e) => handleTabChange(e, 2) }
          className={ taskListState.tab === 2 ? classes.buttonActive : classes.button }
        >
          { intl.formatMessage(messages.allPublicTasksNoBounties) }
        </Button>
      </ButtonGroup>
    </AppBar>
  )
}

export default injectIntl(withRouter(withStyles(styles)(TaskFilters)))