import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Card, { CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Chip from 'material-ui/Chip'
import { FormControl } from 'material-ui/Form'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import Collapse from 'material-ui/transitions/Collapse'
import DateIcon from 'material-ui-icons/DateRange'
import MomentComponent from 'moment'

const timeIcon = require('../../images/time-icon.png')

class TaskDeadlineForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      deadline: null
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
  }

  pickTaskDeadline = (time) => {
    const date = MomentComponent(this.state.deadline).isValid()
      ? MomentComponent(this.state.deadline)
      : MomentComponent()
    const newDate = date.add(time, 'days').format()
    this.setState({ deadline: newDate })
  }

  handleInputChangeCalendar = (e) => {
    this.setState({ deadline: e.target.value })
  }

  render () {
    const { classes } = this.props

    return (
      <div>
        <Collapse in={ !!this.props.open }>
          <Card className={ classes.card }>
            <CardMedia
              className={ classes.cover }
              image={ timeIcon }
              title='Escolha uma data limite para a realização desta tarefa'
            />
            <div className={ classes.details }>
              <CardContent className={ classes.content }>
                <Typography variant='headline'>Escolha uma data limite para a realização desta tarefa</Typography>
                <Typography variant='subheading' color='textSecondary'>
                  <FormattedMessage id='task.status.deadline.subheading' defaultMessage='Choose a date that this task should be finished' />,
                </Typography>
                <div className={ classes.chipContainer }>
                  <Chip
                    label=' daqui uma semana '
                    className={ classes.chip }
                    onClick={ () => this.pickTaskDeadline(7) }
                  />
                  <Chip
                    label=' daqui quinze dias '
                    className={ classes.chip }
                    onClick={ () => this.pickTaskDeadline(15) }
                  />
                  <Chip
                    label=' daqui vinte dias '
                    className={ classes.chip }
                    onClick={ () => this.pickTaskDeadline(20) }
                  />
                  <Chip
                    label=' daqui um mês'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskDeadline(30) }
                  />
                </div>
                <form className={ classes.formPayment } action='POST'>
                  <FormControl fullWidth>
                    <FormattedMessage id='task.status.deadline.day.label' defaultMessage='Day'>,
                      { (msg) => (
                        <InputLabel htmlFor='adornment-amount'>{ msg }</InputLabel>
                      ) }
                    </FormattedMessage>
                    <FormattedMessage id='task.status.deadline.day.insert.label' defaultMessage='Choose a date'>,
                      { (msg) => (
                        <Input
                          id='adornment-date'
                          startAdornment={ <InputAdornment position='start'><DateIcon /></InputAdornment> }
                          placeholder={ msg }
                          type='date'
                          value={ `${MomentComponent(this.state.deadline).format('YYYY-MM-DD')}` || `${MomentComponent().format('YYYY-MM-DD')}` }
                          onChange={ this.handleInputChangeCalendar }
                        />
                      ) }
                    </FormattedMessage>
                  </FormControl>
                  <Button disabled={ !this.state.deadline } onClick={ this.handleDeadline } variant='raised' color='primary' className={ classes.btnPayment }>
                    { this.state.deadline
                      ? <FormattedMessage id='task.status.deadline.set.target' defaultMessage='set to target date to {date}' values={ {
                        date: MomentComponent(this.state.deadline).format('DD/MM/YYYY')
                      } } />
                      : <FormattedMessage id='task.deadline.button.save' defaultMessage='Save date' />
                    }
                  </Button>
                </form>
              </CardContent>
              <div className={ classes.controls } />
            </div>
          </Card>
        </Collapse>
      </div>
    )
  }
}

TaskDeadlineForm.propTypes = {
  updateTask: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool
}

export default TaskDeadlineForm
