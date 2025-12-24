import React from 'react'
import { Chip } from '@mui/material'
import IssueLabelsListPlaceholder from './issue-labels.placeholder'

export const IssueLabelsList = ({ labels, completed }) => {
  const taskLabels = (labels) => {
    return completed ? (
      labels?.map((label) => (
        <Chip
          key={label.id}
          label={label?.name}
          style={{ marginRight: 10, marginTop: 10, marginBottom: 10 }}
          variant="outlined"
        />
      ))
    ) : (
      <IssueLabelsListPlaceholder />
    )
  }

  return <div>{taskLabels(labels)}</div>
}

export default IssueLabelsList
