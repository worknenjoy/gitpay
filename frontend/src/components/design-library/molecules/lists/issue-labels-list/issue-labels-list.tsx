import React from 'react'
import { Chip } from '@mui/material'
import { Skeleton } from '@mui/material'

const CustomPlaceholder = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Chip
          key={index}
          style={{ marginTop: 10, marginBottom: 10, marginRight: 10 }}
          variant="outlined"
          label={<Skeleton variant="rectangular" width={64} height={10} />}
        />
      ))}
    </>
  )
}

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
      <CustomPlaceholder />
    )
  }

  return <div>{taskLabels(labels)}</div>
}

export default IssueLabelsList
