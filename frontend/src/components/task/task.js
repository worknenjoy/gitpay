import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import MomentComponent from 'moment'
import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from './messages/task-messages'
import TaskTabs from './task-tabs'
import TaskHeader from './task-header'
import TaskAssignment from './task-assignment'
import TaskStatusIcons from './task-status-icons'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Avatar,
  Typography,
  Button,
  Tooltip,
  withStyles,
  Link
} from '@material-ui/core'

import {
  Redeem as RedeemIcon,
  AddBox as AddIcon,
  FilterList as FilterIcon,
  HowToReg as TrophyIcon,
  DateRange as DateIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  MonetizationOn as MonetizationOnIcon,
  PeopleOutlined
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
const taskCover = require('../../images/task-cover.png')
const inviteCover = require('../../images/funds.png')

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
  cardHeader: {
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      textAlign: 'center'
    }
  },
  cardAvatar: {
    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    }
  },
  cardButton: {
    maxWidth: 200,
    width: 150,
    font: 10,
    height: 40,
    maxHeight: 80,
    marginTop: 15,
    marginLeft: 10,
    [theme.breakpoints.only('sm')]: {
      maxWidth: 100,
      height: 70,
    }
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    backgroundColor: 'darkgray',
    color: 'white',
    boxShadow: 'none'
  },
  taskTitle: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }
  },
  deliveryDateSuggestion: {
    display: 'flex',
    paddingLeft: 5,
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  starterCheckbox: {
    [theme.breakpoints.down('xs')]: {
      paddingTop: '0px !important'
    }
  },
  pricesContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  },
  priceChip: { marginBottom: 10 },
  dateSuggestionBtn: {
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      marginTop: 4,
      marginLeft: 10
    }
  },
  taskCoverImg: {
    alignSelf: 'center',
    marginTop: 50,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  planContainer: {
    paddingTop: 10,
    paddingBottom: 25
  },
  planGrid: {
    margin: 0
  },
  planButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkIcon: {
    paddingRight: theme.spacing.unit,
    fontSize: 20
  },
  planIcon: {
    fontSize: 64,
    padding: 20
  },
  planFinalPrice: {
    paddingTop: theme.spacing.unit,
    fontSize: '2rem'
  },
  planGridItem: {
    width: 200,
    padding: theme.spacing.unit,
    margin: 0
  },
  planGridContent: {
    minHeight: theme.spacing.unit * 10,
    margin: 0,
    padding: 0
  },
  planBullets: {
    paddingLeft: theme.spacing.unit * 1,
    padding: 10
  },
  chip: {
    marginRight: theme.spacing.unit * 2
  }

})

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
      termsAgreed: false,
      priceConfirmed: false,
      orderPrice: 0,
      assignDialog: false,
      statusDialog: false,
      deleteDialog: false,
      termsDialog: false,
      paymentForm: false,
      deadlineForm: false,
      taskPaymentDialog: false,
      taskInviteDialog: false,
      taskFundingDialog: false,
      notification: {
        open: false,
        message: 'loading'
      },
      showSuggestAnotherDateField: false,
      charactersCount: 0,
      maxWidth: 'md',
      fundingInvite: {
        email: '',
        comment: ''
      }
    }
  }

  async componentWillMount () {
    const id = this.props.match.params.id
    const status = this.props.match.params.status
    const orderId = this.props.match.params.order_id
    let logged = false
    try {
      logged = await this.props.isLogged()
    }
    catch (e) {
      logged = false
    }

    await this.props.syncTask(id)
    await this.props.fetchTask(id)

    if (status) {
      if (id && logged && logged.user.id === this.props.task.data.userId) {
        await this.props.updateTask({ id, status })
      }
      else {
        this.props.addNotification('actions.task.status.forbidden')
        this.props.history.push(`/task/${id}`)
      }
    }

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
    if (this.props.history && this.props.history.location.pathname === `/task/${id}/status`) {
      if (logged) {
        if (this.props.task.data && (logged.user.id === this.props.task.data.userId)) {
          this.handleStatusDialog()
        }
        else {
          this.props.addNotification('actions.task.status.forbidden')
          this.props.history.push(`/task/${id}`)
        }
      }
      else {
        this.props.history.push({ pathname: '/login', state: { from: { pathname: `/task/${id}/status` } } })
      }
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

  handleAssignFundingDialogClose = () => {
    if (this.state.assignDialog) {
      this.setState({ assignDialog: false, currentPrice: 0, termsAgreed: false, priceConfirmed: false })
    }

    if (this.state.taskFundingDialog) {
      this.setState({ taskFundingDialog: false, fundingInvite: { email: '', comment: '' }, termsAgreed: false })
    }
  }

  handleAssignDialogOpen = () => {
    this.setState({ interestedSuggestedDate: null, showSuggestAnotherDateField: false, currentPrice: 0, interestedLearn: false, interestedComment: '', assignDialog: true })
  }

  handleTaskFundingDialogOpen = () => {
    this.setState({ interestedSuggestedDate: null, showSuggestAnotherDateField: false, currentPrice: 0, interestedLearn: false, interestedComment: '', taskFundingDialog: true })
  }

  handleStatusDialog = () => {
    const id = this.props.match.params.id
    if (this.props.history && this.props.history.location.pathname !== `/task/${id}/status`) {
      this.props.history.push(`/task/${id}/status`)
    }
    this.setState({ statusDialog: true })
  }

  handleStatusDialogClose = () => {
    const id = this.props.match.params.id
    this.props.history.push(`/task/${id}`)
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

  handleTermsDialog = () => {
    this.setState({ termsDialog: true })
  }

  handleTermsDialogClose = (agree) => {
    if (agree === true) {
      this.setState({ termsAgreed: true })
    }
    else if (agree === false) {
      this.setState({ termsAgreed: false })
    }
    this.setState({ termsDialog: false })
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
    this.setState({ assignDialog: false, termsAgreed: false })
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

  handleCheckboxTerms = (e) => this.setState({ termsAgreed: e.target.checked })

  handleCheckboxIwillDoFor = (e) => this.setState({ priceConfirmed: e.target.checked })

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

  renderIssueAuthorLink = () => {
    if (this.props.task.data.metadata && this.props.task.data.metadata.issue.user.html_url) {
      return (
        <Link
          href={ `${this.props.task.data.metadata.issue.user.html_url}` }
          target='_blank'>
          <FormattedMessage id='task.status.created.name.short' defaultMessage='by {name}' values={ {
            name: this.props.task.data.metadata ? this.props.task.data.metadata.issue.user.login : 'unknown'
          } } />
        </Link>
      )
    }
    else {
      return (
        <FormattedMessage id='task.status.created.name.short' defaultMessage='by {name}' values={ {
          name: this.props.task.data.metadata ? this.props.task.data.metadata.issue.user.login : 'unknown'
        } } />
      )
    }
  }

  handleFundingEmailInputChange = event => {
    this.setState({ fundingInvite: { ...this.state.fundingInvite, email: event.target.value } })
  }

  handleFundingInputMessageChange = event => {
    this.setState({ fundingInvite: { ...this.state.fundingInvite, comment: event.target.value }, charactersCount: event.target.value.length })
  }

  sendFundingInvite = (e) => {
    e.preventDefault()
    this.props.fundingInviteTask(this.props.task.data.id, this.state.fundingInvite.email, this.state.fundingInvite.comment, this.state.currentPrice, this.state.interestedSuggestedDate, this.props.user)
    this.handleAssignFundingDialogClose()
  }
  rendereAmountStatsCardContent = (isOwner) => {
    return (
      <React.Fragment>
        <div>
          { this.props.task.values.available === 0 ? this.props.intl.formatMessage(messages.taskValueLabelNoBounty) : `$ ${this.props.task.values.available}` }
        </div>
        { this.props.task.values.available === 0 &&
          <Button
            onClick={ this.handlePaymentForm }
            size='small'
            color='primary'
            variant='raised'
            className={ this.props.classes.cardButton }
          >
            <span className={ this.props.classes.spaceRight }>
              <FormattedMessage id='task.bounties.add' defaultMessage='Add bounty' />
            </span>{ ' ' }
            <RedeemIcon />
          </Button>
        }
        { !isOwner &&
          <Button
            onClick={ this.handleAssignDialogOpen }
            size='small'
            color='primary'
            variant='raised'
            className={ this.props.classes.cardButton }
          >
            <span className={ this.props.classes.spaceRight }>
              <FormattedMessage id='this.props.ask.interested.offer' defaultMessage='Make an offer' />
            </span>{ ' ' }
            <MonetizationOnIcon />
          </Button>
        }
      </React.Fragment>
    )
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

    // const updatedAtTimeString = task.data.metadata ? MomentComponent(task.data.metadata.issue.updated_at).utc().format('hh:mm A') : 'not available'
    const updatedAtTimeString = task.data.metadata ? MomentComponent(task.data.metadata.issue.updated_at).utc().fromNow() : 'not available'
    const timePlaceholder = (
      <Typography type='subheading' variant='caption' style={ { padding: 10, color: 'gray', marginRight: 10 } }>
        <FormattedMessage id='task.bounties.interested.created' defaultMessage='created' /> { updatedAtTimeString }
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
                <Button
                  style={ { marginRight: 10 } }
                  onClick={ this.handleTaskFundingDialogOpen }
                  size='medium'
                  color='primary'
                  className={ classes.altButton }
                >
                  <span className={ classes.spaceRight }>
                    <FormattedMessage id='task.funding.action' defaultMessage='Invite sponsor' />
                  </span>{ ' ' }
                  <PeopleOutlined />
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
                  user={ this.props.user }
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
                <TaskAssignment
                  taskFundingDialog={ this.state.taskFundingDialog }
                  assignDialog={ this.state.assignDialog }
                  handleAssignFundingDialogClose={ this.handleAssignFundingDialogClose }
                  renderIssueAuthorLink={ this.renderIssueAuthorLink }
                  timePlaceholder={ timePlaceholder }
                  deadline={ deadline }
                  deliveryDate={ deliveryDate }
                  handleSuggestAnotherDate={ this.handleSuggestAnotherDate }
                  showSuggestAnotherDateField={ this.state.showSuggestAnotherDateField }
                  interestedSuggestedDate={ this.state.interestedSuggestedDate }
                  handleInputChangeCalendar={ this.handleInputChangeCalendar }
                  currentPrice={ this.state.currentPrice }
                  interestedComment={ this.state.interestedComment }
                  handleInputInterestedCommentChange={ this.handleInputInterestedCommentChange }
                  handleInputInterestedAmountChange={ this.handleInputInterestedAmountChange }
                  pickTaskPrice={ this.pickTaskPrice }
                  priceConfirmed={ this.state.priceConfirmed }
                  handleCheckboxIwillDoFor={ this.handleCheckboxIwillDoFor }
                  charactersCount={ this.state.charactersCount }
                  interestedLearn={ this.state.interestedLearn }
                  handleCheckboxLearn={ this.handleCheckboxLearn }
                  termsAgreed={ this.state.termsAgreed }
                  handleCheckboxTerms={ this.handleCheckboxTerms }
                  handleTermsDialog={ this.handleTermsDialog }
                  termsDialog={ this.state.termsDialog }
                  handleTermsDialogClose={ this.handleTermsDialogClose }
                  handleAssignTask={ this.handleAssignTask }
                  logged={ this.props.logged }
                  task={ task }
                  classes={ classes }
                  fundingInvite={ this.state.fundingInvite }
                  handleFundingEmailInputChange={ this.handleFundingEmailInputChange }
                  handleFundingInputMessageChange={ this.handleFundingInputMessageChange }
                  sendFundingInvite={ this.sendFundingInvite }
                  inviteCover={ inviteCover }
                  taskCover={ taskCover }
                  location={ this.props.location }
                />
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
              <TaskStatusIcons status={ 'public' } bounty />
              { (task.data.level || taskOwner()) &&
                <TaskLevel id={ this.props.match.params.id } level={ task.data.level } readOnly={ !taskOwner() } onSelect={ this.props.updateTask } />
              }
              <StatsCard
                icon={ TrophyIcon }
                iconColor='green'
                title={ this.props.intl.formatMessage(messages.taskValueLabel) }
                description={ this.rendereAmountStatsCardContent(taskOwner()) }
                statIcon={ CalendarIcon }
                statText={ this.props.intl.formatMessage(messages.taskValuesStatus, {
                  approved: task.values.available,
                  pending: task.values.pending,
                  failed: task.values.failed
                }) }
              />
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
  inviteTask: PropTypes.func,
  fundingInviteTask: PropTypes.func
}

export default injectIntl(withStyles(styles)(Task))
