import { Chip, Typography } from '@mui/material'
import React from 'react'
import TextEllipsis from 'text-ellipsis'

const IssueLabelsField = ({ issue }) => {
  const { Labels: labels } = issue
  return labels?.length ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      {labels.slice(0, 2).map((label) => (
        <Chip
          key={label.name}
          variant="outlined"
          size="small"
          label={TextEllipsis(`${label.name || ''}`, 10)}
        />
      ))}
      {labels.length > 2 && (
        <Typography variant="caption" color="text.secondary">
          +{labels.length - 2}
        </Typography>
      )}
    </div>
  ) : (
    <>-</>
  )
}

export default IssueLabelsField
