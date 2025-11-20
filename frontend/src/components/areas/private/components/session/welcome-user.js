import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  DialogContentText,
  MobileStepper
} from '@mui/material'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import welcome1 from 'images/welcome1.png'
import welcome2 from 'images/welcome2.png'
import welcome3 from 'images/welcome3.png'

export default class WelcomeUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStepIndex: 0,
      dialogueVisible: true
    }
  }
  render() {
    const content = {
      0: {
        textHeading: 'Be rewarded by work done',
        textContent: 'Complete the course and you will be awarded with points and earn badges',
        image: welcome1
      },
      1: {
        textHeading: 'Collaboration with others',
        textContent:
          'You can easily collaborate with your colleagues and will be able to help each other',
        image: welcome2
      },
      2: {
        textHeading: 'Work with projects you love',
        textContent:
          'Get some fantastic online videos and content to learn more and gain extra knowledge',
        image: welcome3
      }
    }
    return (
      <Dialog open={this.state.dialogueVisible} maxWidth={'xs'} aria-labelledby="form-dialog-title">
        <DialogContent>
          <button
            style={{ float: 'right', border: 'none' }}
            onClick={() => {
              this.setState({ dialogueVisible: false })
              window.localStorage.setItem('firstLogin', false)
            }}
          >
            <Typography variant="caption">
              <FormattedMessage id="skip" defaultMessage="Skip" />
            </Typography>
          </button>
          <div style={{ textAlign: 'center' }}>
            <img
              src={content[this.state.currentStepIndex]['image']}
              style={{ margin: '20px auto 0' }}
              width="70%"
            />

            <Typography variant="h5">
              {content[this.state.currentStepIndex]['textHeading']}
            </Typography>
            <DialogContentText>
              {content[this.state.currentStepIndex]['textContent']}
            </DialogContentText>
          </div>
        </DialogContent>
        <MobileStepper
          variant="dots"
          steps={3}
          position="static"
          activeStep={this.state.currentStepIndex}
          nextButton={
            <Button
              size="small"
              onClick={() => {
                if (this.state.currentStepIndex === 2) {
                  this.setState({ dialogueVisible: false })
                  window.localStorage.setItem('firstLogin', false)
                } else {
                  this.setState((prevState) => ({
                    currentStepIndex: prevState.currentStepIndex + 1
                  }))
                }
              }}
            >
              {this.state.currentStepIndex === 2 ? (
                <FormattedMessage id="first.task.Finish" defaultMessage="Finish" />
              ) : (
                <FormattedMessage id="first.task.next" defaultMessage="Next" />
              )}
            </Button>
          }
          backButton={
            <Button
              onClick={() =>
                this.setState((prevState) => ({
                  currentStepIndex: prevState.currentStepIndex - 1
                }))
              }
              disabled={this.state.currentStepIndex === 0}
              size="small"
            >
              {this.state.currentStepIndex !== 0 && (
                <FormattedMessage id="first.task.back" defaultMessage="Back" />
              )}
            </Button>
          }
        />
      </Dialog>
    )
  }
}
