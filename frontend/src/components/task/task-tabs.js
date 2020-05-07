import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import renderHTML from 'react-render-html'
import marked from 'marked'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from './messages/task-messages'
import RegularCard from '../Cards/RegularCard'
import Table from '../Table/Table'
import MomentComponent from 'moment'
import AssignActions from './assignment/AssignActions'
import PaymentTypeIcon from '../payment/payment-type-icon'

import {
  Card,
  AppBar,
  Tabs,
  Tab,
  Typography,
  withStyles,
  Tooltip,
  Button
} from '@material-ui/core'

import {
  Redeem as RedeemIcon,
  ShoppingBasket,
  HowToReg as GroupWorkIcon,
  SupervisedUserCircle as MembersIcon,
  Refresh as RefreshIcon,
  AttachMoney as OffersIcon,
  History as HistoryIcon,
  Cancel as CancelIcon,
  Info as InfoIcon
} from '@material-ui/icons'

import styled from 'styled-components'

import TaskPaymentCancel from './task-payment-cancel'
import TaskOrderDetails from './order/task-order-details'

const logoGithub = require('../../images/github-logo.png')

const PlaceholderDiv = styled.div`
 img {
   width: 100%;
 }
`

const styles = theme => ({
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  button: {
    width: 100,
    font: 10
  }
})

