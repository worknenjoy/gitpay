import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Select, MenuItem, Chip, FormControl } from '@mui/material';
import { useIntl, defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Labels from '../../../../../../containers/label';
import Language from '../../../../../../containers/language';

const classesStatic = {
  select: { backgroundColor: 'transparent' },
  chip: { marginLeft: 8 },
  chipActive: { marginLeft: 8, color: '#1a237e', borderColor: '#90caf9' }
} as const;

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
});

interface TaskFiltersProps {
  filterTasks: any;
  baseUrl?: string;
  tasks: any;
  filteredTasks: any;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filterTasks,
  baseUrl = '/tasks/',
  tasks,
  filteredTasks,
}) => {
  const classes = classesStatic;
  const intl = useIntl();
  const history = useHistory();

  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  });
  const [allTasksCount, setAllTasksCount] = useState(0);
  const [withBountiesCount, setWithBountiesCount] = useState(0);
  const [noBountiesCount, setNoBountiesCount] = useState(0);

  useEffect(() => {
    updateCounts(tasks);
  }, [tasks]);

  const updateCounts = (taskList: any[]) => {
    setAllTasksCount(taskList.length);
    setWithBountiesCount(
      taskList.filter((task) => parseFloat(task.value) > 0).length
    );
    setNoBountiesCount(
      taskList.filter((task) => parseFloat(task.value) === 0).length
    );
  };

  const handleTabChange = async (event: any) => {
    const value = event.target.value as number;
    setTaskListState({ ...taskListState, tab: value });
    let filterPromise;
    switch (value) {
      case 0:
        history.push(baseUrl + "open");
        filterPromise = await filterTasks("status", "open");
        break;
      case 1:
        history.push(baseUrl + "withBounties");
        filterPromise = await filterTasks("issuesWithBounties");
        break;
      case 2:
        history.push(baseUrl + "contribution");
        filterPromise = await filterTasks("contribution");
        break;
      default:
        filterPromise = await filterTasks("all");
    }
    filterPromise;
  };

  return (
    <AppBar position='static' color='transparent' elevation={0}>
      <Toolbar style={{ display: 'flex', placeContent: 'space-between', margin: 0, padding: 0 }}>
        <FormControl>
          <Select
            value={taskListState.tab}
            onChange={handleTabChange}
            sx={classes.select}
            variant="outlined"
          >
            <MenuItem value={0}>
              {intl.formatMessage(messages.allTasks)}
              <Chip
                label={allTasksCount}
                size="small"
                variant="outlined"
                sx={taskListState.tab === 0 ? classes.chipActive : classes.chip}
              />
            </MenuItem>
            <MenuItem value={1}>
              {intl.formatMessage(messages.allPublicTasksWithBounties)}
              <Chip
                label={withBountiesCount}
                size="small"
                variant="outlined"
                sx={taskListState.tab === 1 ? classes.chipActive : classes.chip}
              />
            </MenuItem>
            <MenuItem value={2}>
              {intl.formatMessage(messages.allPublicTasksNoBounties)}
              <Chip
                label={noBountiesCount}
                size="small"
                variant="outlined"
                sx={taskListState.tab === 2 ? classes.chipActive : classes.chip}
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
  );
};

export default TaskFilters;
