import { defineMessages } from 'react-intl'

// messages for translations on Crowdin - https://crowdin.com/project/gitpay
export const messages = defineMessages({
  openPaymentStatus: {
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
  canceledStatus: {
    id: 'task.status.filter.payment.canceled',
    defaultMessage: 'Payment canceled'
  },
  refundedStatus: {
    id: 'task.status.filter.payment.refunded',
    defaultMessage: 'Payment refunded'
  },
  openStatus: {
    id: 'task.status.filter.open',
    defaultMessage: 'Open'
  },
  inProgressStatus: {
    id: 'task.status.filter.progress',
    defaultMessage: 'In progress'
  },
  closed: {
    id: 'task.status.filter.close',
    defaultMessage: 'Finished'
  },
  issuesWithBounties: {
    id: 'task.status.filter.issuesWithBounties',
    defaultMessage: '$'
  },
  contribution: {
    id: 'task.status.filter.contribution',
    defaultMessage: 'Contribution'
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
  membersLabel: {
    id: 'task.tab.members',
    defaultMessage: 'Members'
  },
  offersLabel: {
    id: 'task.tab.offers',
    defaultMessage: 'Offers'
  },
  historyLabel: {
    id: 'task.tab.history',
    defaultMessage: 'History'
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
  membersCardTitle: {
    id: 'task.members.table.label.title',
    defaultMessage: 'Members of this task'
  },
  membersCardSubTitle: {
    id: 'task.members.table.label.subtitle',
    defaultMessage: 'When you create a task on Gitpay, it import members and original owners'
  },
  membersTableLabelUser: {
    id: 'task.members.table.label.user',
    defaultMessage: 'User'
  },
  membersTableLabelRole: {
    id: 'task.members.table.label.role',
    defaultMessage: 'Role'
  },
  membersTableLabelActions: {
    id: 'task.members.table.label.actions',
    defaultMessage: 'Actions'
  },
  offersCardTitle: {
    id: 'task.offers.table.label.title',
    defaultMessage: 'Offers for this issue'
  },
  offersCardSubTitle: {
    id: 'task.offers.table.label.subtitle',
    defaultMessage: 'Offers for this issue from users'
  },
  offersTableLabelUser: {
    id: 'task.offers.table.label.user',
    defaultMessage: 'User'
  },
  offersTableLabelValue: {
    id: 'task.offers.table.label.value',
    defaultMessage: 'Value'
  },
  offersTableLabelDeadline: {
    id: 'task.offers.table.label.deadline',
    defaultMessage: 'Suggested deadline'
  },
  offersTableLabelCreated: {
    id: 'task.offers.table.label.created',
    defaultMessage: 'Created at'
  },
  historyCardTitle: {
    id: 'task.history.table.label.title',
    defaultMessage: 'History about this issue'
  },
  historyCardSubTitle: {
    id: 'task.history.table.label.subtitle',
    defaultMessage: 'Updates about this issue'
  },
  historyTableLabelEntry: {
    id: 'task.history.table.label.entry',
    defaultMessage: 'Updates about this issue'
  },
  historyTableLabelCreated: {
    id: 'task.history.table.label.created',
    defaultMessage: 'Updated at'
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
  },
  taskValueLabelNoBounty: {
    id: 'task.status.value.none',
    defaultMessage: 'No bounty added'
  }
})
