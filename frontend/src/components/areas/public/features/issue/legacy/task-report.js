import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import _ from 'lodash'
import messageEn from '../../../../../../translations/en.json'
import messageBr from '../../../../../../translations/br.json'
import styled from 'styled-components'

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
  TextField,
} from '@mui/material'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

class TaskReport extends Component {
  constructor(props) {
    super(props)

    this.state = { open: false, reason: '', anotherReasonListed: false }
  }

  static defaultProps = { visible: true }

  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    reportTask: PropTypes.func,
  }

  getLanguage = () => {
    if (_.isEmpty(this.props.user)) {
      // eslint-disable-next-line no-undef
      return localStorage.getItem('userLanguage') || 'en'
    }
    return this.props.user.language || 'en'
  }

  onChangeReason = (e) => {
    if (
      e.target.value.localeCompare(messageEn['task.report.reason.invalid']) === 0 ||
      e.target.value.localeCompare(messageEn['task.report.reason.fourOFour']) === 0 ||
      e.target.value.localeCompare(messageEn['task.report.reason.testOrAccident']) === 0 ||
      e.target.value.localeCompare(messageBr['task.report.reason.invalid']) === 0 ||
      e.target.value.localeCompare(messageBr['task.report.reason.fourOFour']) === 0 ||
      e.target.value.localeCompare(messageBr['task.report.reason.testOrAccident']) === 0
    ) {
      this.setState({ reason: e.target.value, anotherReasonListed: false })
    } else {
      this.setState({
        reason: e.target.value === 0 ? '' : e.target.value,
        anotherReasonListed: true,
      })
    }
  }

  selectOtherReason = (event) => this.setState({ value: '', anotherReasonListed: true })

  sendReport = (e) => {
    e.preventDefault()
    this.props.reportTask(this.props.taskData, this.state.reason)
    this.setState({ reason: '' })
    this.props.onClose()
  }

  closeModal = () => {
    this.props.onClose()
    this.setState({ reason: '' })
  }

  render() {
    const { visible } = this.props
    const { reason, anotherReasonListed } = this.state
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
      <Dialog
        open={visible}
        onClose={() => this.props.onClose()}
        aria-labelledby="form-dialog-title"
      >
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
                or has some error or even inappropriate content, please let us know and we will take action"
            />
          </Typography>
          <form
            onChange={this.onChangeReason}
            type="POST"
            style={{ marginTop: '20px 0px 10px', color: 'grey' }}
          >
            <FormControl fullWidth>
              <RadioGroup name={'reason'} value={reason} onChange={this.onChangeReason}>
                <FormControlLabel
                  id="task.report.reason.invalid"
                  value={
                    this.getLanguage().localeCompare('br') === 0
                      ? messageBr['task.report.reason.invalid']
                      : messageEn['task.report.reason.invalid']
                  }
                  label={invalid}
                  control={<Radio color="primary" />}
                />
                <FormControlLabel
                  id="task.report.reason.fourOFour"
                  value={
                    this.getLanguage().localeCompare('br') === 0
                      ? messageBr['task.report.reason.fourOFour']
                      : messageEn['task.report.reason.fourOFour']
                  }
                  label={fourOFour}
                  control={<Radio color="primary" />}
                />
                <FormControlLabel
                  id="task.report.reason.testOrAccident"
                  value={
                    this.getLanguage().localeCompare('br') === 0
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
                  onChange={this.onChangeReason}
                  checked={anotherReasonListed}
                />
                <TextField
                  style={{ maxWidth: 300, display: !anotherReasonListed && 'none' }}
                  label={
                    this.getLanguage().localeCompare('br') === 0
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
          <Button onClick={() => this.closeModal()} color="primary">
            <FormattedMessage id="task.report.form.cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            disabled={reason.length === 0}
            onClick={this.sendReport}
            variant="contained"
            color="primary"
          >
            <FormattedMessage id="task.report.form.report" defaultMessage="Report" />
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default injectIntl(TaskReport)
