import React from 'react'
import { Skeleton } from '@mui/material'
import { Head, Title, Count, Track, Fill } from './checklist-progress.styles'

type ChecklistProgressProps = {
  title?: React.ReactNode
  completed: number
  total: number
  completeLabel?: (completed: number, total: number) => React.ReactNode
  loading?: boolean
}

const ChecklistProgress = ({
  title,
  completed,
  total,
  completeLabel,
  loading
}: ChecklistProgressProps) => {
  const percent = total > 0 ? Math.min(100, (completed / total) * 100) : 0
  const countLabel = completeLabel
    ? completeLabel(completed, total)
    : `${completed}/${total} complete`

  return (
    <div>
      <Head>
        {title && <Title>{title}</Title>}
        {loading ? (
          <Skeleton variant="text" animation="wave" width={70} height={11} />
        ) : (
          <Count>{countLabel}</Count>
        )}
      </Head>
      {loading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={4}
          sx={{ borderRadius: '2px', mt: 1.5 }}
        />
      ) : (
        <Track>
          <Fill style={{ width: `${percent}%` }} />
        </Track>
      )}
    </div>
  )
}

export default ChecklistProgress
