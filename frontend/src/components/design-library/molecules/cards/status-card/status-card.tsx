import React from 'react'
import StatCard from '../stat-card/stat-card'

type StatusCardProps = {
  name: string | React.ReactNode
  /** Display value: schedule interval, label, or custom node (e.g. FormattedMessage) */
  status: string | number | React.ReactNode
  icon?: React.ReactNode
  note?: React.ReactNode
  onAdd?: (e: any) => void
  action?: React.PropsWithChildren<any>
  actionProps?: any
  completed?: boolean
}

const StatusCard = ({
  name,
  status,
  icon,
  note,
  onAdd,
  action,
  actionProps,
  completed
}: StatusCardProps) => (
  <StatCard
    icon={icon}
    label={name}
    value={status}
    note={note}
    onAdd={onAdd}
    action={action}
    actionProps={actionProps}
    completed={completed}
  />
)

export default StatusCard
