import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import MomentComponent from 'moment'
import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from './messages/task-messages'
import TaskTabs from './task-tabs'
import TaskHeader from './task-header'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Avatar,
  Card,
  CardHeader,
  Typography,
  Button,
  Tooltip,
  Chip,
  withStyles,
  Paper,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Checkbox,
} from '@material-ui/core'

import {
  Redeem as RedeemIcon,
  AddBox as AddIcon,
  FilterList as FilterIcon,
  HowToReg as TrophyIcon,
  DateRange as DateIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  MonetizationOn as MonetizationOnIcon
} from '@material-ui/icons'

import StatusDialog from './status-dialog'
import TaskPayment from './task-payment'
import TaskPaymentForm from './task-payment-form'
import TaskDeadlineForm from './task-deadline-form'

import StatsCard from '../Cards/StatsCard'
import classNames from 'classnames'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'
import LoginButton from '../session/login-button'

import Constants from '../../consts'

import { PageContent } from 'app/styleguide/components/Page'

import TaskAssigned from './task-assigned'
import TaskInvite from './task-invite'
import TaskLabels from './task-labels'
import TaskLevel from './task-level'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  rootTabs: {
    backgroundColor: theme.palette.text.secondary
  },
  formPayment: {
    marginTop: 10,
    marginBottom: 10
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12
  },
  chip: {
    marginRight: 10,
    marginBottom: 20
  },
  chipStatus: {
    marginLeft: 20,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  chipStatusPaid: {
    marginLeft: 0,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  typo: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -30,
    paddingTop: 10,
    paddingBottom: 20
  },
  typoSmall: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
    paddingTop: 10,
    paddingBottom: 20,
    borderTop: '1px solid #999'
  },
  typoEmpty: {
    marginTop: 40,
    marginBottom: 5,
    padding: 10,
    fontSize: 32
  },
  gridBlock: {
    paddingLeft: 20,
    paddingRight: 20
  },
  spaceRight: {
    marginRight: 10
  },
  altButton: {
    margin: 0,
    border: `1px dashed ${theme.palette.primary.main}`
  },
  btnPayment: {
    float: 'right',
    marginTop: 10,
    color: 'white'
  },
  avatar: {
    width: 40,
    height: 40,
    border: `4px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.down('sm')]: {
      margin: 'auto',
      display: 'block',
      marginBottom: 5
    },
  },
  bigAvatar: {
    width: 180,
    height: 180
  },
  smallAvatar: {
    width: 32,
    height: 32
  },
  parentCard: {
    marginTop: 40,
    marginLeft: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  otherCard: {
    maxWidth: 280,
    marginRight: 10,
    marginBottom: 40,
    textAlign: 'center'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  },
  media: {
    width: 60,
    height: 60,
    marginLeft: 0,
    marginTop: 0
  },
  menuContainer: {
    marginBottom: 40,
    marginRight: 20,
    marginLeft: 20,
    width: '100%'
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  icon: {},
  card: {
    display: 'flex',
    marginBottom: 20
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 44,
    height: 44,
    margin: 20,
    padding: 20,
    textAlign: 'center',
    verticalAlign: 'center'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  },
  light: {
    color: 'white'
  },
  button: {
    width: 100,
    font: 10
  },
  spanText: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  iconCenter: {
    verticalAlign: 'middle',
    paddingRight: 5
  },
  textCenter: {
    textAlign: 'center'
  },
  banner: {
    width: '100%',
    height: 'auto',
    maxHeight: 300
  },
  containerButtonClose: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  buttonClose: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1.7,
    textAlign: 'center',
    borderRadius: 300,
    padding: 5,
    height: 32,
    width: 32,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    color: '#fff'
  },
  applyOnly: {
    fontSize: 21,
    textAlign: 'center',
    width: '30%',
    margin: '0 auto',
    marginBottom: 15,
    color: '#9E9E9E'
  },
  title: {
    fontSize: '2.2rem'
  }
})

const messages = defineMessages({
  openStatus: {
    id: 'task.status.status.payment.open',
    defaultMessage: 'Open'
  },
  succeededStatus: {
    id: 'task.status.filter.payment.succeeded',
    defaultMessage: 'Successfull payment'
  },
  failStatus: {
    id: 'task.status.filter.payment.failed',
    defaultMessage: 'Payment failed'
  },
  noUserFound: {
    id: 'task.user.find.none',
    defaultMessage: 'User not registered'
  },
  labelYes: {
    id: 'task.order.paid.yes',
    defaultMessage: 'Yes'
  },
  labelNo: {
    id: 'task.order.paid.no',
    defaultMessage: 'No'
  },
  inputComment: {
    paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 30,
    },
  },
  cardHeader: {
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      textAlign: 'center'
    }
  }
})
const bannerInterested = require('../../images/banner_task_interested.png')

class Task extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deadline: null,
      assigned: null,
      finalPrice: 0,
      currentPrice: 0,
      interestedComment: '',
      interestedLearn: false,
      orderPrice: 0,
      assignDialog: false,
      statusDialog: false,
      deleteDialog: false,
      paymentForm: false,
      deadlineForm: false,
      taskPaymentDialog: false,
      taskInviteDialog: false,
      notification: {
        open: false,
        message: 'loading'
      },
      showSuggestAnotherDateField: false,
      charactersCount: 0,
      maxWidth: 'md'
    }
  }

  componentWillMount () {
    const id = this.props.match.params.id
    const orderId = this.props.match.params.order_id
    this.props.syncTask(id)
    this.props.fetchTask(id)

    if (this.props.history && this.props.history.location.pathname === `/task/${id}/orders`) {
      this.props.changeTab(1)
    }
    if (this.props.history && orderId && this.props.history.location.pathname === `/task/${id}/orders/${orderId}`) {
      this.props.changeTab(1)
    }
    if (this.props.history && this.props.history.location.pathname === `/task/${id}/interested`) {
      this.props.changeTab(2)
    }
    if (this.props.history && this.props.history.location.pathname === `/task/${id}/members`) {
      this.props.changeTab(3)
    }
    if (this.props.history && this.props.history.location.pathname === `/task/${id}/offers`) {
      this.props.changeTab(4)
    }
    if (this.props.history && this.props.history.location.pathname === `/task/${id}/history`) {
      this.props.changeTab(5)
    }
  }

  handleTabChange = (event, tab) => {
    const id = this.props.match.params.id
    if (tab === 0) this.props.history.push(`/task/${id}`)
    if (tab === 1) this.props.history.push(`/task/${id}/orders`)
    if (tab === 2) this.props.history.push(`/task/${id}/interested`)
    if (tab === 3) this.props.history.push(`/task/${id}/members`)
    if (tab === 4) this.props.history.push(`/task/${id}/offers`)
    if (tab === 5) this.props.history.push(`/task/${id}/history`)
    this.props.changeTab(tab)
  }

  handleAssignDialogClose = () => {
    this.setState({ assignDialog: false })
  }

  handleAssignDialogOpen = () => {
    this.setState({ interestedSuggestedDate: null, showSuggestAnotherDateField: false, currentPrice: 0, interestedLearn: false, interestedComment: '', assignDialog: true })
  }

  handleStatusDialog = () => {
    this.setState({ statusDialog: true })
  }

  handleStatusDialogClose = () => {
    this.setState({ statusDialog: false })
  }

  handleDeleteDialog = () => {
    this.setState({ deleteDialog: true })
  }

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialog: false })
  }

  handleTaskPaymentDialog = () => {
    this.setState({ taskPaymentDialog: true })
  }

  handleTaskPaymentDialogClose = () => {
    this.setState({ taskPaymentDialog: false })
  }

  handleAssignTask = () => {
    this.props.updateTask({
      id: this.props.match.params.id,
      Assigns: [
        {
          userId: this.props.user.id
        }
      ],
      Offers: [
        {
          userId: this.props.user.id,
          suggestedDate: this.state.interestedSuggestedDate,
          value: this.state.currentPrice,
          learn: this.state.interestedLearn,
          comment: this.state.interestedComment
        }
      ]
    })
    this.setState({ assignDialog: false })
  }

  handleDeleteTask = () => {
    this.props.deleteTask({
      id: this.props.match.params.id,
      userId: this.props.user.id
    }).then(response => {
      this.props.history.push('/tasks/all')
      this.setState({ deleteDialog: false })
    }).catch(e => {
      // eslint-disable-next-line no-console
      console.log(e)
    })
  }

  handlePaymentForm = (e) => {
    e.preventDefault()
    this.state.paymentForm ? this.setState({ paymentForm: false }) : this.setState({ paymentForm: true })
  }

  handleDeadlineForm = (e) => {
    e.preventDefault()
    this.state.deadlineForm ? this.setState({ deadlineForm: false }) : this.setState({ deadlineForm: true })
  }

  handleInvite = () => {
    this.setState({ taskInviteDialog: true })
  }

  handleInputInterestedCommentChange = (e) => {
    this.setState({ interestedComment: e.target.value, charactersCount: e.target.value.length })
  }

  handleInputInterestedAmountChange = (e) => {
    this.setState({ currentPrice: parseFloat(e.target.value) })
    if (e.target.value !== 0) {
      this.setState({ interestedLearn: false })
    }
  }

  handleCheckboxLearn = (e) => {
    let learn = !this.state.interestedLearn
    this.setState({ interestedLearn: learn })
    if (learn) {
      this.setState({ currentPrice: 0 })
    }
  }

  handleCheckboxLeaveItFor = (e) => {
    if (this.state.currentPrice !== 0) {
      this.setState({ currentPrice: 0 })
    }
  }

  handleSuggestAnotherDate = (e) => {
    this.setState({ showSuggestAnotherDateField: !this.state.showSuggestAnotherDateField })
  }

  handleInputChangeCalendar = (e) => {
    this.setState({ interestedSuggestedDate: e.target.value })
  }

  pickTaskPrice = (price) => {
    this.setState({
      currentPrice: price,
      finalPrice: parseInt(price) + parseInt(this.state.orderPrice),
      interestedLearn: false
    })
  }

  goToProjectRepo = (url) => {
    window.open(url, '_blank')
  }

  render () {
    const { classes, task, order } = this.props

    const taskOwner = () => {
      const creator = this.props.logged && this.props.user.id === task.data.userId
      const owner = (task.data.members && task.data.members.length) ? task.data.members.filter(m => m.User.id === this.props.user.id).length > 0 : false
      return creator || owner
    }

    const isCurrentUserAssigned = () => {
      return task.data && task.data.assignedUser && task.data.assignedUser.id === this.props.user.id
    }

    const isAssignOwner = () => {
      return taskOwner() || isCurrentUserAssigned()
    }

    const updatedAtTimeString = task.data.metadata ? MomentComponent(task.data.metadata.issue.updated_at).utc().format('hh:mm A') : 'not available'
    const timePlaceholder = (
      <Typography type='subheading' style={ { padding: 10, color: 'gray', marginRight: 10 } }>
        { updatedAtTimeString }
      </Typography>
    )

    const deliveryDate = task.data.deadline !== null ? MomentComponent(task.data.deadline).utc().format('DD-MM-YYYY') : this.props.intl.formatMessage(messages.deliveryDateNotInformed)
    const deadline = task.data.deadline !== null ? MomentComponent(task.data.deadline).diff(MomentComponent(), 'days') : false

    return (
      <div>
        <TopBarContainer />
        <PageContent>
          <TaskHeader taskPaymentDialog={ this.taskPaymentDialog } task={ task } />
          <Grid
            container
            justify='flex-start'
            direction='row'
            spacing={ 24 }
          >
            <Grid
              item
              sm={ 12 }
              xs={ 12 }
              style={ {
                display: 'flex',
                alignItems: 'center',
                marginTop: 12,
                position: 'relative'
              } }
            >
              { task.data.metadata ? (
                <div style={ { position: 'absolute', left: 18, top: 5 } }>
                  <Typography color='default'>
                    <FormattedMessage id='task.status.author.label' defaultMessage='Author' />
                  </Typography>
                </div>
              ) : (
                <div style={ { position: 'absolute', left: 18, top: 5 } }>
                  <Typography color='default'>
                    <FormattedMessage id='task.status.author.missing' defaultMessage='author info unknown' />
                  </Typography>
                </div>
              ) }
              { task.data.metadata &&
              <FormattedMessage id='task.status.created.name' defaultMessage='Created by {name}' values={ {
                name: task.data.metadata.issue.user.login
              } }>
                { (msg) => (
                  <Tooltip
                    id='tooltip-github'
                    title={ msg }
                    placement='bottom'
                  >
                    <a
                      href={ `${task.data.metadata.issue.user.html_url}` }
                      target='_blank'
                    >
                      <Avatar
                        src={ task.data.metadata.issue.user.avatar_url }
                        className={ classNames(classes.avatar) }
                      />
                    </a>
                  </Tooltip>
                ) }
              </FormattedMessage>
              }
              <div className={ classes.paper }>
                <Button
                  style={ { marginRight: 10 } }
                  onClick={ this.handlePaymentForm }
                  size='small'
                  color='primary'
                  className={ classes.altButton }
                >
                  <span className={ classes.spaceRight }>
                    <FormattedMessage id='task.bounties.add' defaultMessage='Add bounty' />
                  </span>{ ' ' }
                  <RedeemIcon />
                </Button>
                <Button
                  style={ { marginRight: 10 } }
                  onClick={ this.handleInvite }
                  size='small'
                  color='primary'
                  className={ classes.altButton }
                >
                  <span className={ classes.spaceRight }>
                    <FormattedMessage id='task.bounties.invite' defaultMessage='Invite' />
                  </span>
                  <AddIcon />
                </Button>
                { !taskOwner() &&
                  <Button
                    style={ { marginRight: 10 } }
                    onClick={ this.handleAssignDialogOpen }
                    size='medium'
                    color='primary'
                    className={ classes.altButton }
                  >
                    <span className={ classes.spaceRight }>
                      <FormattedMessage id='task.interested.action' defaultMessage='Im interested' />
                    </span>{ ' ' }
                    <AddIcon />
                  </Button>
                }
                { taskOwner() && (
                  <div style={ { display: 'inline-block' } }>
                    <Button
                      style={ { marginRight: 10 } }
                      onClick={ this.handleDeadlineForm }
                      size='small'
                      color='primary'
                      className={ classes.altButton }
                    >
                      <span className={ classes.spaceRight }>
                        <FormattedMessage id='task.bounties.date.deadline' defaultMessage='Deadline' />
                      </span>
                      <DateIcon />
                    </Button>
                    <Button
                      style={ { marginRight: 10 } }
                      onClick={ this.handleStatusDialog }
                      size='small'
                      color='primary'
                      className={ classes.altButton }
                    >
                      <span className={ classes.spaceRight }>
                        <FormattedMessage id='task.bounties.status.change' defaultMessage='Change status' />
                      </span>
                      <FilterIcon />
                    </Button>
                    <Button
                      style={ { marginRight: 10 } }
                      onClick={ this.handleDeleteDialog }
                      size='small'
                      color='primary'
                      className={ classes.altButton }
                    >
                      <span className={ classes.spaceRight }>
                        <FormattedMessage id='task.actions.delete' defaultMessage='Delete' />
                      </span>
                      <DeleteIcon />
                    </Button>
                    <Button
                      onClick={ this.handleTaskPaymentDialog }
                      size='small'
                      color='primary'
                      className={ classes.altButton }
                    >
                      <span className={ classes.spaceRight }>
                        <FormattedMessage id='task.bounties.send.label' defaultMessage='Send bounty' />
                      </span>
                      <RedeemIcon />
                    </Button>
                    <StatusDialog
                      id={ task.data.id }
                      providerStatus={ task.data.metadata ? task.data.metadata.issue.state : 'unknown' }
                      provider={ task.data.provider }
                      onSelect={ this.props.updateTask }
                      selectedValue={ task.data.status }
                      open={ this.state.statusDialog }
                      onClose={ this.handleStatusDialogClose }
                    />
                    <TaskPayment
                      id={ task.data.id }
                      values={ task.values }
                      paid={ task.data.paid }
                      transferId={ task.data.transfer_id }
                      assigned={ task.data.assigned }
                      assigns={ task.data.assigns }
                      orders={ task.data.orders }
                      order={ order.data }
                      open={ this.state.taskPaymentDialog }
                      onClose={ this.handleTaskPaymentDialogClose }
                      onPayTask={ this.props.paymentTask }
                      filterTaskOrders={ this.props.filterTaskOrders }
                      onPayOrder={ this.props.paymentOrder }
                    />
                  </div>
                ) }
                <TaskInvite
                  id={ task.data.id }
                  onInvite={ this.props.inviteTask }
                  visible={ this.state.taskInviteDialog }
                  onClose={ () => this.setState({ taskInviteDialog: false }) }
                  onOpen={ () => this.setState({ taskInviteDialog: true }) }
                />
                <Dialog
                  open={ this.state.deleteDialog }
                  onClose={ this.handleDeleteDialogClose }
                  aria-labelledby='form-dialog-title'
                >
                  { !this.props.logged ? (
                    <div>
                      <DialogTitle id='form-dialog-title'>
                        <FormattedMessage id='task.bounties.logged.info' defaultMessage='You need to login to be assigned to this task' />
                      </DialogTitle>
                      <DialogContent>
                        <div className={ classes.mainBlock }>
                          <LoginButton referer={ this.props.location } includeForm />
                        </div>
                      </DialogContent>
                    </div>
                  ) : (
                    <div>
                      <DialogTitle id='form-dialog-title'>
                        <FormattedMessage id='task.bounties.delete.confirmation' defaultMessage='Are you sure you want to delete this issue?' />
                      </DialogTitle>
                      <DialogContent>
                        <Typography type='caption'>
                          <FormattedMessage id='task.bounties.delete.caution' defaultMessage='If you delete this issue, all the records related about orders and payments will be lost' />
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={ this.handleDeleteDialogClose } color='primary'>
                          <FormattedMessage id='task.actions.cancel' defaultMessage='Cancel' />
                        </Button>
                        <Button onClick={ this.handleDeleteTask } variant='raised' color='secondary' >
                          <FormattedMessage id='task.actions.delete' defaultMessage='Delete' />
                        </Button>
                      </DialogActions>
                    </div>
                  ) }
                </Dialog>
                <Dialog
                  open={ this.state.assignDialog }
                  onClose={ this.handleAssignDialogClose }
                  aria-labelledby='form-dialog-title'
                  maxWidth='md'
                >
                  { !this.props.logged ? (
                    <div>
                      <DialogTitle id='form-dialog-title'>
                        <FormattedMessage id='task.bounties.logged.info' defaultMessage='You need to login to be assigned to this task' />
                      </DialogTitle>
                      <DialogContent>
                        <div className={ classes.mainBlock }>
                          <LoginButton referer={ this.props.location } includeForm />
                        </div>
                      </DialogContent>
                    </div>
                  ) : (
                    // dialog i'm interested
                    <div>
                <div className={ classes.containerButtonClose }>
                  <div className={classes.buttonClose}>X</div>
                </div>

                <div>
                  <img className={ classes.banner } src={ bannerInterested } alt="banner interested task" />
                </div>
                      <DialogTitle id='form-dialog-title' className={classes.textCenter}>
                        <FormattedMessage id='task.bounties.interested.question' defaultMessage='Are you interested solve this task?' />
                      </DialogTitle>
                      <DialogContent>
                        <div className={classes.applyOnly}>
                          Please apply only if you're able to do it if you're
                          available and commited to finish in the deadline
                        </div>
                          {task.data.metadata &&
                            <Card>
                              <CardHeader
                                className={classes.cardHeader}
                                avatar={
                                  <FormattedMessage id='task.status.created.name' defaultMessage='Created by {name}' values={{
                                    name: task.data.metadata ? task.data.metadata.issue.user.login : 'unknown'
                                  }}>
                                    {(msg) => (

                                      <Tooltip
                                        id='tooltip-github'
                                        title={msg}
                                        placement='bottom'
                                      >
                                        <a
                                          href={`${task.data.metadata.issue.user.html_url}`}
                                          target='_blank'
                                        >
                                          <Avatar
                                            src={task.data.metadata.issue.user.avatar_url}
                                            className={classNames(classes.avatar)}
                                          />
                                        </a>
                                      </Tooltip>
                                    )}
                                  </FormattedMessage>
                                }
                                title={task.data.title}
                                subheader={
                                  <FormattedMessage id='task.status.created.name.short' defaultMessage='by {name}' values={{
                                    name: task.data.metadata ? task.data.metadata.issue.user.login : 'unknown'
                                  }} />
                                }
                                action={
                                  timePlaceholder
                                }
                              />
                            </Card>
                          }
                        <div style={ { paddingBottom: 10 } }>
                          <Typography type='subheading' gutterBottom style={ { paddingTop: 20, color: 'gray' } }>
                            <InfoIcon className={ classes.iconCenter } style={ { color: '#C5C5C5' } } />
                            <FormattedMessage id='task.bounties.interested.descritpion' defaultMessage='You may be assigned to this task and receive your bounty when your code is merged'>
                              { (msg) => (
                                <span className={ classes.spanText }>
                                  { msg }
                                </span>
                              ) }
                            </FormattedMessage>
                          </Typography>
                        </div>
                        <Paper style={ { background: '#F7F7F7', borderColor: '#F0F0F0', borderWidth: 1, borderStyle: 'solid', boxShadow: 'none', padding: 10 } }>
                          <div style={ { padding: 5, color: 'gray' } }>
                            <Typography type='caption' gutterBottom style={ { color: 'gray' } }>
                              <Grid item sm={ 12 } xs={ 12 } style={ { display: 'flex' } }>
                                <WarningIcon className={ classes.iconCenter } style={ { color: '#D7472F' } } />
                                <FormattedMessage id='task.bounties.interested.warningMessage' defaultMessage='Please just send your interested if you will be able to do it and finish on time'>
                                  { (msg) => (
                                    <span className={ classes.spanText }>
                                      { msg }
                                    </span>
                                  ) }
                                </FormattedMessage>
                              </Grid>
                            </Typography>
                          </div>
                          <div style={ { padding: 5, color: 'gray' } }>
                            <Typography type='caption' gutterBottom style={ { color: 'gray' } }>
                              <CalendarIcon className={ classes.iconCenter } />
                              <span className={ classes.spanText }>
                                <FormattedHTMLMessage id='task.bounties.interested.deliveryDate' defaultMessage='Delivery date at {deliveryDate}' values={ { deliveryDate: deliveryDate } } />
                                { deadline
                                  ? <FormattedHTMLMessage id='task.bounties.interested.deadline' defaultMessage=' (in {deadline} days)' values={ { deadline: deadline } } />
                                  : null }
                              </span>
                              <Button onClick={ this.handleSuggestAnotherDate } color='primary'>
                                <FormattedMessage id='task.bounties.actions.sugggestAnotherDate' defaultMessage='SUGGEST ANOTHER DATE' />&nbsp;
                                <InfoIcon className={ classes.iconCenter } style={ { color: 'darkgray' } } />
                              </Button>
                            </Typography>
                          </div>
                          { this.state.showSuggestAnotherDateField && (
                            <FormControl fullWidth>
                              <FormattedMessage id='task.status.deadline.day.label' defaultMessage='Day'>
                                { (msg) => (
                                  <InputLabel htmlFor='interested-date' shrink='true'>{ msg }</InputLabel>
                                ) }
                              </FormattedMessage>
                              <FormattedMessage id='task.status.deadline.day.insert.label' defaultMessage='Choose a date'>
                                { (msg) => (
                                  <Input
                                    id='interested-date'
                                    startAdornment={ <InputAdornment position='start'><DateIcon /></InputAdornment> }
                                    placeholder={ msg }
                                    type='date'
                                    value={ `${MomentComponent(this.state.interestedSuggestedDate).format('YYYY-MM-DD')}` || `${MomentComponent().format('YYYY-MM-DD')}` }
                                    onChange={ this.handleInputChangeCalendar }
                                  />
                                ) }
                              </FormattedMessage>
                            </FormControl>
                          ) }
                        </Paper>

                        <Typography type='heading' gutterBottom style={ { paddingTop: 10 } }>
                          <FormattedMessage id='task.bounties.interested.canSuggestBounty' defaultMessage='You can suggest a bounty' />
                        </Typography>

                        <div className={ classes.chipContainer }>
                          <Chip
                            label=' $ 20'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(20) }
                          />
                          <Chip
                            label=' $ 50'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(50) }
                          />
                          <Chip
                            label=' $ 100'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(100) }
                          />
                          <Chip
                            label=' $ 150'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(150) }
                          />
                          <Chip
                            label=' $ 300'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(300) }
                          />
                        </div>

                        <FormControl fullWidth>
                          <InputLabel htmlFor='interested-amount' style={{ paddingLeft: 10 }}>
                            <FormattedMessage id='task.bounties.interested.amount.value' defaultMessage='Price' />
                          </InputLabel>
                          <FormattedMessage id='task.bounties.interested.input.amount' defaultMessage='Price insert a value for this task' >
                            { (msg) => (
                              <Input
                                id='interested-amount'
                                startAdornment={ <InputAdornment position='start'>$</InputAdornment> }
                                placeholder={ msg }
                                type='number'
                                inputProps={ { 'min': 0 } }
                                value={ this.state.currentPrice }
                                onChange={ this.handleInputInterestedAmountChange }
                              />
                            ) }
                          </FormattedMessage>
                        </FormControl>

                        <Grid container spacing={ 24 } style={ { fontFamily: 'Roboto', marginBottom: '20px', color: '#a9a9a9' } }>
                          <Grid item xs={ 12 } sm={ 6 }>
                            <Checkbox
                              color='primary'
                              checked={ this.state.currentPrice === 0 && !this.state.interestedLearn ? 'checked' : '' }
                              onChange={ this.handleCheckboxLeaveItFor } />
                              <FormattedMessage
                                id='task.bounties.interested.leaveItFor'
                                defaultMessage='Or leave it for'
                              />&nbsp;
                            <Chip
                              label={ `$ ${task.values.available}` }
                              className={ classes.chip }
                              onClick={ () => this.pickTaskPrice(0) }
                            />
                          </Grid>
                          <Grid item xs={ 12 } sm={ 6 }>
                            <Checkbox
                              color='primary'
                              checked={ this.state.interestedLearn ? 'checked' : '' }
                              onChange={ this.handleCheckboxLearn } />
                              <FormattedMessage
                                id='task.bounties.interested.iAmStarter'
                                defaultMessage="Or I'm starter and I just want to gain experience"
                              />
                          </Grid>
                        </Grid>
                        <FormControl fullWidth>
                          <InputLabel htmlFor='interested-comment'>
                            <FormattedMessage id='task.bounties.interested.comment.value' defaultMessage='You can leave a comment' />
                          </InputLabel>

                          <FormattedMessage id='task.bounties.interested.input.comment' defaultMessage='I really would like to explore my Node.js experience on this' >
                            { (msg) => (
                              <Input
                                id='interested-comment'
                                placeholder={ msg }
                                type='text'
                                inputProps={ { maxLength: '120' } }
                                className={ classes.inputComment }
                                value={ this.state.interestedComment }
                                onChange={ this.handleInputInterestedCommentChange }
                              />
                            ) }
                          </FormattedMessage>
                          <small style={ { fontFamily: 'Roboto', color: '#a9a9a9', marginTop: '10px', textAlign: 'right' } }>{ this.state.charactersCount + '/120' }</small>
                        </FormControl>

                      </DialogContent>
                      <DialogActions>
                        <Button onClick={ this.handleAssignDialogClose } color='primary'>
                          <FormattedMessage id='task.bounties.actions.cancel' defaultMessage='Cancel' />
                        </Button>
                        <Button onClick={ this.handleAssignTask } variant='raised' color='primary' >
                          <FormattedMessage id='task.bounties.actions.work' defaultMessage='I want to work on this task!' />
                        </Button>
                      </DialogActions>
                    </div>
                    //  end dialog i'm interested
                  ) }
                </Dialog>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 8 }>
              { task.data.assigned &&
                <TaskAssigned
                  task={ task.data }
                  isOwner={ isAssignOwner() }
                  status={ this.props.intl.formatMessage(Constants.STATUSES[task.data.status]) }
                  classes={ classes }
                  user={ task.data.assignedUser || {} }
                  removeAssignment={ this.props.removeAssignment }
                  assignTask={ this.props.assignTask }
                  assign={ { id: task.data.assigned } }
                />
              }
              <TaskPaymentForm { ...this.props } open={ this.state.paymentForm } />
              { taskOwner() &&
                <TaskDeadlineForm { ...this.props } open={ this.state.deadlineForm } />
              }
              <div className={ classes.rootTabs }>
                <TaskTabs
                  assignTask={ this.props.assignTask }
                  removeAssignment={ this.props.removeAssignment }
                  messageTask={ this.props.messageTask }
                  isAssignOwner={ isAssignOwner }
                  task={ task }
                  handleTabChange={ this.handleTabChange }
                  logged={ this.props.logged }
                  user={ this.props.user }
                  cancelPaypalPayment={ this.props.cancelPaypalPayment }
                  getOrderDetails={ this.props.getOrderDetails }
                  order={ this.props.order && this.props.order.data }
                  preloadOrder={ this.props.match.params.order_id }
                />
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 4 }>
              { (task.data.level || taskOwner()) &&
                <TaskLevel id={ this.props.match.params.id } level={ task.data.level } readOnly={ !taskOwner() } onSelect={ this.props.updateTask } />
              }
              <StatsCard
                icon={ TrophyIcon }
                iconColor='green'
                title={ this.props.intl.formatMessage(messages.taskValueLabel) }
                description={ `$ ${task.values.available}` }
                statIcon={ CalendarIcon }
                statText={ this.props.intl.formatMessage(messages.taskValuesStatus, {
                  approved: task.values.available,
                  pending: task.values.pending,
                  failed: task.values.failed
                }) }
              />
              { !taskOwner() &&
                <Button
                  style={ { marginTop: 5, marginBottom: 20, width: '100%' } }
                  onClick={ this.handleAssignDialogOpen }
                  size='large'
                  color='primary'
                  variant='raised'
                  className={ classes.button }
                >
                  <span className={ classes.spaceRight }>
                    <FormattedMessage id='task.interested.offer' defaultMessage='Make an offer' />
                  </span>{ ' ' }
                  <MonetizationOnIcon />
                </Button>
              }
              { MomentComponent(task.data.deadline).isValid() &&
                <StatsCard
                  icon={ DateIcon }
                  iconColor='green'
                  title={ this.props.intl.formatMessage(messages.taskLimitDate) }
                  description={ MomentComponent(task.data.deadline).utc().format('DD-MM-YYYY') }
                  statIcon={ DateIcon }
                  statText={ `${MomentComponent(task.data.deadline).fromNow()}` }
                />
              }
              { task.data.metadata &&
                <TaskLabels labels={ task.data.metadata.labels } />
              }
            </Grid>
          </Grid>
        </PageContent>
        <Bottom />
      </div>
    )
  }
}

Task.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchTask: PropTypes.func,
  dialog: PropTypes.object,
  addNotification: PropTypes.func,
  location: PropTypes.object,
  paymentTask: PropTypes.func,
  assignTask: PropTypes.func,
  task: PropTypes.object,
  logged: PropTypes.bool,
  user: PropTypes.object,
  match: PropTypes.object,
  changeTab: PropTypes.func,
  openDialog: PropTypes.func,
  updateTask: PropTypes.func,
  deleteTask: PropTypes.func,
  closeDialog: PropTypes.func,
  syncTask: PropTypes.func,
  removeAssignment: PropTypes.func,
  order: PropTypes.object,
  filterTaskOrders: PropTypes.func,
  paymentOrder: PropTypes.func,
  inviteTask: PropTypes.func
}

export default injectIntl(withStyles(styles)(Task))
