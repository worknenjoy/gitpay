import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import MomentComponent from 'moment'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import ShowMoreText from 'react-show-more-text'
import AssignActions from './assignment/AssignActions'

import { messages } from './messages/task-messages'
import RegularCard from '../Cards/RegularCard'
import Table from '../Table/Table'
import TaskHeader from './task-header'
import AuthorList from './task-author-list'
import queryString from 'query-string'
import renderHTML from 'react-render-html'
import marked from 'marked'

import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Typography,
  Button,
  withStyles,
  Link,
  DialogContentText,
  MobileStepper,
  Fab,
  Collapse,
  Tooltip
} from '@material-ui/core'

import {
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
  BugReport as BugReportIcon,
  EmojiFoodBeverage as CoffeeIcon,
  AttachMoney as MoneyIcon,
  CheckCircleOutline as CheckIcon,
  OfflineBolt as BountyIcon,
  Gavel as OfferIcon,
  Redeem as RedeemIcon,
  Delete as DeleteIcon,
  AssignmentInd as AssignmentIcon
} from '@material-ui/icons'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'

import { PageContent } from 'app/styleguide/components/Page'
import TaskReport from './task-report'
import TaskPayment from './task-payment'
import LoginButton from '../session/login-button'
import TaskAssignment from './task-assignment'
import TaskPaymentForm from './task-payment-form'
import TaskInterested from './task-interested'
import TaskAssigned from './task-assigned'

import Constants from '../../consts'

const taskCover = require('../../images/task-cover.png')
const inviteCover = require('../../images/funds.png')

const bounty = require('../../images/bounty.png')
const sharing = require('../../images/sharing.png')
const notifications = require('../../images/notifications.png')

const logoGithub = require('../../images/github-logo.png')

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
    paddingBottom: 20
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
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
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
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
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
    paddingRight: theme.spacing(1),
    fontSize: 20
  },
  planIcon: {
    fontSize: 64,
    padding: 20
  },
  planFinalPrice: {
    paddingTop: theme.spacing(1),
    fontSize: '2rem'
  },
  planGridItem: {
    width: '80%',
    padding: theme.spacing(1),
    margin: 10
  },
  planGridContent: {
    minHeight: theme.spacing(10),
    margin: 0,
    padding: 20
  },
  planBullets: {
    paddingLeft: theme.spacing(1),
    padding: 10
  },
  chip: {
    marginRight: theme.spacing(2)
  },
  taskInfoContent: {
    verticalAlign: 'super',
    marginLeft: 5,
    marginTop: 10,
    display: 'inline-block',
    textAlign: 'middle'
  }

})

