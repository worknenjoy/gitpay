import MergeStatus from './merge-status'

export default {
  title: 'Design Library/Atoms/Status/MergeStatus',
  component: MergeStatus
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