class TaskTabs extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cancelPaypalConfirmDialog: false,
      orderDetailsDialog: false,
      currentOrderId: null
    }
  }

  componentDidMount () {
    if (this.props.preloadOrder) {
      this.setState({ currendOrderId: this.props.preloadOrder }, () => {
        this.openOrderDetailsDialog({}, this.props.preloadOrder)
      })
    }
  }

  handlePayPalDialogOpen = (e, id) => {
    e.preventDefault()
    this.setState({ cancelPaypalConfirmDialog: true, currentOrderId: id })
  }

  handlePayPalDialogClose = () => {
    this.setState({ cancelPaypalConfirmDialog: false })
  }

  handleCancelPaypalPayment = async (e) => {
    e.preventDefault()
    const orderId = this.state.currentOrderId
    this.setState({ cancelPaypalConfirmDialog: false, orderDetailsDialog: false })
    await this.props.cancelPaypalPayment(orderId)
  }

  openOrderDetailsDialog = async (e, id) => {
    await this.props.getOrderDetails(id)
    this.setState({ orderDetailsDialog: true, currentOrderId: id })
  }

  closeOrderDetailsDialog = () => {
    this.setState({ orderDetailsDialog: false })
  }

  render () {
    const { task, classes, logged, isAssignOwner, user } = this.props

    const statuses = {
      open: this.props.intl.formatMessage(messages.openPaymentStatus),
      succeeded: this.props.intl.formatMessage(messages.succeededStatus),
      fail: this.props.intl.formatMessage(messages.failStatus),
      canceled: this.props.intl.formatMessage(messages.canceledStatus),
      refunded: this.props.intl.formatMessage(messages.refundedStatus)
    }

    const statusesDisplay = status => {
      const possibles = {
        open: this.props.intl.formatMessage(messages.openStatus),
        in_progress: this.props.intl.formatMessage(messages.inProgressStatus),
        closed: this.props.intl.formatMessage(messages.closed)
      }
      return possibles[status]
    }

    const retryPaypalPayment = (e, paymentUrl) => {
      e.preventDefault()

      if (paymentUrl) {
        window.location.href = paymentUrl
      }
    }

    const cancelPaypalPayment = (e, id) => {
      e.preventDefault()

      if (id) {
        this.handlePayPalDialogOpen(e, id)
      }
    }

    const assignActions = assign => {
      const task = this.props.task.data
      return <AssignActions hash={ this.props.hash } actionAssign={ this.props.actionAssign } loggedUser={ this.props.user } isOwner={ isAssignOwner() } assign={ assign } task={ task } removeAssignment={ this.props.removeAssignment } assignTask={ this.props.assignTask } messageTask={ this.props.messageTask } />
    }

    const retryPaypalPaymentButton = (paymentUrl) => {
      return (
        <Button style={ { paddingTop: 2, paddingBottom: 2, width: 'auto' } } variant='contained' size='small' color='primary' className={ classes.button } onClick={ (e) => {
          retryPaypalPayment(e, paymentUrl)
        } }>
          <FormattedMessage id='general.buttons.retry' defaultMessage='Retry' />
          <RefreshIcon style={ { marginLeft: 5, marginRight: 5 } } />
        </Button>
      )
    }

    const cancelPaypalPaymentButton = (id) => {
      return (
        <Button style={ { paddingTop: 2, paddingBottom: 2, width: 'auto' } } variant='contained' size='small' color='primary' className={ classes.button } onClick={ (e) => {
          cancelPaypalPayment(e, id)
        } }>
          <FormattedMessage id='general.buttons.cancel' defaultMessage='Cancel' />
          <CancelIcon style={ { marginLeft: 5, marginRight: 5 } } />
        </Button>
      )
    }

    const detailsOrderButton = (item, userId) => {
      if (item.provider === 'paypal') {
        if (item.User && userId === item.User.id) {
          return (
            <Button
              style={ { paddingTop: 2, paddingBottom: 2, width: 'auto', marginLeft: 5, marginRight: 5 } }
              variant='contained'
              size='small'
              color='primary'
              className={ classes.button }
              onClick={ (e) => this.openOrderDetailsDialog(e, item.id) }
            >
              <FormattedMessage id='general.buttons.details' defaultMessage='Details' />
              <InfoIcon style={ { marginLeft: 5, marginRight: 5 } } />
            </Button>
          )
        }
      }
    }

    const userRow = user => {
      return (<span>
        { user && user.profile_url
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
          ) : (
            `${user && (user.username || user.name || this.props.intl.formatMessage(messages.noUserFound))}`
          )
        }
      </span>)
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

    const retryOrCancel = (item, userId) => {
      if (item.User && item.provider === 'paypal' && userId === item.User.id) {
        if ((item.status === 'fail' || item.status === 'open') && item.payment_url) {
          return retryPaypalPaymentButton(item.payment_url)
        }
        else if (item.status === 'succeeded') {
          return cancelPaypalPaymentButton(item.id)
        }
        else {
          return ''
        }
      }
    }

    const displayOrders = orders => {
      if (!orders) return []

      if (!orders.length) {
        return []
      }

      let userId

      if (logged) {
        userId = user.id
      }

      return orders.map((item, i) => [
        item.paid ? this.props.intl.formatMessage(messages.labelYes) : this.props.intl.formatMessage(messages.labelNo),
        <div style={ { display: 'inline-block' } }>
          <span style={ { display: 'inline-block', width: '100%', marginRight: '1rem', marginBottom: '1em' } }>{ statuses[item.status] }</span>
          { detailsOrderButton(item, userId) }
          { retryOrCancel(item, userId) }
        </div>,
        `$ ${item.amount}`,
        MomentComponent(item.updatedAt).fromNow(),
        userRow(item.User),
        <PaymentTypeIcon type={ item.provider } />
      ])
    }

    const displayMembers = members => {
      if (!members) return []
      if (!members.length) {
        return []
      }
      return members.map((item, i) => [
        item.User.username,
        item.Role && item.Role.label,
        ''
      ])
    }

    const displayOffers = offers => {
      if (!offers) return []
      if (!offers.length) {
        return []
      }
      return offers.map((item, i) => [
        item.User && userRow(item.User),
        `$ ${item.value}`,
        item.suggestedDate ? MomentComponent(item.suggestedDate).fromNow() : ' - ',
        MomentComponent(item.updatedAt).fromNow()
      ])
    }

    const historyUpdates = item => {
      const statement = 'The issue was updated with a new '
      const itemFields = item.fields.map((f, i) => {
        return { field: f, oldValue: item.oldValues[i], newValue: item.newValues[i] }
      })
      const valuesToRemove = ['updatedAt', 'id']
      const filteredItems = itemFields.filter(item => !valuesToRemove.includes(item.field))
      if (filteredItems.length) {
        return filteredItems.map((f, i) => {
          if (f.field === 'deadline') return `${statement} ${f.field} ${MomentComponent(f.oldValue).isValid() ? `from ${MomentComponent(f.oldValue).fromNow()}` : ''} to ${MomentComponent(f.newValue).fromNow()} `
          if (f.field === 'value') return `${statement} ${f.field} ${f.oldValue ? `from $${f.oldValue}` : ''} to $${f.newValue}`
          if (f.field === 'status') return `${statement} ${f.field} ${f.oldValue ? `from ${statusesDisplay(f.oldValue)}` : ''} to ${f.newValue ? statusesDisplay(f.newValue) : ' '}`
          if (f.field === 'assigned') {
            const oldUserAssigned = f.oldValue && task.data.assigns.filter(a => a.id === parseInt(f.oldValue))[0]
            if (f.newValue === 'null') return `The issue was updated with an unassignment of the user ${oldUserAssigned.User.username || oldUserAssigned.User.name || ' - '}`
            const newUserAssigned = f.newValue && task.data.assigns.filter(a => a.id === parseInt(f.newValue))[0]
            return `${statement} ${f.field} ${f.oldValue && oldUserAssigned ? `from ${oldUserAssigned.User.username || oldUserAssigned.User.name || ' - '}` : ''} to ${newUserAssigned.User.username || newUserAssigned.User.name || ' - '}`
          }
          return `${statement} ${f.field} ${f.oldValue ? `from ${f.oldValue}` : ' '} to ${f.newValue} `
        })
      }
      else {
        return null
      }
    }

    const historyCreate = item => {
      const fields = item.fields.map((f, i) => {
        if (f === 'userId') return `User: ${user.name || user.username}`
        return `${f}: ${item.newValues[i]}`
      })
      return `A new issue was created with ${fields.join(', ')}`
    }

    const displayHistory = history => {
      if (!history) return []
      if (!history.length) {
        return []
      }
      return history.map((item, i) => [
        item && item.fields && item.oldValues && item.newValues && item.type === 'create'
          ? historyCreate(item)
          : historyUpdates(item),
        MomentComponent(item.updatedAt).fromNow()
      ])
    }

    const TabContainer = props => {
      return (
        <Typography component='div' style={ { padding: 8 * 3 } }>
          { props.children }
        </Typography>
      )
    }

    return (
      <div>
        <AppBar position='static' color='default'>
          <Tabs
            value={ task.tab }
            onChange={ this.props.handleTabChange }
            scrollable
            scrollButtons='on'
            indicatorColor='primary'
            textColor='primary'
          >
            <Tab label={ this.props.intl.formatMessage(messages.taskLabel) } icon={ <RedeemIcon /> } />
            <Tab label={ this.props.intl.formatMessage(messages.orderLabel) } icon={ <ShoppingBasket /> } />
            <Tab label={ this.props.intl.formatMessage(messages.interestedLabel) } icon={ <GroupWorkIcon /> } />
            <Tab label={ this.props.intl.formatMessage(messages.membersLabel) } icon={ <MembersIcon /> } />
            <Tab label={ this.props.intl.formatMessage(messages.offersLabel) } icon={ <OffersIcon /> } />
            <Tab label={ this.props.intl.formatMessage(messages.historyLabel) } icon={ <HistoryIcon /> } />
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
                  { task.data.metadata ? renderHTML(marked(task.data.metadata.issue.body)) : 'Description not available' }
                </PlaceholderDiv>
              </ReactPlaceholder>
            </Typography>
          </Card>
        </TabContainer>
        }
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
                ] }
                tableData={ task.data.orders && task.data.orders.length ? displayOrders(task.data.orders) : [] }
              />
            }
          />
        </div>
        }
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
                tableData={ task && task.data.assigns && task.data.assigns.length ? displayAssigns(task.data.assigns) : [] }
              />
            }
          />
        </div>
        }
        { task.tab === 3 &&
        <div style={ { marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20 } }>
          <RegularCard
            headerColor='green'
            cardTitle={ this.props.intl.formatMessage(messages.membersCardTitle) }
            cardSubtitle={ this.props.intl.formatMessage(messages.membersCardSubTitle) }
            content={
              <Table
                tableHeaderColor='warning'
                tableHead={ [
                  this.props.intl.formatMessage(messages.membersTableLabelUser),
                  this.props.intl.formatMessage(messages.membersTableLabelRole),
                  this.props.intl.formatMessage(messages.membersTableLabelActions)
                ] }
                tableData={ task.data.members && task.data.members.length ? displayMembers(task.data.members) : [] }
              />
            }
          />
        </div>
        }
        { task.tab === 4 &&
        <div style={ { marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20 } }>
          <RegularCard
            headerColor='green'
            cardTitle={ this.props.intl.formatMessage(messages.offersCardTitle) }
            cardSubtitle={ this.props.intl.formatMessage(messages.offersCardSubTitle) }
            content={
              <Table
                tableHeaderColor='warning'
                tableHead={ [
                  this.props.intl.formatMessage(messages.offersTableLabelUser),
                  this.props.intl.formatMessage(messages.offersTableLabelValue),
                  this.props.intl.formatMessage(messages.offersTableLabelDeadline),
                  this.props.intl.formatMessage(messages.offersTableLabelCreated)
                ] }
                tableData={ task.data.offers && task.data.offers.length ? displayOffers(task.data.offers) : [] }
              />
            }
          />
        </div>
        }
        { task.tab === 5 &&
        <div style={ { marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20 } }>
          <RegularCard
            headerColor='green'
            cardTitle={ this.props.intl.formatMessage(messages.historyCardTitle) }
            cardSubtitle={ this.props.intl.formatMessage(messages.historyCardSubTitle) }
            content={
              <Table
                tableHeaderColor='warning'
                tableHead={ [
                  this.props.intl.formatMessage(messages.historyTableLabelEntry),
                  this.props.intl.formatMessage(messages.historyTableLabelCreated)
                ] }
                tableData={ task.data.histories && task.data.histories.length ? displayHistory(task.data.histories) : [] }
              />
            }
          />
        </div>
        }
        <TaskPaymentCancel
          cancelPaypalConfirmDialog={ this.state.cancelPaypalConfirmDialog }
          handlePayPalDialogClose={ this.handlePayPalDialogClose }
          handleCancelPaypalPayment={ this.handleCancelPaypalPayment }
        />
        <TaskOrderDetails
          open={ this.state.orderDetailsDialog }
          order={ this.props.order }
          onClose={ this.closeOrderDetailsDialog }
          onCancel={ this.handlePayPalDialogOpen }
        />
      </div>
    )
  }
}

TaskTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  task: PropTypes.object,
  handleTabChange: PropTypes.func,
  user: PropTypes.object,
  isAssignOwner: PropTypes.func,
  logged: PropTypes.bool,
  removeAssignment: PropTypes.func,
  assignTask: PropTypes.func,
  messageTask: PropTypes.func
}

export default injectIntl(withStyles(styles)(TaskTabs))
