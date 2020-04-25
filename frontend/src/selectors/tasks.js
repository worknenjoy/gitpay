import { createSelector } from 'reselect'

const getVisibilityFilter = (state) => state.tasks.filterType
export const getTasks = (state) => state.tasks
export const getUser = (state) => state.loggedIn.user

export const getFilteredTasks = createSelector(
  [getVisibilityFilter, getTasks, getUser],
  (visibilityFilter, tasks, user) => {
    switch (visibilityFilter) {
      case 'all':
        return tasks
      case 'userId':
        return { ...tasks, data: tasks.data.filter(item => item.userId === user.id) }
      case 'Assigns':
        return {
          ...tasks,
          data: tasks.data.filter(item => {
            const interested = item.Assigns.filter(assign => assign.userId === user.id)
            return interested.length
          }) }
      case 'status':
        return { ...tasks, data: tasks.data.filter(item => item.status === tasks.filterValue) }
      case 'assigned':
        return {
          ...tasks,
          data: tasks.data.filter(item => {
            const interested = item.Assigns.filter(assign => assign.userId === user.id)
            if (interested.length) {
              return item.assigned === interested[0].id
            }
          }) }
      case 'value':
        return {
          ...tasks,
          data: tasks.data.filter(item => {
            const filterValue = tasks.filterValue

            if (filterValue === 'issuesWithBounties') {
              return parseFloat(item.value) > parseFloat('0')
            }
            else if (filterValue === 'contribution') {
              return parseFloat(item.value) === parseFloat('0')
            }
          })
        }
      default:
        return tasks
    }
  }
)
