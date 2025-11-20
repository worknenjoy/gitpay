import React, { useState, useEffect } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import MomentComponent from 'moment'
import { styled } from '@mui/material/styles'

import {
  CardMedia,
  Typography,
  Button,
  Chip,
  Input,
  InputLabel,
  InputAdornment,
  Collapse,
  FormControl,
} from '@mui/material'
import DateIcon from '@mui/icons-material/DateRange'

import TimeIcon from 'images/time-icon.png'

const messages = defineMessages({
  deadlineLevel1: {
    id: 'task.deadline.level1',
    defaultMessage: ' In one week ',
  },
  deadlineLevel2: {
    id: 'task.deadline.level2',
    defaultMessage: ' In fifteen days ',
  },
  deadlineLevel3: {
    id: 'task.deadline.level3',
    defaultMessage: ' In twenty days ',
  },
  deadlineLevel4: {
    id: 'task.deadline.level4',
    defaultMessage: ' In on month ',
  },
})

const ChipsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
}))

const TaskDeadlineForm = ({ onHandleClearDeadline, onHandleDeadline, open, task }) => {
  const [deadline, setDeadline] = useState(task?.deadline || null)
  const [isOpen, setIsOpen] = useState(false)
  const [dateChanged, setDateChanged] = useState(false)
  const intl = useIntl()

  useEffect(() => {
    setDeadline(task?.deadline || null)
  }, [task?.deadline])

  const pickTaskDeadline = (time) => {
    const date = MomentComponent(deadline).isValid() ? MomentComponent(deadline) : MomentComponent()
    const newDate = date.add(time, 'days').format()
    setDeadline(newDate)
    setDateChanged(false)
  }

  const handleInputChangeCalendar = (e) => {
    setDeadline(e.target.value)
    setDateChanged(true)
  }

  const handleClearDeadline = () => {
    onHandleClearDeadline()
    setDeadline(null)
  }

  const handleDeadline = () => {
    onHandleDeadline(deadline)
    setIsOpen(true)
    setDateChanged(false)
  }

  const renderChip = (label, value) => (
    <Chip sx={{ mb: 2.5 }} label={label} onClick={() => pickTaskDeadline(value)} />
  )

  return (
    <div style={{ marginTop: 24, marginBottom: 24 }}>
      <Collapse in={!!open}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'flex-start',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <CardMedia
              component="img"
              image={TimeIcon}
              alt={intl.formatMessage({
                id: 'task.status.deadline.subheading.main',
                defaultMessage: 'Choose a date that this task should be finished',
              })}
              title={intl.formatMessage({
                id: 'task.status.deadline.subheading.main',
                defaultMessage: 'Choose a date that this task should be finished',
              })}
              sx={{ width: 40, height: 40, objectFit: 'contain' }}
            />
            <div>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage id="task.status.deadline.headline" defaultMessage="Finish date" />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <FormattedMessage
                  id="task.status.deadline.subheading"
                  defaultMessage="Choose a date that this task should be finished"
                />
                ,
              </Typography>
            </div>
          </div>
          <ChipsContainer>
            {[
              { label: intl.formatMessage(messages.deadlineLevel1), value: 7 },
              { label: intl.formatMessage(messages.deadlineLevel2), value: 15 },
              { label: intl.formatMessage(messages.deadlineLevel3), value: 20 },
              { label: intl.formatMessage(messages.deadlineLevel4), value: 30 },
            ].map((item, index) => {
              return renderChip(item.label, item.value)
            })}
          </ChipsContainer>
          <form action="POST">
            <FormControl fullWidth>
              <FormattedMessage id="task.status.deadline.day.label" defaultMessage="Day">
                {(msg) => (
                  <InputLabel htmlFor="adornment-date" sx={{ mt: 0, ml: '2em' }}>
                    {msg}
                  </InputLabel>
                )}
              </FormattedMessage>
              <Input
                id="adornment-date"
                startAdornment={
                  <InputAdornment position="start">
                    <DateIcon />
                  </InputAdornment>
                }
                placeholder={intl.formatMessage({
                  id: 'task.status.deadline.day.insert.label',
                  defaultMessage: 'Choose a date',
                })}
                type="date"
                value={
                  `${MomentComponent(deadline).format('YYYY-MM-DD')}` ||
                  `${MomentComponent().format('YYYY-MM-DD')}`
                }
                onChange={handleInputChangeCalendar}
              />
            </FormControl>
            <div
              style={{
                marginTop: 16,
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              {deadline && (
                <Button
                  onClick={handleClearDeadline}
                  variant="outlined"
                  color="secondary"
                  sx={{ color: 'error.main', borderColor: 'error.main' }}
                  style={{ marginRight: 8 }}
                >
                  <FormattedMessage
                    id="task.deadline.button.clear"
                    defaultMessage="Clear deadline"
                  />
                </Button>
              )}
              <Button
                disabled={!deadline}
                onClick={handleDeadline}
                variant="contained"
                color="primary"
              >
                {deadline && dateChanged ? (
                  <FormattedMessage
                    id="task.status.deadline.set.target"
                    defaultMessage="set to target date to {date}"
                    values={{
                      date: MomentComponent(deadline).format('MM/DD/YYYY'),
                    }}
                  />
                ) : (
                  <FormattedMessage id="task.deadline.button.save" defaultMessage="Save date" />
                )}
              </Button>
            </div>
          </form>
          <div />
        </div>
      </Collapse>
    </div>
  )
}

export default TaskDeadlineForm
