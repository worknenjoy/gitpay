import { createSelector } from 'reselect'

const getVisibilityFilter = (state) => state.tasks.filterType
export const getTasks = (state) => state.tasks
export const getUser = (state) => state.loggedIn.data
export const getProject = (state) => state.project
export const getOrganization = (state) => state.organization

const filterByAdditional = (task, additional, filteredByPrincipal) => {
  const filteringAllOfAdditional = typeof filteredByPrincipal === 'undefined'

  if (additional === 'issuesWithBounties') {
    return filteringAllOfAdditional ? evaluateTaskWithBountyByValue(task.value) : ((filteredByPrincipal) && (evaluateTaskWithBountyByValue(task.value)))
  }

  if (additional === 'contribution') {
    return filteringAllOfAdditional ? evaluateTaskWithoutBountyByValue(task.value) : ((filteredByPrincipal) && (evaluateTaskWithoutBountyByValue(task.value)))
  }

  return task
}

const evaluateTaskWithBountyByValue = (value) => {
  return (parseFloat(value) > parseFloat('0'))
}

const evaluateTaskWithoutBountyByValue = (value) => {
  return parseFloat(value) === parseFloat('0')
}

const getTaskWithAnyOrder = (task, user) => {
  const hasUserOrder = task.Orders.some(order => order.userId === user.id)
  return hasUserOrder ? task : null
}

const getListed = (data) => {
  return data.filter(t => t.not_listed === false)
}

export const getFilteredTasks = createSelector(
  [getVisibilityFilter, getTasks, getUser, getProject, getOrganization],
  (visibilityFilter, tasks, user, project, organization) => {
    let filteredTasks
    switch (visibilityFilter) {
      case 'all':
        filteredTasks = tasks
        break;
      case 'userId':
        filteredTasks = { ...tasks, data: tasks.data.filter(item => item.userId === user.id) }
        break;
      case 'Assigns':
        filteredTasks = {
          ...tasks,
          data: tasks.data.length ? tasks.data.filter(item => {
            const interested = item.Assigns.filter(assign => assign.userId === user.id)
            return interested.length
          }) : []  
        }
        break;
      case 'status':
        filteredTasks = {
          ...tasks,
          data: tasks.data.length ? tasks.data.filter(item => {
            const additionalFilter = tasks.filterAdditional

            if (tasks.filterValue === 'all') {
              return filterByAdditional(item, additionalFilter)
            }
            else {
              const filteredByPrincipal = item.status === tasks.filterValue
              return filterByAdditional(item, additionalFilter, filteredByPrincipal)
            }
          }) : []
        }
        break;
      case 'assigned':
        filteredTasks = {
          ...tasks,
          data: tasks.data.length ? tasks.data.filter(item => {
            const interested = item.Assigns.filter(assign => assign.userId === user.id)
            if (interested.length) {
              return item.assigned === interested[0].id
            }
          }) : []
        }
        break;
      case 'issuesWithBounties':
        filteredTasks = { ...tasks, data: tasks.data.length ? tasks.data.filter(item => evaluateTaskWithBountyByValue(item.value)) : [] }
        break;
      case 'contribution':
        filteredTasks = { ...tasks, data: tasks.data.length ? tasks.data.filter(item => evaluateTaskWithoutBountyByValue(item.value)) : [] }
        break;
      case 'supported':
        filteredTasks = { ...tasks,
          data: tasks.data.length ? tasks.data.filter(item => getTaskWithAnyOrder(item, user)) : [] }
        break;
      default:
        filteredTasks = tasks
      }
      if(visibilityFilter === 'userId') {
        return filteredTasks
      } else {
        return {...tasks, data: getListed(filteredTasks.data)}
      }
  }
)
