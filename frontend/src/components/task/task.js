import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import MomentComponent from 'moment'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import ShowMoreText from 'react-show-more-text'

import { messages } from './messages/task-messages'
import TaskInviteCard from './task-invite-card'
import TaskHeader from './task-header'
import AuthorList from './task-author-list'
import queryString from 'query-string'
import renderHTML from 'react-render-html'
import { marked } from 'marked'

import {
  Avatar,
  Container,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Button,
  withStyles,
  Link,
  DialogContentText,
  MobileStepper,
  Fab,
  Collapse
} from '@material-ui/core'

import {
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
  AttachMoney as MoneyIcon,
  HowToReg as HowToRegIcon,
  CreditCard as BountyIcon,
  Gavel as OfferIcon,
  Redeem as RedeemIcon,
  EmojiFoodBeverage as CoffeeIcon,
} from '@material-ui/icons'

import OfferDrawer from '../design-library/templates/offer-drawer/offer-drawer'

import IssueActionsByRole from './components/issue-actions-by-role'
import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'
import LoginButton from '../session/login-button'
import TaskPaymentForm from './task-payment-form'
import TaskPayments from './task-payments'
import TaskLevelSplitButton from './task-level-split-button'
import TaskDeadlineForm from './task-deadline-form'
import TaskOfferDrawer from './offers/task-offer-drawer'

import TaskStatusIcons from './task-status-icons'

import Constants from '../../consts'

import TaskDeadlineDrawer from '../design-library/templates/task-deadline-drawer/task-deadline-drawer'

const taskCover = require('../../images/task-cover.png')
const inviteCover = require('../../images/funds.png')

