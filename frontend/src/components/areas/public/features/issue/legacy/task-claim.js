import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Typography,
  InputLabel,
  Input,
} from '@mui/material'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

class TaskClaim extends Component {
  constructor(props) {
    super(props)
    this.state = { comments: '', charactersCount: 0 }
  }

  static defaultProps = { open: true }

  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    requestClaimTask: PropTypes.func,
  }

  onChangeMessage = (event) =>
    this.setState({
      [event.target.name]: event.target.value,
      charactersCount: event.target.value.length,
    })

  sendClaim = (e) => {
    e.preventDefault()
    this.props.requestClaimTask(
      this.props.taskData.id,
      this.props.user.id,
      this.state.comments,
      false,
      null,
      this.props.history,
    )
    this.setState({ comments: '', charactersCount: 0 })
    this.props.onClose()
  }

  render() {
    const { open } = this.props
    const { comments, charactersCount } = this.state

    return (
      <Container>
        <Dialog
          open={open}
          onClose={() => this.props.onClose()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <FormattedMessage id="task.claim.title" defaultMessage="Claim issue" />
          </DialogTitle>
          <DialogContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ color: 'grey', fontWeight: 'bold', marginBottom: 20 }}
            >
              <FormattedMessage
                id="task.claim.subtitle"
                defaultMessage="If you're the original author of this issue, you can claim this issue so you will be admin and transfer the property to manage the issue on Gitpay."
              />
            </Typography>
            <form onChange={this.onChangeMessage} type="POST">
              <FormControl fullWidth style={{ maxWidth: 300 }}>
                <InputLabel htmlFor="claim-comments">
                  <FormattedMessage id="task.claim.comments.label" defaultMessage="Comments" />
                </InputLabel>
                <Input
                  id="claim-comments"
                  name="comments"
                  type="text"
                  inputProps={{ maxLength: '50' }}
                  value={comments}
                />

                <small
                  style={{
                    fontFamily: 'Roboto',
                    color: '#a9a9a9',
                    marginTop: '10px',
                    textAlign: 'right',
                  }}
                >
                  {charactersCount + '/50'}
                </small>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.onClose()} color="primary">
              <FormattedMessage id="task.claim.form.cancel" defaultMessage="Cancel" />
            </Button>
            <Button onClick={this.sendClaim} variant="contained" color="secondary">
              <FormattedMessage id="task.claim.form.send" defaultMessage="Claim" />
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}

export default injectIntl(TaskClaim)
