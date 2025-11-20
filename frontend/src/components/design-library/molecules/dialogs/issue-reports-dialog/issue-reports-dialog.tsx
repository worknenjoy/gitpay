import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import _ from 'lodash'
import messageEn from '../../../../../translations/en.json'
import messageBr from '../../../../../translations/br.json'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  TextField
} from '@mui/material'

export const IssueReportDialog = ({ visible = true, onClose, reportTask, taskData, user }) => {
  const [reason, setReason] = useState('')
  const [anotherReasonListed, setAnotherReasonListed] = useState(false)

  const getLanguage = () => {
    if (_.isEmpty(user)) {
      return localStorage.getItem('userLanguage') || 'en'
    }
    return user.language || 'en'
  }

  const onChangeReason = (e) => {
    const value = e.target.value
    if (
      value.localeCompare(messageEn['task.report.reason.invalid']) === 0 ||
      value.localeCompare(messageEn['task.report.reason.fourOFour']) === 0 ||
      value.localeCompare(messageEn['task.report.reason.testOrAccident']) === 0 ||
      value.localeCompare(messageBr['task.report.reason.invalid']) === 0 ||
      value.localeCompare(messageBr['task.report.reason.fourOFour']) === 0 ||
      value.localeCompare(messageBr['task.report.reason.testOrAccident']) === 0
    ) {
      setReason(value)
      setAnotherReasonListed(false)
    } else {
      setReason(value === 0 ? '' : value)
      setAnotherReasonListed(true)
    }
  }

  const sendReport = (e) => {
    e.preventDefault()
    reportTask(taskData, reason)
    setReason('')
    onClose()
  }

  const closeModal = () => {
    onClose()
    setReason('')
  }

  const characterLimit = 50

  const invalid = (
    <FormattedMessage
      id="task.report.reason.invalid"
      defaultMessage="The issue is invalid, it was removed by the providers (Github, Bitbucket) and it is not available anymore"
    />
  )
  const fourOFour = (
    <FormattedMessage
      id="task.report.reason.fourOFour"
      defaultMessage="This page is an error, for some reason the content is not loaded, or I receive a 404"
    />
  )
  const testOrAccident = (
    <FormattedMessage
      id="task.report.reason.testOrAccident"
      defaultMessage="This issue seems to be a test issue, or it was added accidentally"
    />
  )
  const anotherReason = (
    <FormattedMessage id="task.report.reason.another" defaultMessage="Another Reason" />
  )

  return (
    <Dialog open={visible} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" style={{ padding: '16px 24px 8px' }}>
        <FormattedMessage id="task.report.title" defaultMessage="Report Issue" />
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ color: 'grey', fontWeight: 'bold', marginBottom: 20 }}
        >
          <FormattedMessage
            id="task.report.subtitle"
            defaultMessage="If you think this issue is invalid, is just for test purposes,
            or has some error or even inapropriate content, please let us know and we will take action"
          />
        </Typography>
        <form
          onChange={onChangeReason}
          method="POST"
          style={{ marginTop: '20px 0px 10px', color: 'grey' }}
        >
          <FormControl fullWidth>
            <RadioGroup name={'reason'} value={reason} onChange={onChangeReason}>
              <FormControlLabel
                id="task.report.reason.invalid"
                value={
                  getLanguage().localeCompare('br') === 0
                    ? messageBr['task.report.reason.invalid']
                    : messageEn['task.report.reason.invalid']
                }
                label={invalid}
                control={<Radio color="primary" />}
              />
              <FormControlLabel
                id="task.report.reason.fourOFour"
                value={
                  getLanguage().localeCompare('br') === 0
                    ? messageBr['task.report.reason.fourOFour']
                    : messageEn['task.report.reason.fourOFour']
                }
                label={fourOFour}
                control={<Radio color="primary" />}
              />
              <FormControlLabel
                id="task.report.reason.testOrAccident"
                value={
                  getLanguage().localeCompare('br') === 0
                    ? messageBr['task.report.reason.testOrAccident']
                    : messageEn['task.report.reason.testOrAccident']
                }
                label={testOrAccident}
                control={<Radio color="primary" />}
              />
              <FormControlLabel
                value=""
                label={anotherReason}
                control={<Radio color="primary" />}
                onChange={onChangeReason}
                checked={anotherReasonListed}
              />
              <TextField
                style={{ maxWidth: 300, display: !anotherReasonListed && 'none' }}
                label={
                  getLanguage().localeCompare('br') === 0
                    ? messageBr['task.report.reason.custom']
                    : messageEn['task.report.reason.custom']
                }
                inputProps={{ maxLength: characterLimit }}
                helperText={`${reason.length}/${characterLimit}`}
              />
            </RadioGroup>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions style={{ marginBottom: 10 }}>
        <Button onClick={closeModal} color="primary">
          <FormattedMessage id="task.report.form.cancel" defaultMessage="Cancel" />
        </Button>
        <Button
          disabled={reason.length === 0}
          onClick={sendReport}
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="task.report.form.report" defaultMessage="Report" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default IssueReportDialog
