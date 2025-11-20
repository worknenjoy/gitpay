import { defineMessages } from 'react-intl'

// messages for translations on Crowdin - https://crowdin.com/project/gitpay
export const messages = defineMessages({
  tableHeaderTask: {
    id: 'task.table.head.task',
    defaultMessage: 'Issue'
  },
  tableHeaderStatus: {
    id: 'task.table.head.status',
    defaultMessage: 'Status'
  },
  tableHeaderProject: {
    id: 'task.table.head.project',
    defaultMessage: 'Project'
  },
  tableHeaderValue: {
    id: 'task.table.head.value',
    defaultMessage: 'Value'
  },
  tableHeaderDeadline: {
    id: 'task.table.head.deadline',
    defaultMessage: 'Deadline'
  },
  tableHeaderLabels: {
    id: 'task.table.head.labels',
    defaultMessage: 'Labels'
  },
  tableHeaderCreatedAt: {
    id: 'task.table.head.createdAt',
    defaultMessage: 'Created'
  },
  firstPageLabel: {
    id: 'task.table.page.first',
    defaultMessage: 'First page'
  },
  previousPageLabel: {
    id: 'task.table.page.previous',
    defaultMessage: 'Previous page'
  },
  nextPageLabel: {
    id: 'task.table.page.next',
    defaultMessage: 'Next page'
  },
  lastPageLabel: {
    id: 'task.table.page.last',
    defaultMessage: 'Last page'
  },
  noDefined: {
    id: 'task.table.date.none',
    defaultMessage: 'Not yet defined'
  },
  noBounty: {
    id: 'task.table.value.none',
    defaultMessage: 'No bounty added'
  },
  noAmountDefined: {
    id: 'task.table.amount.none',
    defaultMessage: 'No amount defined'
  },
  onHoverTaskProvider: {
    id: 'task.table.onHover',
    defaultMessage: 'See on'
  },
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
  expiredStatus: {
    id: 'task.status.filter.payment.expired',
    defaultMessage: 'Payment expired'
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
    id: 'task.orders.label',
    defaultMessage: 'Payments'
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
    id: 'task.card.payments.title',
    defaultMessage: 'Payments on Gitpay'
  },
  cardSubtitle: {
    id: 'task.card.subtitle',
    defaultMessage: 'This payments will be transferred after the task be finished'
  },
  cardTableHeaderNumber: {
    id: 'task.table.head.number',
    defaultMessage: 'Number'
  },
  cardTableHeaderId: {
    id: 'task.table.head.id',
    defaultMessage: 'ID'
  },
  cardTableHeaderPaid: {
    id: 'task.card.table.header.paid',
    defaultMessage: 'Paid'
  },
  cardTableHeaderStatus: {
    id: 'task.card.table.header.status',
    defaultMessage: 'Status'
  },
  cardTableHeaderActions: {
    id: 'task.card.table.header.actions',
    defaultMessage: 'Actions'
  },
  cardTableHeaderIssue: {
    id: 'task.card.table.header.issue',
    defaultMessage: 'Issue'
  },
  cardTableHeaderValue: {
    id: 'task.card.table.header.value',
    defaultMessage: 'Value'
  },
  cardTableHeaderMethod: {
    id: 'task.card.table.header.method',
    defaultMessage: 'Method'
  },
  cardTableHeaderCreated: {
    id: 'task.card.table.header.payment.created',
    defaultMessage: 'Created'
  },
  cardTableHeaderIssue: {
    id: 'task.card.table.header.issue',
    defaultMessage: 'Issue'
  },
  cardTableHeaderPayment: {
    id: 'task.card.table.header.payment.type',
    defaultMessage: 'Type'
  },
  cardTableHeaderDueDate: {
    id: 'task.card.table.header.due.date',
    defaultMessage: 'Due date'
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

export default messages
