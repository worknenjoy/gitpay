import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import MomentComponent from 'moment'
import ReactPlaceholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import 'react-placeholder/lib/reactPlaceholder.css'

import Grid from 'material-ui/Grid'
import Avatar from 'material-ui/Avatar'
import Card, { CardHeader } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'

import RedeemIcon from 'material-ui-icons/Redeem'
import ShoppingBasket from 'material-ui-icons/ShoppingBasket'
import AddIcon from 'material-ui-icons/Add'
import FilterIcon from 'material-ui-icons/FilterList'
import TrophyIcon from 'material-ui-icons/AccountBalanceWallet'
import DateIcon from 'material-ui-icons/DateRange'
import CalendarIcon from 'material-ui-icons/PermContactCalendar'
import GroupWorkIcon from 'material-ui-icons/GroupAdd'
import DoneIcon from 'material-ui-icons/Done'
import NavigationIcon from 'material-ui-icons/ArrowBack'
import InfoIcon from 'material-ui-icons/Info'
import WarningIcon from 'material-ui-icons/Warning'
import DeleteIcon from 'material-ui-icons/Delete'

import Chip from 'material-ui/Chip'
import StatusDialog from './status-dialog'
import TaskPayment from './task-payment'
import TaskPaymentForm from './task-payment-form'
import TaskDeadlineForm from './task-deadline-form'

import StatsCard from '../Cards/StatsCard'
import RegularCard from '../Cards/RegularCard'
import Table from '../Table/Table'

import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'

import marked from 'marked'
import renderHTML from 'react-render-html'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'
import LoginButton from '../session/login-button'

const logoGithub = require('../../images/github-logo.png')

import PaymentTypeIcon from '../payment/payment-type-icon'
import Constants from '../../consts'

import { PageContent } from 'app/styleguide/components/Page'

import styled from 'styled-components'
import media from 'app/styleguide/media'

import RemoveAssignment from './assignment/RemoveAssignment'
import TaskAssigned from './task-assigned'
import TaskInvite from './task-invite'
import { Paper } from 'material-ui'
import { FormControl } from 'material-ui/Form'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import Checkbox from 'material-ui/Checkbox'

const TaskHeader = styled.div`
  box-sizing: border-box;
  background: black;
  padding: 1rem 3rem 1rem 3rem;
  position: relative;
  margin: -2rem -3rem 1rem -3rem;

  border-top: 1px solid #999;

  ${media.phone`
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;

    & h1 {
      font-size: 1.75rem;
    }
  `}
`

const Tags = styled.div`
  display: inline-block;

  ${media.phone`
    display: block;
    margin-top: 1rem;
    margin-left: -20px;
  `}
`

