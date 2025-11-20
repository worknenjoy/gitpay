import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'

import { Chip } from '@mui/material'
import { styled } from '@mui/material/styles'

const LabelsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
}))

class TaskLabels extends Component {
  static propTypes = {
    labels: PropTypes.object,
  }

  handleListItemClick = () => {}

  taskLabels = (labels) => {
    return (
      <LabelsContainer>
        {labels.map((label, index) => (
          <Chip
            key={index + 1}
            label={label.name}
            sx={{ mr: 1.25, mt: 1.25, mb: 1.25 }}
            variant="outlined"
          />
        ))}
      </LabelsContainer>
    )
  }

  render() {
    const { labels } = this.props
    return <LabelsContainer>{labels && this.taskLabels(labels)}</LabelsContainer>
  }
}

export default injectIntl(withRouter(TaskLabels))
