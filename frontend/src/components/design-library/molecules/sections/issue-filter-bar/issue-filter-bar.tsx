import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { useIntl, defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';
import LabelsFilter from '../../../atoms/filters/labels-filter/labels-filter';
import LanguageFilter from '../../../atoms/filters/languages-filter/languages-filter';
import IssueFilter from '../../../atoms/filters/issue-filter/issue-filter';

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
  labels: any;
  listLabels: any;
  listTasks: any;
  languages: any;
  listLanguages: any;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filterTasks,
  baseUrl = '/tasks/',
  tasks,
  filteredTasks,
  labels,
  listLabels,
  listTasks,
  languages,
  listLanguages
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

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar style={{ display: 'flex', placeContent: 'space-between', margin: 0, padding: 0 }}>
        <div>
          <IssueFilter 
            filterTasks={filterTasks}
            filteredTasks={filteredTasks}
            tasks={tasks}
            baseUrl={baseUrl}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
          <div>
            <LabelsFilter
              labels={labels}
              listLabels={listLabels}
              listTasks={listTasks}
            />
          </div>
          <div style={{ marginLeft: 10 }}>
            <LanguageFilter
              languages={languages}
              listLanguages={listLanguages}
              listTasks={listTasks}
            />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TaskFilters;
