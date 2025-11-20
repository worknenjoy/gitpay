import { Skeleton, Typography } from '@mui/material'
import React from 'react'

const ContextTitle = ({ context, title }) => {
  return (
    <div style={{ margin: '20px 0' }}>
      <Typography variant="h5">{title || <Skeleton width={250} />}</Typography>
      <Typography variant="h3" color="textSecondary">
        {context?.completed ? context?.data.name : <Skeleton width={150} />}
      </Typography>
    </div>
  )
}

export default ContextTitle
