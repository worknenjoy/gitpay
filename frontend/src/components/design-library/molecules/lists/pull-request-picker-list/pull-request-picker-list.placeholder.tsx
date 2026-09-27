import React from 'react'
import { Skeleton } from '@mui/material'
import { PlaceholderRow, RadioDot } from './pull-request-picker-list.styles'

type PullRequestPickerListPlaceholderProps = {
  count?: number
}

const PullRequestPickerListPlaceholder = ({ count = 3 }: PullRequestPickerListPlaceholderProps) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <PlaceholderRow key={index}>
        <RadioDot />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="45%" animation="wave" />
          <Skeleton variant="text" width="80%" animation="wave" />
        </div>
      </PlaceholderRow>
    ))}
  </>
)

export default PullRequestPickerListPlaceholder
