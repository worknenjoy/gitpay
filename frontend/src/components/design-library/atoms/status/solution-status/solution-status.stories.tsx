import SolutionStatus from './solution-status'

export default {
  title: 'Design Library/Atoms/Status/SolutionStatus',
  component: SolutionStatus
}

export const Open = {
  args: {
    status: 'open'
  }
}

export const Merged = {
  args: {
    status: 'merged'
  }
}

export const Closed = {
  args: {
    status: 'closed'
  }
}

export const Loading = {
  args: {
    status: 'merged',
    completed: false
  }
}
