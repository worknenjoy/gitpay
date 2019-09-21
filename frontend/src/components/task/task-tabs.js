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
  SupervisedUserCircle as Members,
  Refresh as RefreshIcon
} from '@material-ui/icons'

import styled from 'styled-components'

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
  render () {
    const { task, classes, logged, isAssignOwner, user } = this.props

    const statuses = {
      open: this.props.intl.formatMessage(messages.openStatus),
      succeeded: this.props.intl.formatMessage(messages.succeededStatus),
      fail: this.props.intl.formatMessage(messages.failStatus)
    }

    const retryPaypalPayment = (e, paymentUrl) => {
      e.preventDefault()

      if (paymentUrl) {
        window.location.href = paymentUrl
      }
    }

    const assignActions = assign => {
      const task = this.props.task.data
      return <AssignActions isOwner={ isAssignOwner() } assign={ assign } task={ task } removeAssignment={ this.props.removeAssignment } assignTask={ this.props.assignTask } />
    }

    const retryPaypalPaymentButton = (paymentUrl, status) => {
      return (
        <div style={ { display: 'inline-block' } }>
          <span style={ { marginRight: '1rem' } }>{ status }</span>
          <Button style={ { paddingTop: 2, paddingBottom: 2, width: 'auto' } } variant='contained' size='small' color='primary' className={ classes.button } onClick={ (e) => {
            retryPaypalPayment(e, paymentUrl)
          } }>
            <RefreshIcon />
          </Button>
        </div>
      )
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

    const displayOrders = orders => {
      if(!orders) return []
      
      if (!orders.length) {
        return []
      }

      let userId

      if (logged) {
        userId = user.id
      }

      return orders.map((item, i) => [
        item.paid ? this.props.intl.formatMessage(messages.labelYes) : this.props.intl.formatMessage(messages.labelNo),
        item.status === 'fail' && item.payment_url && userId === item.User.id ? retryPaypalPaymentButton(item.payment_url, statuses[item.status]) : statuses[item.status] || this.props.intl.formatMessage(messages.unprocessed),
        `$ ${item.amount}`,
        MomentComponent(item.updatedAt).fromNow(),
        userRow(item.User),
        <PaymentTypeIcon type={ item.provider } />
      ])
    }

    const displayMembers = members => {
      if (!members.length) {
        return []
      }
      return members.map((item, i) => [
        item.User.username,
        item.Role && item.Role.label,
        ''
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
            <Tab label={ this.props.intl.formatMessage(messages.membersLabel) } icon={ <Members /> } />
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
                tableData={ task.data.assigns.length ? displayAssigns(task.data.assigns) : [] }
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
  assignTask: PropTypes.func
}

export default injectIntl(withStyles(styles)(TaskTabs))
