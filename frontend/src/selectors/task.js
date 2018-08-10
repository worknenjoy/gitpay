import { createSelector } from 'reselect'

const getOrdersBy = (state) => state.task.filterOrdersBy
export const getTask = (state) => state.task

export const getTaskOrdersByFilter = createSelector(
  [getOrdersBy, getTask],
  (filter, task) => {
    switch (filter.provider) {
      case 'paypal':
        return { ...task,
          data: {
            ...task.data,
            orders: task.data.orders.filter(item => item.provider === 'paypal') }
        }
      case 'stripe':
        return { ...task,
          data: {
            ...task.data,
            orders: task.data.orders.filter(item => item.provider !== 'paypal') }
        }
      default:
        return task
    }
  }
)