class Task extends Component {
  constructor (props) {
    super(props)

    this.state = {
      logged: null,
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
      taskMessageAuthorDialog: false,
      assignIssueDialog: false,
      reportIssueDialog: false,
      taskClaimDialog: false,
      notification: {
        open: false,
        message: 'loading'
      },
      showSuggestAnotherDateField: false,
      charactersCount: 0,
      maxWidth: 'md',
      isFirstTask: false,
      firstTaskSteps: 0,
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
      this.setState({ logged })
    }
    catch (e) {
      logged = false
      this.setState({ logged })
    }

    try {
      await this.props.syncTask(id)
      await this.props.fetchTask(id)
    }
    catch (e) {

    }

    if (status) {
      if (id && logged && this.props.task.data.user && logged.user.id === this.props.task.data.user.id) {
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
      this.setState({ assignIssueDialog: true })
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
        if (this.props.task.data && this.props.task.data.user && (logged.user.id === this.props.task.data.user.id)) {
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

    if (this.props.history && this.props.history.location.pathname.startsWith(`/task/${id}/claim`)) {
      if (logged) {
        let params = queryString.parse(this.props.location.search)
        this.props.requestClaimTask(id, this.props.user.id, params.comments, true, params.token, this.props.history)
      }
    }
  }

  componentDidUpdate () {
    this.checkFirstTask()
  }

  checkFirstTask () {
    if (this.taskOwner()) {
      /* eslint-disable no-undef */
      const hadFirstTask = localStorage.getItem('hadFirstTask')
      if (!hadFirstTask) {
        this.setState({ isFirstTask: true })
        /* eslint-disable no-undef */
        localStorage.setItem('hadFirstTask', true)
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

  handleMessageAuthorDialog = () => {
    this.setState({ taskMessageAuthorDialog: true })
  }

  handleClaimDialog = () => {
    this.setState({ taskClaimDialog: true })
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

  handleOfferTask = () => {
    this.props.updateTask({
      id: this.props.match.params.id,
      Offer: {
        userId: this.props.user.id,
        suggestedDate: this.state.interestedSuggestedDate,
        value: this.state.currentPrice,
        learn: this.state.interestedLearn,
        comment: this.state.interestedComment
      }
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
    this.state.paymentForm ? this.setState({ paymentForm: false }) : this.setState({ paymentForm: true, deadlineForm: false })
  }

  handleDeadlineForm = (e) => {
    e.preventDefault()
    this.state.deadlineForm ? this.setState({ deadlineForm: false }) : this.setState({ deadlineForm: true, paymentForm: false })
  }

  handleInvite = () => {
    this.setState({ taskInviteDialog: true })
  }

  handleReportIssueDialog = () => {
    this.setState({ reportIssueDialog: true })
  }

  handleAssignDialog = () => {
    this.setState({ assignIssueDialog: true })
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

  handleFirstTaskBounties = () => {
    this.setState({
      isFirstTask: false,
      paymentForm: true
    })
  }

  handleFirstTaskNotifications = () => {
    this.setState({
      isFirstTask: false,
      deadlineForm: true
    })
  }

  handleFirstTaskContent = () => {
    const { firstTaskSteps } = this.state

    if (firstTaskSteps === 0) {
      return {
        image: bounty,
        title: <FormattedMessage id='first.task.bounties.title' defaultMessage='Add Bounties' />,
        description: (
          <div>
            <FormattedMessage id='first.task.bounties.description' defaultMessage='Add bounties to reward contributors to solve your issue' />
            <Button onClick={ this.handleFirstTaskBounties } color='primary' variant='contained' style={ { display: 'block', margin: '20px auto' } }>
              <FormattedMessage id='first.task.bounties.action' defaultMessage='Add bounties now' />
            </Button>
          </div>
        )
      }
    }

    if (firstTaskSteps === 1) {
      return {
        image: notifications,
        title: <FormattedMessage id='first.task.deadline.title' defaultMessage='Set a deadline' />,
        description: (
          <div>
            <FormattedMessage id='first.task.deadline.description' defaultMessage='Set a deadline in order to define when your issues should be solved' />
            <Button onClick={ this.handleFirstTaskNotifications } color='primary' variant='contained' style={ { display: 'block', margin: '20px auto' } }>
              <FormattedMessage id='first.task.deadline.action' defaultMessage='Set deadline' />
            </Button>
          </div>
        )
      }
    }

    if (firstTaskSteps === 2) {
      return {
        image: sharing,
        title: <FormattedMessage id='first.task.community.title' defaultMessage='Send to our community' />,
        description: <FormattedMessage id='first.task.community.description' defaultMessage='We will make a campaign to let our community know that you have an issue to be solved' />
      }
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
      <div style={ { display: 'flex', justifyContent: 'space-evenly' } }>
        <Button
          onClick={ this.handlePaymentForm }
          size='small'
          color='secondary'
          variant='contained'
          disabled={ this.props.task.data.paid }
          style={ { flexGrow: 1, display: 'flex', justifyContent: 'center' } }
        >
          <BountyIcon style={ { marginRight: 'auto' } } />
          <span style={ { marginRight: 'auto' } }>
            <FormattedMessage id='task.bounties.payment.add' defaultMessage='Make a payment' />
          </span>{ ' ' }
        </Button>

        { !isOwner &&
          <Button
            disabled={ this.props.task.data.paid }
            onClick={ this.handleAssignDialogOpen }
            size='small'
            color='secondary'
            variant='contained'
            style={ { flexGrow: 1, marginLeft: 10, display: 'flex', justifyContent: 'center' } }
          >
            <OfferIcon style={ { marginRight: 'auto' } } />
            <span style={ { marginRight: 'auto' } } className={ this.props.classes.spaceRight }>
              <FormattedMessage id='this.props.ask.interested.offer' defaultMessage='Make an offer' />
            </span>{ ' ' }
          </Button>
        }
      </div>
    )
  }

  taskOwner = () => {
    const { task } = this.props
    const creator = this.props.logged && task.data.User && this.props.user.id === task.data.User.id
    const owner = (task.data.members && task.data.members.length) ? task.data.members.filter(m => m.User.id === this.props.user.id).length > 0 : false
    return creator || owner
  }

  render () {
    const { classes, task, project, order } = this.props

    const assignActions = assign => {
      const task = this.props.task.data
      return <AssignActions hash={ this.props.hash } actionAssign={ this.props.actionAssign } loggedUser={ this.props.user } isOwner={ isAssignOwner() } assign={ assign } task={ task } removeAssignment={ this.props.removeAssignment } assignTask={ this.props.assignTask } messageTask={ this.props.messageTask } />
    }

    // Error handling when task does not exist
    if (task.completed && !task.values) {
      this.props.history.push('/404')
      return null
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

    const firstStepsContent = this.handleFirstTaskContent()

    const isAssignOwner = () => {
      return this.taskOwner() || isCurrentUserAssigned()
    }

    const isCurrentUserAssigned = () => {
      return task.data && task.data.assignedUser && task.data.assignedUser.id === this.props.user.id
    }

    const displayAssigns = assign => {
      if (!assign.length) {
        return []
      }

      const items = assign.map((item, i) => {
        const userField = () => (
          <span>
            { item.User && item.User.profile_url
              ? (
                <FormattedMessage id='task.user.check.github' defaultMessage='Check this profile at Github'>
                  { (msg) => (
                    <Tooltip id='tooltip-github' title={ msg } placement='bottom'>
                      <a target='_blank' href={ item.User.profile_url } style={ { display: 'flex', alignItems: 'center' } }>
                        <span>{ item.User.username || item.User.name || ' - ' }</span>
                        <img style={ { backgroundColor: 'black', marginLeft: 10 } } width={ 18 } src={ logoGithub } />
                      </a>
                    </Tooltip>
                  ) }
                </FormattedMessage>
              ) : (
                `${item.User.username || item.User.name || ' - '}`
              )
            }
          </span>
        )

        return [userField(), MomentComponent(item.updatedAt).fromNow(), assignActions(item)]
      })

      return items
    }

    return (
      <div>
        <Dialog
          open={ this.state.isFirstTask }
          maxWidth='xs'
          aria-labelledby='form-dialog-title'
        >
          <DialogContent>
            <div style={ { textAlign: 'center' } }>
              <img
                src={ firstStepsContent.image }
                style={ { margin: '20px auto 0' } }
                width='70%'
              />
              <DialogTitle style={ { marginTop: 20 } }>
                <Fab
                  size='small'
                  aria-label='close'
                  className={ classes.closeButton }
                  onClick={ () => this.setState({ isFirstTask: false }) }
                >
                  <CloseIcon />
                </Fab>

                <Typography variant='h4'>
                  { firstStepsContent.title }
                </Typography>
              </DialogTitle>
              <DialogContentText>
                { firstStepsContent.description }
              </DialogContentText>
            </div>
          </DialogContent>
          <MobileStepper
            variant='dots'
            steps={ 3 }
            position='static'
            activeStep={ this.state.firstTaskSteps }
            nextButton={
              <Button
                size='small'
                onClick={ () => this.setState((prevState) => ({ firstTaskSteps: prevState.firstTaskSteps + 1 })) }
                disabled={ this.state.firstTaskSteps === 2 }
              >
                <FormattedMessage id='first.task.next' defaultMessage='Next' />
              </Button>
            }
            backButton={
              <Button
                onClick={ () => this.setState((prevState) => ({ firstTaskSteps: prevState.firstTaskSteps - 1 })) }
                disabled={ this.state.firstTaskSteps === 0 }
                size='small'
              >
                <FormattedMessage id='first.task.back' defaultMessage='Back' />
              </Button>
            }
          />
        </Dialog>
        <TopBarContainer />
        <PageContent>
          <Grid container style={ { marginBottom: 4 } }>
            <Grid item xs={ 12 } sm={ 8 } style={ { marginBottom: 40, paddingRight: 80 } }>
              <TaskHeader taskPaymentDialog={ this.taskPaymentDialog } task={ task } user={ this.props.user } history={ this.props.history } project={ project } />
              { this.props.logged ? (
                <TaskPaymentForm { ...this.props } plan={ this.props.task.data.private ? 'private' : 'open source' } open={ this.state.paymentForm } />
              ) : (
                <Collapse in={ this.state.paymentForm }>
                  <div className={ classes.mainBlock } style={ { marginBottom: 40 } }>
                    <LoginButton referer={ this.props.location } includeForm />
                  </div>
                </Collapse>
              ) }
              { task.data &&
              <ReactPlaceholder showLoadingAnimation type='text' rows={ 1 } ready={ task.completed }>
                <Typography variant='h5' style={ { marginBottom: 10, marginTop: 20 } }>
                  <FormattedMessage id='task.info.description' defaultMessage='Description' />
                </Typography>
                <Typography variant='body2' style={ { marginBottom: 40 } }>
                  <ShowMoreText
                    lines={ 8 }
                    more={
                      <Button
                        size='small'
                        variant='outlined'
                      >
                        <FormattedMessage id='task.description.more' defaultMessage='Show more' />
                        <ExpandMore />
                      </Button>
                    }
                    less={
                      <Button
                        size='small'
                        variant='outlined'
                      >
                        <FormattedMessage id='task.description.less' defaultMessage='Show less' />
                        <ExpandLess />
                      </Button>
                    }
                  >
                    { task.data.description ? renderHTML(marked(task.data.description)) : renderHTML(marked(task.data.metadata ? task.data.metadata.issue.body : 'not available')) }
                  </ShowMoreText>

                </Typography>
              </ReactPlaceholder>
              }
              { task.data.User &&
              <React.Fragment>
                <Typography variant='h5' style={ { marginBottom: 10, marginTop: 20 } }>
                  <FormattedMessage id='task.info.authors' defaultMessage='Author(s)' />
                </Typography>
                <AuthorList
                  logged={ this.props.logged }
                  user={ this.props.user }
                  task={ this.props.task }
                  messageAuthor={ this.props.messageAuthor }
                  location={ this.props.location }
                  authors={
                    [
                      {
                        name: task.data.User.name,
                        email: task.data.User.email,
                        href: task.data.User.website
                      },
                      {
                        provider: task.data.provider,
                        name: task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.login : task.data.metadata && task.data.metadata.user,
                        href: task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.html_url : '',
                        avatar_url: task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.avatar_url : ''
                      }
                    ]
                  } />
              </React.Fragment>
              }
              { task.data && task.data.assigns && task.data.assigns.length > 0 &&
                <div style={ { marginBottom: 20 } }>
                  <Typography variant='h5' style={ { display: 'inline-block', marginBottom: 10, marginTop: 20 } }>
                    <FormattedMessage id='task.info.interested' defaultMessage='Candidate(s)' />
                  </Typography>
                  { this.taskOwner() &&
                  <Button
                    style={ { display: 'inline-block', marginBottom: 2 } }
                    onClick={ this.handleAssignDialog }
                    size='small'
                    color='primary'
                    variant='text'
                  >
                    <FormattedMessage id='task.assignment.action.assign' defaultMessage='Assign issue' />
                    <AssignmentIcon style={ { marginLeft: 10, verticalAlign: 'bottom' } } />
                  </Button> }
                  { task.data.assigns.filter(a => a.User.id === this.props.user.id && a.status === 'pending-confirmation' || a.status === 'accepted').length > 0 &&
                    <Button
                      style={ { display: 'inline-block', marginBottom: 2 } }
                      onClick={ this.handleAssignDialog }
                      size='small'
                      color='primary'
                      variant='text'
                    >

                      <FormattedMessage id='task.assign.action.review' defaultMessage='Review assignment' />
                      <AssignmentIcon style={ { marginLeft: 10, verticalAlign: 'bottom' } } />
                    </Button>
                  }
                  <TaskInterested assigns={ task.data && task.data.assigns } />
                  <Dialog fullScreen open={ this.state.assignIssueDialog } onClose={ () => this.setState({ assignIssueDialog: false }) }>
                    <DialogContent>
                      <RegularCard
                        headerColor='green'
                        cardTitle={ this.props.intl.formatMessage(messages.interestedCardTitle) }
                        cardSubtitle={ this.props.intl.formatMessage(messages.interestedCardSubTitle) }
                        content={
                          <Table
                            tableHeaderColor='warning'
                            tableHead={ [
                              this.props.intl.formatMessage(messages.interestedTableLabelUser),
                              this.props.intl.formatMessage(messages.interestedTableLabelWhen),
                              this.props.intl.formatMessage(messages.interestedTableLabelActions)
                            ] }
                            tableData={ task && task.data.assigns && task.data.assigns.length ? displayAssigns(task.data.assigns) : [] }
                          />
                        }
                      />

                    </DialogContent>
                    <DialogActions>
                      <Button
                        style={ { display: 'inline-block', marginBottom: 2 } }
                        onClick={ () => this.setState({ assignIssueDialog: false }) }
                        size='small'
                        color='secondary'
                        variant='text'
                      >
                        <FormattedMessage id='task.assgin.action.close' defaultMessage='Close' />
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              }
              { task.data && task.data.assigned &&
                <div style={ { marginBottom: 80 } }>
                  <Typography variant='h5' style={ { marginBottom: 10, marginTop: 20 } }>
                    <FormattedMessage id='task.info.assigns' defaultMessage='Assigned' />
                  </Typography>
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
                </div>
              }
              { /*
              <Typography variant='subtitle2' style={ { marginTop: 10, marginBottom: 10 } }>
                <FormattedMessage id='task.claim.title' defaultMessage='Are you the original author of this issue?' />
              </Typography>
              <Typography variant='body2' style={ { marginBottom: 10 } }>
                <FormattedMessage id='task.claim.subtitle' defaultMessage="If you're the original author of this issue, you can claim this issue so you will be admin and transfer the property to manage the issue on Gitpay." />
              </Typography>
              <div>
                <Button
                  onClick={ this.handleClaimDialog }
                  size='small'
                  color='primary'
                >
                  <span>
                    <FormattedMessage id='task.actions.claim' defaultMessage='Claim this issue' />
                  </span>
                </Button>
                { !this.props.logged ? (
                  <Dialog open={ taskClaimDialog } onClose={ () => this.setState({ taskClaimDialog: false }) }>
                    <DialogTitle id='form-dialog-title'>
                      <FormattedMessage id='task.bounties.logged.info' defaultMessage='You need to login to be assigned to this task' />
                    </DialogTitle>
                    <DialogContent>
                      <div className={ classes.mainBlock }>
                        <LoginButton referer={ this.props.location } includeForm />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <TaskClaim
                    taskData={ task.data }
                    requestClaimTask={ this.props.requestClaimTask }
                    user={ this.props.user }
                    open={ this.state.taskClaimDialog }
                    onClose={ () => this.setState({ taskClaimDialog: false }) }
                    onOpen={ () => this.setState({ taskClaimDialog: true }) }
                  />
                ) }
              </div>
              */ }

              <div style={ { marginBottom: 80 } }>
                <Button
                  style={ { display: 'inline-block', marginTop: 40 } }
                  onClick={ this.handleReportIssueDialog }
                  size='small'
                  color='secondary'
                  variant='contained'
                >
                  <BugReportIcon style={ { marginRight: 10, verticalAlign: 'middle' } } />
                  <FormattedMessage id='task.report.action' defaultMessage='Report issue' />
                </Button>
                <TaskReport
                  taskData={ task.data }
                  reportTask={ this.props.reportTask }
                  user={ this.props.user }
                  visible={ this.state.reportIssueDialog }
                  onClose={ () => this.setState({ reportIssueDialog: false }) }
                  onOpen={ () => this.setState({ reportIssueDialog: true }) }
                />
              </div>

              { this.taskOwner() &&
              <div>
                <Button
                  style={ { marginRight: 10 } }
                  onClick={ this.handleDeleteDialog }
                  color='secundary'
                  variant='outlined'
                >
                  <span className={ classes.spaceRight }>
                    <FormattedMessage id='task.actions.issue.delete' defaultMessage='Delete issue' />
                  </span>
                  <DeleteIcon />
                </Button>
                <Typography variant='caption' style={ { color: 'red' } }>This will remove this issue on Gitpay and all payment data will be lost. </Typography>
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
                        <Button onClick={ this.handleDeleteTask } variant='contained' color='secondary' >
                          <FormattedMessage id='task.actions.delete' defaultMessage='Delete' />
                        </Button>
                      </DialogActions>
                    </div>
                  ) }
                </Dialog>
              </div>
              }
            </Grid>
            <Grid style={ { backgroundColor: '#eee', padding: 25 } } item xs={ 12 } sm={ 4 }>
              <div style={ { display: 'flex', marginTop: 40, marginBottom: 40, justifyContent: 'space-evenly' } }>
                { task.data.level &&
                  <div style={ { textAlign: 'center' } }>
                    <Typography variant='caption' style={ { textTransform: 'uppercase' } }>
                      <FormattedMessage id='task.level.label' defaultMessage='Level' />
                    </Typography>
                    <div>
                      <CoffeeIcon />
                      <Typography variant='h6' className={ classes.taskInfoContent }>
                        { task.data.level }
                      </Typography>
                    </div>
                  </div>
                }
                <div style={ { textAlign: 'center' } }>
                  <Typography variant='caption' style={ { textTransform: 'uppercase' } }>
                    <FormattedMessage id='task.value.label' defaultMessage='Value offered' />
                  </Typography>
                  <div>
                    <MoneyIcon />
                    <Typography variant='h6' className={ classes.taskInfoContent }>
                      { task.values.available }
                      { task.data.paid && <Chip style={ { marginLeft: 10 } } variant='small' label='paid' /> }
                    </Typography>
                  </div>
                </div>
              </div>
              { this.taskOwner()
                ? (
                  <React.Fragment>
                    { task.data.assignedUser &&
                    <div style={ { marginTop: 30, marginBottom: 30 } }>
                      <Button
                        onClick={ this.handleTaskPaymentDialog }
                        color='primary'
                        fullWidth
                        size='large'
                        variant='contained'
                        style={ {
                          marginRight: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        } }
                      >
                        <RedeemIcon style={ { marginRight: 'auto' } } />
                        <span style={ { marginRight: 'auto' } } className={ classes.spaceRight }>
                          <FormattedMessage id='task.bounties.payment.label' defaultMessage='Pay contributor' />
                        </span>{ ' ' }
                      </Button>
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
                    }
                  </React.Fragment>
                ) : (
                  <div style={ { marginTop: 30, marginBottom: 10 } }>
                    <Button
                      onClick={ this.handleAssignDialogOpen }
                      color='primary'
                      fullWidth
                      size='large'
                      variant='contained'
                      disabled={ task.data.paid }
                      style={ {
                        marginRight: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      } }
                    >
                      <CheckIcon style={ { marginRight: 'auto' } } />
                      <span style={ { marginRight: 'auto' } } className={ classes.spaceRight }>
                        <FormattedMessage id='task.interested.action' defaultMessage="I'm interested" />
                      </span>{ ' ' }
                    </Button>
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
                      handleOfferTask={ this.handleOfferTask }
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
                )
              }
              <div style={ { marginTop: 25 } }>
                { this.rendereAmountStatsCardContent(this.taskOwner()) }
              </div>
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
  actionAssign: PropTypes.func,
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
  fundingInviteTask: PropTypes.func,
  reportTask: PropTypes.func,
  requestClaimTask: PropTypes.func
}

export default injectIntl(withStyles(styles)(Task))
