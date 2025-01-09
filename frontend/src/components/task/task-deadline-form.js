import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import MomentComponent from 'moment'
import { withStyles } from '@material-ui/core/styles'

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
} from '@material-ui/core'
import DateIcon from '@material-ui/icons/DateRange'

const timeIcon = require('../../images/time-icon.png')

const messages = defineMessages({
  deadlineLevel1: {
    id: 'task.deadline.level1',
    defaultMessage: ' In one week '
  },
  deadlineLevel2: {
    id: 'task.deadline.level2',
    defaultMessage: ' In fifteen days '
  },
  deadlineLevel3: {
    id: 'task.deadline.level3',
    defaultMessage: ' In twenty days '
  },
  deadlineLevel4: {
    id: 'task.deadline.level4',
    defaultMessage: ' In on month '
  },
})

const styles = theme => ({
  btnClearDeadline: {
    float: 'left',
    marginTop: 10,
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
  },
  dayLabel: {
    marginTop: 0,
    marginLeft: '2em'
  }
})

class TaskDeadlineForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deadline: props.task?.deadline || null,
      open: false,
      dateChanged: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.task?.deadline !== this.props.task?.deadline) {
      this.setState({ deadline: this.props.task?.deadline || null })
    }
  }

  pickTaskPrice = (price) => {
    this.setState({
      currentPrice: price,
      finalPrice: parseInt(price) + parseInt(this.state.orderPrice)
    })
  }

  handleInputChange = (e) => {
    e.preventDefault()
    this.setState({ current_price: e.target.value })
  }

  handleDeadline = () => {
    this.props.updateTask({
      id: this.props.match.params.id,
      deadline: this.state.deadline
    })
    this.setState({
      open: true,
      dateChanged: false
    })
  }

  pickTaskDeadline = (time) => {
    const date = MomentComponent(this.state.deadline).isValid()
      ? MomentComponent(this.state.deadline)
      : MomentComponent()
    const newDate = date.add(time, 'days').format()
    this.setState({ deadline: newDate })
  }

  handleInputChangeCalendar = (e) => {
    this.setState({ deadline: e.target.value, dateChanged: true })
  }

  handleClearDeadline = () => {
    this.props.updateTask({
      id: this.props.match.params.id,
      deadline: null
    })
    this.setState({ deadline: null })
  }

  renderChip(label, value) {
    return (
      <Chip
        style={{ marginBottom: 20 }}
        label={label}
        className={this.props.classes.chip}
        onClick={() => {
          this.pickTaskDeadline(value)
          this.setState({ dateChanged: false })
        }}
      />
    )
  }

  render() {
    const { classes, intl } = this.props

    return (
      <div>
        <Collapse in={!!this.props.open}>
          <FormattedMessage id='task.status.deadline.subheading.main' defaultMessage='Choose a date that this task should be finished'>
            {(msg) => (
              <CardMedia
                className={classes.cover}
                image={timeIcon}
                title={msg}
              />
            )}
          </FormattedMessage>
          <div className={classes.details}>
            <Typography variant='h5'>
              <FormattedMessage id='task.status.deadline.headline' defaultMessage='Finish date' />
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              <FormattedMessage id='task.status.deadline.subheading' defaultMessage='Choose a date that this task should be finished' />,
            </Typography>
            <div className={classes.chipContainer}>
              {[{ label: intl.formatMessage(messages.deadlineLevel1), value: 7 }, { label: intl.formatMessage(messages.deadlineLevel2), value: 15 }, { label: intl.formatMessage(messages.deadlineLevel3), value: 20 }, { label: intl.formatMessage(messages.deadlineLevel4), value: 30 }].map((item, index) => {
                return this.renderChip(item.label, item.value)
              })
              }
            </div>
            <form className={classes.formPayment} action='POST'>
              <FormControl fullWidth>
                <FormattedMessage id='task.status.deadline.day.label' defaultMessage='Day'>
                  {(msg) => (
                    <InputLabel htmlFor='adornment-date' className={classes.dayLabel}>{msg}</InputLabel>
                  )}
                </FormattedMessage>
                <FormattedMessage id='task.status.deadline.day.insert.label' defaultMessage='Choose a date'>
                  {(msg) => (
                    <Input
                      id='adornment-date'
                      startAdornment={<InputAdornment position='start'><DateIcon /></InputAdornment>}
                      placeholder={msg}
                      type='date'
                      value={`${MomentComponent(this.state.deadline).format('YYYY-MM-DD')}` || `${MomentComponent().format('YYYY-MM-DD')}`}
                      onChange={this.handleInputChangeCalendar}
                    />
                  )}
                </FormattedMessage>
              </FormControl>
              <Button disabled={!this.state.deadline} onClick={this.handleDeadline} variant='contained' color='primary' className={classes.btnPayment}>
                {this.state.deadline && this.state.dateChanged
                  ? <FormattedMessage id='task.status.deadline.set.target' defaultMessage='set to target date to {date}' values={{
                    date: MomentComponent(this.state.deadline).format('MM/DD/YYYY')
                  }} />
                  : <FormattedMessage id='task.deadline.button.save' defaultMessage='Save date' />
                }
              </Button>
              {this.state.deadline && (
                <Button
                  onClick={this.handleClearDeadline}
                  variant='outlined'
                  color='secondary'
                  className={classes.btnClearDeadline}
                >
                  <FormattedMessage id='task.deadline.button.clear' defaultMessage='Clear deadline' />
                </Button>
              )}
            </form>
            <div className={classes.controls} />
          </div>
        </Collapse>
      </div>
    )
  }
}

TaskDeadlineForm.propTypes = {
  updateTask: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  task: PropTypes.object
}

export default injectIntl(withStyles(styles)(TaskDeadlineForm))
