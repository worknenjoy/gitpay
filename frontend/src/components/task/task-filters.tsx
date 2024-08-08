import React, { useState , useEffect } from 'react';
import { AppBar, Toolbar, Button, ButtonGroup, Chip} from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Labels from '../../containers/label';
import { get } from "lodash";
import { connect } from "react-redux";
import { filterTasks } from "../../actions/taskActions";
import { backdropClasses } from "@mui/material";

const styles = (theme) => ({
  button: {
    backgroundColor: theme.palette.primary.light,
  },
  buttonActive: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  chip: {
    marginLeft: theme.spacing(1),
  },
  chipActive: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.light,
  },
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
  baseUrl = '/tasks/',
  tasks,
  filteredTasks,
}) => {
  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  })
  const [allTasksCount, setAllTasksCount] = useState(0);
  const [withBountiesCount, setWithBountiesCount] = useState(0);
  const [noBountiesCount, setNoBountiesCount] = useState(0);
  useEffect(() => {
    updateCounts(tasks);
  }, [tasks]);
  const updateCounts = (taskList) => {
    setAllTasksCount(taskList.length);
    setWithBountiesCount(
      taskList.filter((task) => parseFloat(task.value) > 0).length
    );
    setNoBountiesCount(
      taskList.filter((task) => parseFloat(task.value) === 0).length
    );
  };
  const handleTabChange = (event, value) => {
    setTaskListState({ ...taskListState, tab: value });
    let filterPromise;
    switch (value) {
      case 0:
        history.push(baseUrl + "open");
        filterPromise = filterTasks("status", "open");
        break;
      case 1:
        history.push(baseUrl + "withBounties");
        filterPromise = filterTasks("issuesWithBounties");
        break;
      case 2:
        history.push(baseUrl + "contribution");
        filterPromise = filterTasks("contribution");
        break;
      default:
        filterPromise = filterTasks("all");
    }
    filterPromise.then((result) => {
      // We don't need to update the counts here, as they reflect the total
    });
  };


  return(
    <AppBar position='static' color='transparent' elevation={ 0 }>
      <Toolbar style={{display: 'flex', justifyContent: 'space-between', margin: 0, padding: 0}}>
        <div>
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
              <Chip
                label={allTasksCount}
                size="small"
                variant="outlined"
                className={taskListState.tab === 0 ? classes.chipActive : classes.chip}
              />

            </Button>
            <Button
              value={taskListState.tab}
              onClick={ (e) => handleTabChange(e, 1) }
              className={ taskListState.tab === 1 ? classes.buttonActive : classes.button }
            >
              { intl.formatMessage(messages.allPublicTasksWithBounties) }
              <Chip
                label={withBountiesCount}
                size="small"
                variant="outlined"
                className={taskListState.tab === 1 ? classes.chipActive : classes.chip}
              />
            </Button>
            <Button
              value={taskListState.tab}
              onClick={ (e) => handleTabChange(e, 2) }
              className={ taskListState.tab === 2 ? classes.buttonActive : classes.button }
            >
              { intl.formatMessage(messages.allPublicTasksNoBounties) }
              <Chip
                label={noBountiesCount}
                size="small"
                variant="outlined"
                className={taskListState.tab === 2 ? classes.chipActive : classes.chip}
              />

            </Button>
          </ButtonGroup>
        </div>
        <div style={{marginLeft: 10}}>
          <Labels />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default injectIntl(withRouter(withStyles(styles)(TaskFilters)))

