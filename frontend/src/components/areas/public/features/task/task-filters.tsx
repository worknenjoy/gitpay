import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Select, MenuItem, Chip, InputLabel, OutlinedInput } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Labels from '../../../../../containers/label';
import Language from '../../../../../containers/language';

const styles = (theme) => ({
  select: {
    backgroundColor: 'transparent'
  },
  chip: {
    marginLeft: theme.spacing(1),
  },
  chipActive: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.dark,
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

import { RouteComponentProps } from 'react-router-dom';

interface TaskFiltersProps extends RouteComponentProps {
  intl: any;
  history: any;
  classes: any;
  filterTasks: any;
  baseUrl?: string;
  tasks: any;
  filteredTasks: any;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
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
  const handleTabChange = (event) => {
    const value = event.target.value;
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

  return (
    <AppBar position='static' color='transparent' elevation={0}>
      <Toolbar style={{ display: 'flex', placeContent: 'space-between', margin: 0, padding: 0 }}>
        <FormControl>
          <Select
            value={taskListState.tab}
            onChange={handleTabChange}
            className={classes.select}
            variant="outlined"
          >
            <MenuItem value={0}>
              {intl.formatMessage(messages.allTasks)}
              <Chip
                label={allTasksCount}
                size="small"
                variant="outlined"
                className={taskListState.tab === 0 ? classes.chipActive : classes.chip}
              />
            </MenuItem>
            <MenuItem value={1}>
              {intl.formatMessage(messages.allPublicTasksWithBounties)}
              <Chip
                label={withBountiesCount}
                size="small"
                variant="outlined"
                className={taskListState.tab === 1 ? classes.chipActive : classes.chip}
              />
            </MenuItem>
            <MenuItem value={2}>
              {intl.formatMessage(messages.allPublicTasksNoBounties)}
              <Chip
                label={noBountiesCount}
                size="small"
                variant="outlined"
                className={taskListState.tab === 2 ? classes.chipActive : classes.chip}
              />
            </MenuItem>
          </Select>
        </FormControl>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
          <div>
            <Labels />
          </div>
          <div style={{ marginLeft: 10 }}>
            <Language />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default injectIntl(withRouter(withStyles(styles)(TaskFilters)))
