import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Chip from 'material-ui/Chip'

const statuses = ['open', 'in_progress', 'closed']

const statusesDisplay = {
  open: 'Aberta',
  in_progress: 'Em desenvolvimento',
  closed: 'Finalizada'
}

class TaskStatusFilter extends Component {
  constructor (props) {
    super(props)
  }

  handleListItemClick = (value) => {
    this.props.onFilter('status', value)
  }

  render () {

    return (
      <div>
        <Chip
          style={{marginRight: 10}}
          onClick={ () => this.props.onFilter() }
          clickable={true}
          key={ 0 }
          label='Todas'
        />
        { statuses.map((status, index) =>
          (<Chip
            style={{marginRight: 10}}
            onClick={ () => this.handleListItemClick(status) }
            clickable={true}
            key={ index + 1 }
            label={ statusesDisplay[status] }
          />)
          )
        }
      </div>
    )
  }
}

TaskStatusFilter.propTypes = {
  onFilter: PropTypes.func
}

export default TaskStatusFilter
