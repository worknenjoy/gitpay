import { Chip } from '@mui/material'
import React from 'react'
import TextEllipsis from 'text-ellipsis'

const IssueLabelsField = ({ issue }) => {
  const { Labels: labels } = issue
  return labels?.length ? (
    <div>
      {labels?.slice(0, 2).map((label, index) => (
        <Chip
          style={{ marginRight: 5, marginBottom: 5 }}
          size="small"
          label={TextEllipsis(`${label.name || ''}`, 10)}
        />
      ))}{' '}
      ...
    </div>
  ) : (
    <>-</>
  )
}

export default IssueLabelsField