const PlaceholderDiv = styled.div`
 img {
   width: 100%;
 }
`
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
    border: `4px solid ${theme.palette.primary.main}`
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
  unprocessed: {
    id: 'task.order.paid.proccess.none',
    defaultMessage: 'Pending'
  },
  taskLabel: {
    id: 'task.tab.label',
    defaultMessage: 'Task'
  },
  orderLabel: {
    id: 'task.tab.order',
    defaultMessage: 'Orders'
  },
  interestedLabel: {
    id: 'task.tab.interested',
    defaultMessage: 'Interested'
  },
  cardTitle: {
    id: 'task.card.title',
    defaultMessage: 'Payments for this task'
  },
  cardSubtitle: {
    id: 'task.card.subtitle',
    defaultMessage: 'This payments will be transfered after the task be finished'
  },
  cardTableHeaderPaid: {
    id: 'task.card.table.header.paid',
    defaultMessage: 'Paid'
  },
  cardTableHeaderStatus: {
    id: 'task.card.table.header.status',
    defaultMessage: 'Status'
  },
  cardTableHeaderValue: {
    id: 'task.card.table.header.value',
    defaultMessage: 'Value'
  },
  cardTableHeaderCreated: {
    id: 'task.card.table.header.created',
    defaultMessage: 'Created at'
  },
  cardTableHeaderUser: {
    id: 'task.card.table.header.user',
    defaultMessage: 'User'
  },
  cardTableHeaderPayment: {
    id: 'task.card.table.header.payment',
    defaultMessage: 'Payment'
  },
  interestedCardTitle: {
    id: 'task.card.interested.title',
    defaultMessage: 'Interest to work in this task'
  },
  interestedCardSubTitle: {
    id: 'task.card.interested.subtitle',
    defaultMessage: 'This is interested users to conclude this task'
  },
  interestedTableLabelUser: {
    id: 'task.interested.table.label.user',
    defaultMessage: 'User'
  },
  interestedTableLabelWhen: {
    id: 'task.interested.table.label.when',
    defaultMessage: 'When'
  },
  interestedTableLabelActions: {
    id: 'task.interested.table.label.actions',
    defaultMessage: 'Actions'
  },
  taskValueLabel: {
    id: 'task.status.value',
    defaultMessage: 'Task value'
  },
  taskValuesStatus: {
    id: 'task.status.info',
    defaultMessage: 'Approved: $ {approved}, Pending: $ {pending}, Failed: $ {failed}'
  },
  taskLimitDate: {
    id: 'task.status.limit.date',
    defaultMessage: 'Deadline to conclude this task'
  },
  deliveryDateNotInformed: {
    id: 'task.status.limit.date.not.informed',
    defaultMessage: '(not informed)'
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
      showSuggestAnotherDateField: false
    }
  }

  componentWillMount () {
    this.props.syncTask(this.props.match.params.id)
    this.props.fetchTask(this.props.match.params.id)
  }

  handleTabChange = (event, tab) => {
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
    }, this.props.history)
    this.setState({ deleteDialog: false })
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

  handleBackToTaskList = () => {
    window.location.assign('/#/tasks/explore')
  }

  handleInputInterestedCommentChange = (e) => {
    this.setState({ interestedComment: e.target.value })
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

  render () {
    const { classes, task, order } = this.props

    const TabContainer = props => {
      return (
        <Typography component='div' style={ { padding: 8 * 3 } }>
          { props.children }
        </Typography>
      )
    }

    const statuses = {
      open: this.props.intl.formatMessage(messages.openStatus),
      succeeded: this.props.intl.formatMessage(messages.succeededStatus),
      fail: this.props.intl.formatMessage(messages.failStatus)
    }

    const taskOwner = () => {
      return this.props.logged && this.props.user.id === task.data.userId
    }

    const userRow = user => {
      return (<span>
        { user && user.length && user.profile_url
          ? (
            <FormattedMessage id='task.payment.user.check.github' defaultMessage='Check this user profile at Github'>
              { (msg) => (
                <Tooltip id='tooltip-github' title={ msg } placement='bottom'>
                  <a target='_blank' href={ user.profile_url } style={ { display: 'flex', alignItems: 'center' } }>
                    <span>{ user.username || user.name || ' - ' }</span>
                    <img style={ { backgroundColor: 'black', marginLeft: 10 } } width={ 18 } src={ logoGithub } />
                  </a>
                </Tooltip>
              ) }
            </FormattedMessage>
          )
          : (
            `${user && (user.username || user.name || this.props.intl.formatMessage(messages.noUserFound))}`
          )
        }
      </span>)
    }

    const displayOrders = orders => {
      if (!orders.length) {
        return []
      }
      return orders.map((item, i) => [
        item.paid ? this.props.intl.formatMessage(messages.labelYes) : this.props.intl.formatMessage(messages.labelNo),
        statuses[item.status] || this.props.intl.formatMessage(messages.unprocessed),
        `$ ${item.amount}`,
        MomentComponent(item.updatedAt).fromNow(),
        userRow(item.User),
        <PaymentTypeIcon type={ item.provider } />
      ])
    }

    const assignActions = (assign) => {
      const task = this.props.task.data
      const hasAssignedUser = assign.id === task.assigned
      const isOwner = taskOwner()

      return (
        <div>
          <RemoveAssignment
            task={ task }
            remove={ this.props.removeAssignment }
            visible={ hasAssignedUser && isOwner }
          />

          { (isOwner && !hasAssignedUser) &&
          <Button
            disabled={ hasAssignedUser }
            onClick={ () => this.props.assignTask(task.id, assign.id) }
            style={ { marginRight: 10 } }
            variant='raised'
            size='small'
            color='primary'
          >
            <GroupWorkIcon style={ { marginRight: 5 } } />
            <FormattedMessage id='task.actions.choose' defaultMessage='choose' />
          </Button>
          }

          { hasAssignedUser &&
            <FormattedMessage id='task.payment.action.chosen' defaultMessage='Chosen' >
              { (msg) => (
                <Chip label={ msg } />
              ) }
            </FormattedMessage>
          }
        </div>
      )
    }

    const displayAssigns = assign => {
      if (!assign.length) {
        return []
      }

      const items = assign.map((item, i) => {
        const userField = () => (
          <span>
            { item.User.profile_url
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
              )
              : (
                `${item.User.username || item.User.name || ' - '}`
              )
            }
          </span>
        )

        return [userField(), MomentComponent(item.updatedAt).fromNow(), assignActions(item)]
      })

      return items
    }

    const headerPlaceholder = (
      <div className='line-holder'>
        <RectShape
          color='white'
          style={ { marginLeft: 20, marginTop: 20, width: 300, height: 20 } }
        />
      </div>
    )

    const updatedAtTimeString = MomentComponent(task.data.metadata.issue.updated_at).utc().format('hh:mm A')
    const timePlaceholder = (
      <Typography type='subheading' style={ { padding: 10, color: 'gray' } }>
        { updatedAtTimeString }
      </Typography>
    )

    const deliveryDate = task.data.deadline !== null ? MomentComponent(task.data.deadline).utc().format('DD-MM-YYYY') + ' (' + MomentComponent(task.data.deadline).utc().fromNow() + ')' : this.props.intl.formatMessage(messages.deliveryDateNotInformed)

    return (
      <div>
        <TopBarContainer />
        <PageContent>
          <TaskHeader>
            <Button onClick={ this.handleBackToTaskList } style={ { marginBottom: 10 } } variant='raised' size='small' aria-label='Delete' className={ classes.button }>
              <NavigationIcon />
              <FormattedMessage id='task.title.navigation' defaultMessage='Tasks' />
            </Button>
            <Typography variant='subheading' style={ { color: '#bbb' } }>
              <ReactPlaceholder showLoadingAnimation type='text' rows={ 1 }
                ready={ task.completed }>
                { task.data.metadata &&
                  <a className={ classes.white } href={ task.data.url }>
                    { task.data.metadata.company }
                  </a>
                }
              </ReactPlaceholder>
            </Typography>

            <ReactPlaceholder customPlaceholder={ headerPlaceholder } showLoadingAnimation
              ready={ task.completed }>
              <Typography variant='display1' color='primary' align='left' gutterBottom>
                <a className={ classes.white } href={ task.data.url }>
                  { task.data.title }
                </a>

                <Tags>
                  <Chip
                    style={ { marginRight: 10 } }
                    label={ this.props.intl.formatMessage(Constants.STATUSES[task.data.status]) }
                    className={ classes.chipStatus }
                    onDelete={ this.handleStatusDialog }
                    onClick={ this.handleStatusDialog }
                    deleteIcon={ <DoneIcon /> }
                  />

                  { task.data.paid && (
                    <FormattedMessage id='task.status.label.paid' defaultMessage='Paid'>
                      { (msg) => (
                        <Chip
                          style={ { marginRight: 10 } }
                          label={ msg }
                          className={ classes.chipStatusPaid }
                          onDelete={ this.handleTaskPaymentDialog }
                          onClick={ this.handleTaskPaymentDialog }
                          deleteIcon={ <RedeemIcon /> }
                        />
                      ) }
                    </FormattedMessage>
                  ) }
                </Tags>

              </Typography>
            </ReactPlaceholder>
          </TaskHeader>
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
              <div style={ { position: 'absolute', left: 18, top: 5 } }>
                <Typography color='default'>
                  <FormattedMessage id='task.status.author.label' defaultMessage='Author' />
                </Typography>
              </div>
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
                      providerStatus={ task.data.metadata.issue.state }
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
                <TaskInvite id={ task.data.id } onInvite={ this.props.inviteTask } visible={ this.state.taskInviteDialog } onClose={ () => this.setState({ taskInviteDialog: false }) } onOpen={ () => this.setState({ taskInviteDialog: true }) } />
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
                        <FormattedMessage id='task.bounties.delete.confirmation' defaultMessage='Are you sure you want to delete this task?' />
                      </DialogTitle>
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
                        <FormattedMessage id='task.bounties.interested.question' defaultMessage='Are you interested solve this task?' />
                      </DialogTitle>
                      <DialogContent>
                        <Card>
                          <CardHeader
                            avatar={
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
                            title={ task.data.title }
                            subheader={
                              <FormattedMessage id='task.status.created.name.short' defaultMessage='by {name}' values={ {
                                name: task.data.metadata.issue.user.login
                              } } />
                            }
                            action={
                              timePlaceholder
                            }
                          />
                        </Card>

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
                              <WarningIcon className={ classes.iconCenter } style={ { color: '#D7472F' } } />
                              <FormattedMessage id='task.bounties.interested.warningMessage' defaultMessage='Please just send your interested if you will be able to do it and finish on time'>
                                { (msg) => (
                                  <span className={ classes.spanText }>
                                    { msg }
                                  </span>
                                ) }
                              </FormattedMessage>
                            </Typography>
                          </div>
                          <div style={ { padding: 5, color: 'gray' } }>
                            <Typography type='caption' gutterBottom style={ { color: 'gray' } }>
                              <CalendarIcon className={ classes.iconCenter } />
                              <span className={ classes.spanText }>
                                <FormattedHTMLMessage id='task.bounties.interested.deliveryDate' defaultMessage='Delivery date at {deliveryDate}' values={ { deliveryDate: deliveryDate } } />
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
                                  <InputLabel htmlFor='interested-date'>{ msg }</InputLabel>
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
                          <InputLabel htmlFor='interested-amount'>
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

                        <Grid container spacing={ 24 }>

                          <Grid item xs={ 12 } sm={ 6 }>
                            <Checkbox checked={ this.state.currentPrice === 0 && !this.state.interestedLearn ? 'checked' : '' } onChange={ this.handleCheckboxLeaveItFor } /><FormattedMessage id='task.bounties.interested.leaveItFor' defaultMessage='Or leave it for' />&nbsp;
                            <Chip
                              label={ `$ ${task.values.available}` }
                              className={ classes.chip }
                              onClick={ () => this.pickTaskPrice(0) }
                            />
                          </Grid>
                          <Grid item xs={ 12 } sm={ 6 }>
                            <Checkbox checked={ this.state.interestedLearn ? 'checked' : '' } onChange={ this.handleCheckboxLearn } /><FormattedMessage id='task.bounties.interested.iAmStarter' defaultMessage="Or I'm starter and I just want to gain experience" />
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
                                value={ this.state.interestedComment }
                                onChange={ this.handleInputInterestedCommentChange }
                              />
                            ) }
                          </FormattedMessage>
                        </FormControl>

                      </DialogContent>
                      <DialogActions>
                        <Button onClick={ this.handleAssignDialogClose } color='primary'>
                          <FormattedMessage id='task.bounties.actions.cancel' defaultMessage='Cancel' />
                        </Button>
                        <Button onClick={ this.handleAssignTask } variant='raised' color='secondary' >
                          <FormattedMessage id='task.bounties.actions.work' defaultMessage='I want to work on this task!' />
                        </Button>
                      </DialogActions>
                    </div>
                  ) }
                </Dialog>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 8 }>
              { task.data.assigned && <TaskAssigned status={ this.props.intl.formatMessage(Constants.STATUSES[task.data.status]) } classes={ classes } user={ task.data.assignedUser || {} } /> }
              <TaskPaymentForm { ...this.props } open={ this.state.paymentForm } />
              { taskOwner() &&
                <TaskDeadlineForm { ...this.props } open={ this.state.deadlineForm } />
              }
              <div className={ classes.rootTabs }>
                <AppBar position='static' color='default'>
                  <Tabs
                    value={ task.tab }
                    onChange={ this.handleTabChange }
                    scrollable
                    scrollButtons='on'
                    indicatorColor='primary'
                    textColor='primary'
                  >
                    <Tab label={ this.props.intl.formatMessage(messages.taskLabel) } icon={ <RedeemIcon /> } />
                    <Tab label={ this.props.intl.formatMessage(messages.orderLabel) } icon={ <ShoppingBasket /> } />
                    <Tab label={ this.props.intl.formatMessage(messages.interestedLabel) } icon={ <GroupWorkIcon /> } />
                  </Tabs>
                </AppBar>
                { task.tab === 0 &&
                <TabContainer>
                  <Card className={ classes.paper }>
                    <Typography variant='title' align='left' gutterBottom>
                      <FormattedMessage id='task.info.description' defaultMessage='Description' />
                    </Typography>
                    <Typography variant='body2' align='left' gutterBottom>
                      <ReactPlaceholder showLoadingAnimation type='text' rows={ 1 } ready={ task.completed }>
                        <PlaceholderDiv className={ classes.contentBody }>
                          { renderHTML(marked(task.data.metadata.issue.body)) }
                        </PlaceholderDiv>
                      </ReactPlaceholder>
                    </Typography>
                  </Card>
                </TabContainer> }
                { task.tab === 1 &&
                <div style={ { marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20 } }>
                  <RegularCard
                    headerColor='green'
                    cardTitle={ this.props.intl.formatMessage(messages.cardTitle) }
                    cardSubtitle={ this.props.intl.formatMessage(messages.cardSubtitle) }
                    content={
                      <Table
                        tableHeaderColor='warning'
                        tableHead={ [
                          this.props.intl.formatMessage(messages.cardTableHeaderPaid),
                          this.props.intl.formatMessage(messages.cardTableHeaderStatus),
                          this.props.intl.formatMessage(messages.cardTableHeaderValue),
                          this.props.intl.formatMessage(messages.cardTableHeaderCreated),
                          this.props.intl.formatMessage(messages.cardTableHeaderUser),
                          this.props.intl.formatMessage(messages.cardTableHeaderPayment)
                        ]
                        }
                        tableData={ task.data.orders.length ? displayOrders(task.data.orders) : [] }
                      />
                    }
                  />
                </div> }
                { task.tab === 2 &&
                <div style={ { marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20 } }>
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
                        tableData={ task.data.assigns.length ? displayAssigns(task.data.assigns) : [] }
                      />
                    }
                  />
                </div> }
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 4 }>
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
              { MomentComponent(task.data.deadline).isValid() &&
              <StatsCard
                icon={ DateIcon }
                iconColor='green'
                title={ this.props.intl.formatMessage(messages.taskLimitDate) }
                description={ MomentComponent(task.data.deadline).utc().format('DD-MM-YYYY') }
                statIcon={ DateIcon }
                statText={ `${MomentComponent(task.data.deadline).fromNow()}` }
              /> }
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
