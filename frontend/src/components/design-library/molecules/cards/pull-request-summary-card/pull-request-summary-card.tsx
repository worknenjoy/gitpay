import React from 'react'
import { Chip, Skeleton } from '@mui/material'
import PullRequestIcon from '../../../atoms/icons/pull-request-icon/pull-request-icon'
import { Root, IconWrap, Body, Meta, Title } from './pull-request-summary-card.styles'

export type PullRequestState = 'open' | 'closed' | 'merged'

export type PullRequestSummaryCardProps = {
  repo: string
  number: number
  title: string
  state: PullRequestState
  authoredByViewer?: boolean
  completed?: boolean
}

export const PullRequestStatusChip = ({ state }: { state: PullRequestState }) => {
  if (state === 'merged') {
    return (
      <Chip
        size="small"
        label="Merged"
        sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
      />
    )
  }
  if (state === 'closed') {
    return <Chip size="small" label="Closed" variant="outlined" />
  }
  return <Chip size="small" label="Open" color="secondary" />
}

const PullRequestSummaryCard = ({
  repo,
  number,
  title,
  state,
  authoredByViewer = true,
  completed = true
}: PullRequestSummaryCardProps) => {
  if (!completed) {
    return (
      <Root>
        <Skeleton variant="circular" width={28} height={28} animation="wave" />
        <Body>
          <Skeleton variant="text" width="45%" animation="wave" />
          <Skeleton variant="text" width="80%" animation="wave" />
        </Body>
        <Skeleton variant="rounded" width={56} height={24} animation="wave" />
      </Root>
    )
  }

  return (
    <Root>
      <IconWrap>
        <PullRequestIcon fontSize="small" />
      </IconWrap>
      <Body>
        <Meta>
          {repo} · #{number}
          {authoredByViewer ? ' · opened by you' : ''}
        </Meta>
        <Title>{title}</Title>
      </Body>
      <PullRequestStatusChip state={state} />
    </Root>
  )
}

export default PullRequestSummaryCard