const bounty = require('../../images/bounty.png')
const sharing = require('../../images/sharing.png')
const notifications = require('../../images/notifications.png')

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
  btnClearDeadline: {
    float: 'left',
    marginTop: 10,
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
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
  chipStatusSuccess: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.primary.success
  },
  chipStatusClosed: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.error.main
  },
  avatarStatusSuccess: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.primary.success,
  },
  avatarStatusClosed: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.error.main,
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
  planContainer: {
    paddingTop: 5,
    paddingBottom: 5
  },
  planGrid: {
    margin: 0
  },
  planButton: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  HowToRegIcon: {
    paddingRight: theme.spacing(1),
    fontSize: 20
  },
  planIcon: {
    textAlign: 'center',
    fontSize: 32,
    padding: 2
  },
  planFinalPrice: {
    paddingTop: theme.spacing(1),
    fontSize: '2rem'
  },
  planGridItem: {
    padding: theme.spacing(1),
    margin: 2
  },
  planGridContent: {
    display: 'flex',
    justifyContent: 'space-evenly',
    minHeight: theme.spacing(2),
    margin: 0
  },
  planBullets: {
    paddingLeft: theme.spacing(1),
    padding: 5
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
  constructor(props) {
    super(props)

    this.state = {
      deadline: null,
      assigned: null,
      finalPrice: 0,
      currentPrice: 0,
      interestedComment: '',
      interestedLearn: false,
      termsAgreed: false,
      confirmOffer: false,
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
      taskSolveDialog: false,
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

  async componentDidMount() {
    const id = this.props.match.params.id
    const status = this.props.match.params.status
    const orderId = this.props.match.params.order_id
    const slug = this.props.match.params.slug
    const { logged } = this.props

    try {
      await this.props.syncTask(id)
      await this.props.fetchTask(id)
    }
    catch (e) {
      console.log('error to sync', e)
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

    if (this.props.history && this.props.history.location.pathname.startsWith(`/task/${id}/claim`)) {
      if (logged) {
        let params = queryString.parse(this.props.location.search)
        this.props.requestClaimTask(id, this.props.user.id, params.comments, true, params.token, this.props.history)
      }
    }
    const assign_id = this.props.match.params.interested_id
    const hash = this.props.location.hash
    const isOfferPage = this.props.match.path === '/profile/task/:id/offers'
    
    if(isOfferPage) {
      this.setState({ assignDialog: true })
    }

    if(hash === '#task-solution-dialog') {
      this.setState({ taskSolveDialog: true })

    }
    if(hash === '#accept' || hash === '#reject') {
      this.setState({ taskPaymentDialog: true })
      
      if(assign_id)  {
        if(hash === '#accept') {
          await this.props.actionAssign(id, assign_id, true)
          this.props.addNotification('actions.task.status.accept')
        }
        if(hash === '#reject') {
          await this.props.actionAssign(id, assign_id, false)
          this.props.addNotification('actions.task.status.reject')
        } 
      }
    }
  }

  componentDidUpdate() {
    this.checkFirstTask()
  }

  checkFirstTask() {
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

  handleTaskSolveDialogOpen = () => {
    this.setState({ taskSolveDialog: true })
  }

  handleTaskSolveDialogClose = () => {
    this.setState({ taskSolveDialog: false })
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
          href={`${this.props.task.data.metadata.issue.user.html_url}`}
          target='_blank'>
          <FormattedMessage id='task.status.created.name.short' defaultMessage='by {name}' values={{
            name: this.props.task.data.metadata ? this.props.task.data.metadata.issue.user.login : 'unknown'
          }} />
        </Link>
      )
    }
    else {
      return (
        <FormattedMessage id='task.status.created.name.short' defaultMessage='by {name}' values={{
          name: this.props.task.data.metadata ? this.props.task.data.metadata.issue.user.login : 'unknown'
        }} />
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
            <Button onClick={this.handleFirstTaskBounties} color='primary' variant='contained' style={{ display: 'block', margin: '20px auto' }}>
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
            <Button onClick={this.handleFirstTaskNotifications} color='primary' variant='contained' style={{ display: 'block', margin: '20px auto' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button
          onClick={this.handlePaymentForm}
          size='small'
          color='secondary'
          variant='contained'
          disabled={this.props.task.data.paid || this.props.task.data.transfer_id || this.props.task.data.Transfer }
          fullWidth
          style={{ marginRight: 5 }}
        >
          <span>
            <FormattedMessage id='task.bounties.payment.add' defaultMessage='Make a payment' />
          </span>
          <BountyIcon style={{ marginLeft: 10 }} />
        </Button>
          <Button
            disabled={this.props.task.data.paid || this.props.task.data.status === 'closed'}
            onClick={this.handleAssignDialogOpen}
            size='small'
            color='secondary'
            variant='contained'
            fullWidth
            style={{ marginLeft: 5 }}
          >
            <span>
              <FormattedMessage id='this.props.ask.interested.offer' defaultMessage='Make an offer' />
            </span>
            <OfferIcon style={{ marginLeft: 10 }} />
          </Button>
        
      </div>
    )
  }

  taskOwner = () => {
    const { task } = this.props
    const creator = this.props.logged && task.data.User && this.props.user.id === task.data.User.id
    const owner = (task.data.members && task.data.members.length) ? task.data.members.filter(m => m.User.id === this.props.user.id).length > 0 : false
    return creator || owner
  }

  render() {
    const { classes, task, project, order, noTopBar, noBottomBar } = this.props
    const { taskSolveDialog } = this.state

    // Error handling when task does not exist
    if (task.completed && !task.values) {
      this.props.history.push('/404')
      return null
    }
    // const updatedAtTimeString = task.data.metadata ? MomentComponent(task.data.metadata.issue.updated_at).utc().format('hh:mm A') : 'not available'
    const updatedAtTimeString = task.data.metadata ? MomentComponent(task.data.metadata.issue.updated_at).utc().fromNow() : 'not available'
    const timePlaceholder = (
      <Typography type='subheading' variant='caption' style={{ padding: 10, color: 'gray', marginRight: 10 }}>
        <FormattedMessage id='task.bounties.interested.created' defaultMessage='created' /> {updatedAtTimeString}
      </Typography>
    )

    const deliveryDate = task.data.deadline !== null ? MomentComponent(task.data.deadline).utc().format('MM-DD-YYYY') : this.props.intl.formatMessage(messages.deliveryDateNotInformed)
    const deadline = task.data.deadline !== null ? MomentComponent(task.data.deadline).diff(MomentComponent(), 'days') : false

    const firstStepsContent = this.handleFirstTaskContent()

    return (
      <div>
        <Dialog
          open={this.state.isFirstTask}
          maxWidth='xs'
          aria-labelledby='form-dialog-title'
        >
          <DialogContent>
            <div style={{ textAlign: 'center' }}>
              <img
                src={firstStepsContent.image}
                style={{ margin: '20px auto 0' }}
                width='70%'
              />
              <DialogTitle style={{ marginTop: 20 }}>
                <Fab
                  size='small'
                  aria-label='close'
                  className={classes.closeButton}
                  onClick={() => this.setState({ isFirstTask: false })}
                >
                  <CloseIcon />
                </Fab>

                <Typography variant='h4'>
                  {firstStepsContent.title}
                </Typography>
              </DialogTitle>
              <DialogContentText>
                {firstStepsContent.description}
              </DialogContentText>
            </div>
          </DialogContent>
          <MobileStepper
            variant='dots'
            steps={3}
            position='static'
            activeStep={this.state.firstTaskSteps}
            nextButton={
              <Button
                size='small'
                onClick={() => this.setState((prevState) => ({ firstTaskSteps: prevState.firstTaskSteps + 1 }))}
                disabled={this.state.firstTaskSteps === 2}
              >
                <FormattedMessage id='first.task.next' defaultMessage='Next' />
              </Button>
            }
            backButton={
              <Button
                onClick={() => this.setState((prevState) => ({ firstTaskSteps: prevState.firstTaskSteps - 1 }))}
                disabled={this.state.firstTaskSteps === 0}
                size='small'
              >
                <FormattedMessage id='first.task.back' defaultMessage='Back' />
              </Button>
            }
          />
        </Dialog>
        {noTopBar ? null : (
          <TopBarContainer />
        )}
        <Grid container style={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={12} md={8} style={{ marginBottom: 40 }}>
            <Container fixed maxWidth='lg'>
              <TaskHeader
                taskPaymentDialog={this.taskPaymentDialog}
                task={task}
                user={this.props.user}
                history={this.props.history}
                project={project}
                updateTask={this.props.updateTask}
                fetchTask={this.props.fetchTask}
                taskOwner={this.taskOwner()}
                handleDeleteTask={this.handleDeleteTask}
                reportTask={this.props.reportTask}
              />
              {this.props.logged ? 
                (
                  <ReactPlaceholder showLoadingAnimation type='text' rows={1} ready={task.completed}>
                    <TaskPaymentForm
                      classes={classes}
                      match={this.props.match}
                      dialog={this.props.dialog}
                      task={task}
                      plan={task.data.private ? 'private' : 'open source'}
                      order={this.props.order}
                      open={this.state.paymentForm}
                      onClose={() => this.setState({ paymentForm: false })}
                      user={this.props.user}
                      openDialog={this.props.openDialog}
                      closeDialog={this.props.closeDialog}
                      addNotification={this.props.addNotification}
                      updateTask={this.props.updateTask}
                      createOrder={this.props.createOrder}
                      fetchCustomer={this.props.fetchCustomer}
                      customer={this.props.customer}
                      listWallets={this.props.listWallets}
                      wallets={this.props.wallets}
                      fetchWallet={this.props.fetchWallet}
                      wallet={this.props.wallet}
                      fetchTask={this.props.fetchTask}
                      syncTask={this.props.syncTask}
                    />
                  </ReactPlaceholder>
               ) : (
                <Collapse in={this.state.paymentForm}>
                  <div className={classes.mainBlock} style={{ marginBottom: 40 }}>
                    <LoginButton referer={this.props.location} includeForm />
                  </div>
                </Collapse>
              )}
              {task.data.description &&
                <ReactPlaceholder showLoadingAnimation type='text' rows={1} ready={task.completed}>
                  <Typography variant='subtitle1' style={{ marginBottom: 10, marginTop: 20 }}>
                    <FormattedMessage id='task.info.description' defaultMessage='Description' />
                  </Typography>
                  <Typography variant='body1' style={{ marginBottom: 40 }}>
                    <ShowMoreText
                      lines={8}
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
                      {renderHTML(marked(task.data.description))}
                    </ShowMoreText>

                  </Typography>
                </ReactPlaceholder>
              }
              {task.data.User &&
                <React.Fragment>
                  <Typography variant='subtitle1' style={{ marginBottom: 10, marginTop: 20 }}>
                    <FormattedMessage id='task.info.authors' defaultMessage='Imported by' />
                  </Typography>
                  <AuthorList
                    logged={this.props.logged}
                    user={this.props.user}
                    task={this.props.task}
                    messageAuthor={this.props.messageAuthor}
                    location={this.props.location}
                    authors={
                      [
                        {
                          name: task.data.User.name || 'anonymous',
                          email: task.data.User.email,
                          href: task.data.User.website
                        }
                      ]
                    } />
                </React.Fragment>
              }
            </Container>
          </Grid>
          <Grid style={{ backgroundColor: '#eee', padding: 25 }} item xs={12} sm={12} md={4}>
            {task.values && task.values.available > 0 &&
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Typography variant='caption' style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage id='task.value.label' defaultMessage='Value offered' />
                </Typography>
                <div>
                  <MoneyIcon />
                  <Typography variant='h5' className={classes.taskInfoContent}>
                    {task.values.available}
                    {task.data.paid && <Chip style={{ marginLeft: 10 }} variant='small' label='paid' />}
                  </Typography>
                </div>
              </div>
            }

            <div style={{ display: 'flex', marginTop: 40, marginBottom: 40, justifyContent: 'space-evenly' }}>
              <div style={{ textAlign: 'center' }}>
                <Typography variant='caption' style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage id='task.publicy.label' defaultMessage='Publicy' />
                </Typography>
                <div>
                  <TaskStatusIcons status={task.data.private ? 'private' : 'public'} bounty />
                </div>
              </div>
              {task.data.status &&
                <div style={{ textAlign: 'center' }}>
                  <Typography variant='caption' style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage id='task.status.label' defaultMessage='Status' />
                  </Typography>
                  { /* Making editable issue status / needs better implementation to sync between Github and Gitpay
                    <div>
                      {this.props.user && this.props.user.id && this.taskOwner() && task.data.status && task.data && task.data.id
                        ? <TaskStatusDropdown
                          onSelect={(status) => this.props.updateTask({ id: task.data.id, status: status })}
                          status={task.data.status}
                        />
                        : <Chip
                          label={this.props.intl.formatMessage(Constants.STATUSES[task.data.status])}
                          avatar={<Avatar className={task.data.status === 'closed' ? classes.avatarStatusClosed : classes.avatarStatusSuccess} style={{ width: 12, height: 12 }}>{' '}</Avatar>}
                          className={task.data.status === 'closed' ? classes.chipStatusClosed : classes.chipStatusSuccess}
                        />
                      }
                    </div>
                    */
                  }
                  <div>
                    <Chip
                      label={this.props.intl.formatMessage(Constants.STATUSES[task.data.status])}
                      avatar={<Avatar className={task.data.status === 'closed' ? classes.avatarStatusClosed : classes.avatarStatusSuccess} style={{ width: 12, height: 12 }}>{' '}</Avatar>}
                      className={task.data.status === 'closed' ? classes.chipStatusClosed : classes.chipStatusSuccess}
                    />
                  </div>
                </div>
              }

            </div>
            <div style={{ display: 'flex', marginTop: 40, marginBottom: 40, justifyContent: 'space-evenly' }}>
              {task.data.level && !this.taskOwner() &&
                <div style={{ textAlign: 'center' }}>
                  <Typography variant='caption' style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage id='task.level.label' defaultMessage='Level' />
                  </Typography>
                  <div>
                    <CoffeeIcon />
                    <Typography variant='h6' className={classes.taskInfoContent}>
                      {task.data.level}
                    </Typography>
                  </div>
                </div>
              }
              {task.data.deadline && !this.taskOwner() &&
                <div style={{ textAlign: 'center' }}>
                  <Typography variant='caption' style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage id='task.deadline.label' defaultMessage='Deadline' />
                  </Typography>
                  <div>
                    <Typography variant='h6' className={classes.taskInfoContent}>
                      <Button onClick={() => this.setState({ deadlineForm: true })}>
                        {task.data.deadline ? (
                          <div>
                            <div>{deliveryDate}</div>
                            {deadline && parseInt(deadline) > 0 ?
                              <small>in {deadline} days</small>
                              : <Chip size='small' label={<FormattedMessage id='task.dealine.past' defaultMessage='Overdue' />} />
                            }
                          </div>
                        ) : (
                          <FormattedMessage id='task.deadline.call' defaultMessage='Set deadline' />
                        )}
                      </Button>
                    </Typography>
                  </div>
                </div>
              }
              {this.taskOwner() &&
                <div style={{ textAlign: 'center' }}>
                  <Typography variant='caption' style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage id='task.level.label' defaultMessage='Level' />
                  </Typography>
                  <div>
                    <Typography variant='h6' className={classes.taskInfoContent}>
                      <TaskLevelSplitButton id={task.data.id} level={task.data.level} updateTask={this.props.updateTask} />
                    </Typography>
                  </div>
                </div>
              }
              {this.taskOwner() &&
                <div style={{ textAlign: 'center' }}>
                  <Typography variant='caption' style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage id='task.deadline.label' defaultMessage='Deadline' />
                  </Typography>
                  <div>
                    <Typography variant='h6' className={classes.taskInfoContent}>
                      <Button onClick={() => this.setState({ deadlineForm: true })}>
                        {task.data.deadline ? (
                          <div>
                            <div>{deliveryDate}</div>
                            {deadline && parseInt(deadline) > 0 ?
                              <small>in {deadline} days</small>
                              : <Chip size='small' label={<FormattedMessage id='task.dealine.past' defaultMessage='Overdue' />} />
                            }
                          </div>
                        ) : (
                          <FormattedMessage id='task.deadline.call' defaultMessage='Set deadline' />
                        )}
                      </Button>
                    </Typography>
                  </div>
                </div>
              }
            </div>
            <TaskDeadlineDrawer
              open={this.state.deadlineForm}
              onClose={() => this.setState({ deadlineForm: false })}
              taskId={task.data.id}
              task={task.data}
              onUpdate={(task) => {
                this.props.updateTask(task)
                this.setState({ deadlineForm: false })
              }}
              classes={classes}
            />
            {task?.data && (task?.data?.orders?.length || task?.data?.Orders?.length) ?
              <div>
                <TaskPayments orders={(task?.data?.orders || task?.data?.Orders)?.filter(o => o.paid && o.status === 'succeeded')} />
              </div> : null
            }
            <IssueActionsByRole
              issue={task}
              currentRole={this.taskOwner() ? 'admin' : 'user'}
            />
            <TaskInviteCard
              onInvite={this.props.inviteTask}
              onFunding={this.handleTaskFundingDialogOpen}
              user={this.props.user}
              id={task.data.id}
            />
            <TaskOfferDrawer
              issue={task}
              open={this.state.assignDialog}
              onClose={this.handleAssignFundingDialogClose}
              offerUpdate={this.props.offerUpdate}
              loggedUser={this.props.logged}
              createOrder={this.props.createOrder}
              assignTask={this.props.assignTask}
              assigns={task.data.Assigns}
              onMessage={this.props.messageOffer}
              updateTask={this.props.updateTask}
            />
            <OfferDrawer
              hasEmailInput
              title={<FormattedMessage id='issue.offer.drawer.invite.title' defaultMessage='Invite sponsor' />}
              introTitle={<FormattedMessage id='task.funding.title' defaultMessage='Invite someone to add bounties to this issue' />}
              introMessage={
                <FormattedMessage id='task.funding.description' defaultMessage={'You can invite a investor, sponsor, or the project owner to fund this issue and let them know your suggestions'}>
                  {(msg) => (
                    <span className={classes.spanText}>
                      {msg}
                    </span>
                  )}
                </FormattedMessage>
              }
              simpleInfoText={
                <FormattedMessage id='issue.funding.invite.info' defaultMessage='You will invite a sponsor to add bounties to this issue' />
              }
              commentAreaPlaceholder={
                <FormattedMessage id='task.funding.comment.value' defaultMessage='Leave a message to be sent together with the invite' />
              }
              pickupTagListTitle={
                <FormattedMessage id='task.funding.invite.title' defaultMessage='Suggest a bounty for the sponsor' />
              }
              pickutTagListDescription={
                <FormattedMessage id='task.funding.invite.headline' defaultMessage='You can suggest a bounty for the sponsor to add a bounty to this issue' />
              }
              introImage={inviteCover}
              issue={task}
              open={this.state.taskFundingDialog}
              onDeliveryDateChange={(date) => this.setState({ interestedSuggestedDate: date })}
              onChangePrice={(price) => this.setState({ currentPrice: price })}
              onClose={this.handleAssignFundingDialogClose}
              onCommentChange={this.handleFundingInputMessageChange}
              onEmailInviteChange={this.handleFundingEmailInputChange}
              onTermsCheckboxChange={(checked) => this.setState({ termsAgreed: checked })}
              actions={
                [
                  {
                    label: <FormattedMessage id='task.funding.cancel' defaultMessage='Cancel' />,
                    onClick: this.handleAssignFundingDialogClose
                  },
                  {
                    disabled: !this.state.fundingInvite.email || !this.state.termsAgreed || !this.state.currentPrice || this.state.currentPrice === 0,
                    label: <FormattedMessage id='task.funding.invite' defaultMessage='Invite' />,
                    onClick: this.sendFundingInvite,
                    variant: 'contained',
                    color: 'secondary',
                  }
                ]
              }
            />
          </Grid>
        </Grid>
        {noBottomBar ? null : (
          <Bottom />
        )}
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
