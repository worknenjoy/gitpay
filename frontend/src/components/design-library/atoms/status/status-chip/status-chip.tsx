import React from 'react'
import { StyledChip, StatusChipTone } from './status-chip.styles'

export type { StatusChipTone }

type StatusChipProps = {
  label: React.ReactNode
  tone?: StatusChipTone
}

const StatusChip = ({ label, tone = 'neutral' }: StatusChipProps) => (
  <StyledChip size="small" label={label} tone={tone} />
)

export default StatusChip
