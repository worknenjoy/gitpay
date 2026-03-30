import React from 'react'
import { Box, Typography, Paper, Avatar, Chip, Tooltip } from '@mui/material'
import {
  AddCircleOutline as CreatedIcon,
  MonetizationOn as BountyIcon,
  SwapHoriz as StatusIcon,
  Edit as EditIcon,
  Event as DeadlineIcon,
  Payment as PaidIcon,
  TrendingUp as StateIcon,
  History as DefaultIcon,
  LockOutlined as PrivacyIcon,
  Star as LevelIcon
} from '@mui/icons-material'
import { FormattedMessage, useIntl } from 'react-intl'
import moment from 'moment'

type HistoryEntry = {
  id: number
  type?: string | null
  fields?: string[] | null
  oldValues?: string[] | null
  newValues?: string[] | null
  createdAt?: string | Date
}

type IssueHistoryTimelineProps = {
  histories?: HistoryEntry[]
}

const FIELD_ICONS: Record<string, React.ReactElement> = {
  value: <BountyIcon fontSize="small" />,
  status: <StatusIcon fontSize="small" />,
  state: <StateIcon fontSize="small" />,
  title: <EditIcon fontSize="small" />,
  description: <EditIcon fontSize="small" />,
  deadline: <DeadlineIcon fontSize="small" />,
  paid: <PaidIcon fontSize="small" />,
  level: <LevelIcon fontSize="small" />,
  private: <PrivacyIcon fontSize="small" />,
  not_listed: <PrivacyIcon fontSize="small" />
}

const FIELD_COLORS: Record<string, string> = {
  value: '#1976d2',
  status: '#ed6c02',
  state: '#7b1fa2',
  title: '#616161',
  description: '#616161',
  deadline: '#e65100',
  paid: '#2e7d32',
  level: '#795548',
  private: '#455a64',
  not_listed: '#455a64'
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed: 'Closed',
  in_progress: 'In Progress'
}

const STATE_LABELS: Record<string, string> = {
  created: 'Created',
  funded: 'Funded',
  claimed: 'Claimed',
  completed: 'Completed'
}

function formatFieldValue(field: string, value: string | null | undefined): string {
  if (value == null || value === 'null' || value === 'undefined') return '—'
  if (field === 'value') return `$${Number(value).toFixed(2)}`
  if (field === 'status') return STATUS_LABELS[value] || value
  if (field === 'state') return STATE_LABELS[value] || value
  if (field === 'paid') return value === 'true' ? 'Paid' : 'Unpaid'
  if (field === 'private') return value === 'true' ? 'Private' : 'Public'
  if (field === 'not_listed') return value === 'true' ? 'Unlisted' : 'Listed'
  if (field === 'deadline') return value ? moment(value).format('MMM D, YYYY') : '—'
  if (value.length > 60) return value.slice(0, 60) + '…'
  return value
}

function buildMessage(
  field: string,
  oldVal: string | null | undefined,
  newVal: string | null | undefined
): React.ReactNode {
  const intlField: Record<string, React.ReactNode> = {
    value: <FormattedMessage id="task.history.field.value" defaultMessage="Bounty" />,
    status: <FormattedMessage id="task.history.field.status" defaultMessage="Status" />,
    state: <FormattedMessage id="task.history.field.state" defaultMessage="State" />,
    title: <FormattedMessage id="task.history.field.title" defaultMessage="Title" />,
    description: (
      <FormattedMessage id="task.history.field.description" defaultMessage="Description" />
    ),
    deadline: <FormattedMessage id="task.history.field.deadline" defaultMessage="Deadline" />,
    paid: <FormattedMessage id="task.history.field.paid" defaultMessage="Payment" />,
    level: <FormattedMessage id="task.history.field.level" defaultMessage="Difficulty" />,
    private: <FormattedMessage id="task.history.field.private" defaultMessage="Visibility" />,
    not_listed: <FormattedMessage id="task.history.field.not_listed" defaultMessage="Listing" />
  }

  const label = intlField[field] || field
  const fmtOld = formatFieldValue(field, oldVal)
  const fmtNew = formatFieldValue(field, newVal)

  const hasOld = oldVal != null && oldVal !== 'null' && oldVal !== '0' && oldVal !== ''
  const isDescription = field === 'description' || field === 'title'

  if (field === 'value') {
    if (!hasOld || fmtOld === '$0.00') {
      return (
        <span>
          <FormattedMessage
            id="task.history.bounty.added"
            defaultMessage="Bounty of {amount} was added"
            values={{ amount: <strong>{fmtNew}</strong> }}
          />
        </span>
      )
    }
    return (
      <span>
        <FormattedMessage
          id="task.history.bounty.updated"
          defaultMessage="Bounty updated from {old} to {new}"
          values={{
            old: <strong>{fmtOld}</strong>,
            new: <strong>{fmtNew}</strong>
          }}
        />
      </span>
    )
  }

  if (isDescription) {
    return (
      <span>
        {label} <FormattedMessage id="task.history.was.updated" defaultMessage="was updated" />
      </span>
    )
  }

  if (!hasOld) {
    return (
      <span>
        {label} <FormattedMessage id="task.history.set.to" defaultMessage="set to" />{' '}
        <strong>{fmtNew}</strong>
      </span>
    )
  }

  return (
    <span>
      {label} <FormattedMessage id="task.history.changed.from" defaultMessage="changed from" />{' '}
      <strong>{fmtOld}</strong> <FormattedMessage id="task.history.to" defaultMessage="to" />{' '}
      <strong>{fmtNew}</strong>
    </span>
  )
}

const TimelineDot = ({ field, isCreate }: { field?: string; isCreate?: boolean }) => {
  const icon = isCreate ? (
    <CreatedIcon fontSize="small" />
  ) : (
    (field && FIELD_ICONS[field]) || <DefaultIcon fontSize="small" />
  )
  const color = isCreate ? '#2e7d32' : (field && FIELD_COLORS[field]) || '#616161'

  return (
    <Avatar
      sx={{
        width: 28,
        height: 28,
        bgcolor: color,
        flexShrink: 0,
        zIndex: 1
      }}
    >
      {icon}
    </Avatar>
  )
}

const IssueHistoryTimeline = ({ histories }: IssueHistoryTimelineProps) => {
  const intl = useIntl()

  if (!histories || histories.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <DefaultIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
        <Typography color="text.secondary">
          <FormattedMessage id="task.history.empty" defaultMessage="No history yet." />
        </Typography>
      </Box>
    )
  }

  const sorted = [...histories].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )

  return (
    <Box sx={{ py: 1 }}>
      {sorted.map((entry, entryIndex) => {
        const isCreate = entry.type === 'create'
        const isLast = entryIndex === sorted.length - 1
        const fields = entry.fields || []
        const oldValues = entry.oldValues || []
        const newValues = entry.newValues || []

        // For 'create', show a single "Task was created" item
        if (isCreate) {
          return (
            <Box key={entry.id} sx={{ display: 'flex', gap: 1.5, mb: isLast ? 0 : 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TimelineDot isCreate />
                {!isLast && (
                  <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', mt: 0.5, minHeight: 20 }} />
                )}
              </Box>
              <Box sx={{ flex: 1, pb: 1 }}>
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={500}>
                    <FormattedMessage id="task.history.created" defaultMessage="Task was created" />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {moment(entry.createdAt).fromNow()} ·{' '}
                    {moment(entry.createdAt).format('MMM D, YYYY [at] h:mm A')}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )
        }

        // For 'update', flatten field changes — filter out noise
        const relevantFields = fields.filter((f) => f !== 'updatedAt' && f !== 'id')
        if (relevantFields.length === 0) return null

        // Determine primary field for icon/color (first relevant field)
        const primaryField = relevantFields[0]

        return (
          <Box key={entry.id} sx={{ display: 'flex', gap: 1.5, mb: isLast ? 0 : 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TimelineDot field={primaryField} />
              {!isLast && (
                <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', mt: 0.5, minHeight: 20 }} />
              )}
            </Box>
            <Box sx={{ flex: 1, pb: 1 }}>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {relevantFields.map((field, i) => {
                    const oldVal = oldValues[fields.indexOf(field)]
                    const newVal = newValues[fields.indexOf(field)]
                    return (
                      <Typography key={field} variant="body2">
                        {buildMessage(field, oldVal, newVal)}
                      </Typography>
                    )
                  })}
                </Box>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title={moment(entry.createdAt).format('MMM D, YYYY [at] h:mm A')}>
                    <Typography variant="caption" color="text.secondary" sx={{ cursor: 'default' }}>
                      {moment(entry.createdAt).fromNow()}
                    </Typography>
                  </Tooltip>
                  {relevantFields.length > 1 && (
                    <Chip
                      size="small"
                      label={intl.formatMessage(
                        { id: 'task.history.fields.changed', defaultMessage: '{n} fields changed' },
                        { n: relevantFields.length }
                      )}
                      sx={{ height: 18, fontSize: 10 }}
                    />
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default IssueHistoryTimeline
