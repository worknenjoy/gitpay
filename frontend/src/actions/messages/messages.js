import { defineMessages } from 'react-intl'

const messages = defineMessages({
  noDefined: {
    id: 'task.table.date.none',
    defaultMessage: 'Not yet defined'
  },
  noBounty: {
    id: 'task.table.value.none',
    defaultMessage: 'No bounty added'
  },
  onHoverTaskProvider: {
    id: 'task.table.onHover',
    defaultMessage: 'See on'
  },
  notificationLoginSuccessfull: {
    id: 'user.login.successfull',
    defaultMessage: 'You successfully logged in'
  },
  notificationLoginError: {
    id: 'user.login.error',
    defaultMessage: 'We could not log to your account'
  },
  notificationRegisterSuccessful: {
    id: 'user.register.successfull',
    defaultMessage: 'You\'re now registered on our platform, now you can log in with your credentials'
  },
  notificationRegisterError: {
    id: 'user.register.error',
    defaultMessage: 'There\'s was an error to create user'
  },
  notificationUserExist: {
    id: 'user.exist',
    defaultMessage: 'This user already exist. Please login'
  },
  notificationLogout: {
    id: 'user.logout',
    defaultMessage: 'You have logged out of your account.'
  },
  notifactionAssignTaskSucess: {
    id: 'actions.assign.task.sucess',
    defaultMessage: 'This task was updated successfully!'
  },
  userForgotPasswordSuccessfull: {
    id: 'user.forgot.password.successfull',
    defaultMessage: 'We have sent you an email with instructions to reset your password'
  },
  userForgotPasswordError: {
    id: 'user.forgot.password.error',
    defaultMessage: 'We could not send you an email to reset your password'
  },
  userResetPasswordSuccessfull: {
    id: 'user.reset.password.successfull',
    defaultMessage: 'Your password was changed successfully'
  },
  userResetPasswordError: {
    id: 'user.reset.password.error',
    defaultMessage: 'We could not change your password'
  },
  userSearchError: {
    id: 'user.search.error',
    defaultMessage: 'We had an error to find this user'
  },
  notificationAssignTaskError: {
    id: 'actions.assign.task.error',
    defaultMessage: 'We could not update this task.'
  },
  notificationMessageTaskError: {
    id: 'actions.message.task.error',
    defaultMessage: 'We have an issue to send your message. Please try again later'
  },
  notificationMessageTaskSucess: {
    id: 'actions.message.task.sucess',
    defaultMessage: 'Your message was sent successfully'
  },
  notificationTaskRemoveAssignSuccess: {
    id: 'action.task.remove.assign.success',
    defaultMessage: 'This task was unassigned successfully!'
  },
  notificationTaskRemoveAssignError: {
    id: 'action.task.remove.assign.error',
    defaultMessage: 'We could not unassign this user from this task'
  },
  notificationMessageRecruitersSuccess: {
    id: 'actions.message.recruiters.success',
    defaultMessage: 'Thanks for your message, we will contact you soon'
  },
  notificationMessageRecruitersError: {
    id: 'actions.message.recruiters.error',
    defaultMessage: 'There was an issue to send this message, please try again later'
  },
  notificationOrderCreateError: {
    id: 'actions.order.create.error',
    defaultMessage: 'We could not create this payment'
  },
  notificationOrderCreatePaymentError: {
    id: 'actions.order.create.payment.error',
    defaultMessage: 'We could not process the payment for this task'
  },
  notificationOrderCreatePaymentSendSuccess: {
    id: 'actions.order.create.payment.send.success',
    defaultMessage: 'Payment completed successfully'
  },
  notificationOrderCreatePaymentSendError: {
    id: 'actions.order.create.payment.send.error',
    defaultMessage: 'We could not process this payment'
  },
  notificationOrderTransferSuccess: {
    id: 'actions.order.transfer.success',
    defaultMessage: 'The order was transfered successfully'
  },
  notificationOrderTransferError: {
    id: 'actions.order.transfer.error',
    defaultMessage: 'We could not make this transfer, try again later'
  },
  notificationOrderCancelSuccess: {
    id: 'actions.order.cancel.success',
    defaultMessage: 'Your payment was canceled successfully'
  },
  notificationOrderCancelError: {
    id: 'actions.order.cancel.error',
    defaultMessage: 'We could not cancel this payment'
  },
  notificationRefundSuccess: {
    id: 'actions.order.refund.success',
    defaultMessage: 'Your payment was refunded successfully'
  },
  notificationOrderRefundError: {
    id: 'actions.order.refund.error',
    defaultMessage: 'We could not cancel this refund'
  },
  notificationTaskCreateNotificationSuccess: {
    id: 'actions.task.create.notification.success',
    defaultMessage: 'Task created successfully'
  },
  notificationTaskSolutionCreateNotificationSuccess: {
    id: 'task.solution.dialog.create.success',
    defaultMessage: 'Task solution created successfully'
  },
  notificationTaskSoluctionUpdateNotificationSuccess: {
    id: 'task.solution.dialog.update.success',
    defaultMessage: 'Task solution updated successfully'
  },
  notificationTaskCreateNotificationError: {
    id: 'actions.task.create.notification.error',
    defaultMessage: 'Error to update task'
  },
  notificationTaskCreateAuthError: {
    id: 'actions.task.create.auth.error',
    defaultMessage: 'You need to login first to create a task'
  },
  notificationTaskPaymentNotificationSuccess: {
    id: 'actions.task.payment.notification.success',
    defaultMessage: 'Your payment was completed successfully'
  },
  notificationTaskPaymentNotificationError: {
    id: 'actions.task.payment.notification.error',
    defaultMessage: 'We had a error to process this payment'
  },
  notificationTaskInterestedNotificationSuccess: {
    id: 'actions.task.interested.notification.success',
    defaultMessage: 'You add as interested for this task sucessfully'
  },
  notificationTaskUpdateNotificationSuccess: {
    id: 'actions.task.update.notification.success',
    defaultMessage: 'Task updated successfully'
  },
  notificationTaskDeadlineClear: {
    id: 'actions.task.deadline.clear',
    defaultMessage: 'Deadline has been removed'
  },
  notificationTaskUpdateNotificationError: {
    id: 'actions.task.update.notification.error',
    defaultMessage: 'Error on task update'
  },
  notificationTaskDeleteNotificationSuccess: {
    id: 'actions.task.delete.notification.success',
    defaultMessage: 'Task deleted successfully'
  },
  notificationTaskDeleteNotificationError: {
    id: 'actions.task.delete.notification.error',
    defaultMessage: 'Error to delete task'
  },
  notificationTaskDeleteAuthError: {
    id: 'actions.task.delete.auth.error',
    defaultMessage: 'You need to login first to delete a task'
  },
  notificationTaskFetchError: {
    id: 'actions.task.fetch.error',
    defaultMessage: 'We could not obtain this task, please try again later'
  },
  notificationTaskFetchUnavailable: {
    id: 'actions.task.fetch.unavailable',
    defaultMessage: 'Task unavailable'
  },
  notificationTaskFetchOtherError: {
    id: 'actions.task.fetch.other.error',
    defaultMessage: 'We could not obtain this task, please try again later'
  },
  notificationTaskPaymentBalanceError: {
    id: 'actions.task.payment.balance.error',
    defaultMessage: 'This price is not available for this task yet'
  },
  notificationTaskPaymentBalanceOtherError: {
    id: 'actions.task.payment.balance.other.error',
    defaultMessage: 'We had a issue to make this transfer'
  },
  notificationTaskPaymentTransferSucess: {
    id: 'actions.task.payment.transfer.sucess',
    defaultMessage: 'The transfer was completed successfully!'
  },
  notificationTaskTransferUpdateSuccess: {
    id: 'actions.transfer.update.success',
    defaultMessage: 'Transfer updated successfully'
  },
  notificationTaskTransferUpdateError: {
    id: 'actions.transfer.update.error',
    defaultMessage: 'We could not update this transfer'
  },
  notificationTaskPaymentErrorSend: {
    id: 'actions.task.payment.error.send',
    defaultMessage: 'We could not process the payment for this task'
  },
  notificationTaskInviteSuccess: {
    id: 'actions.task.invite.success',
    defaultMessage: 'Invite sent'
  },
  notificationTaskInviteError: {
    id: 'actions.task.invite.error',
    defaultMessage: 'We could not send this invite'
  },
  notificationTaskMessageAuthorSuccess: {
    id: 'actions.task.message.author.success',
    defaultMessage: 'Your message was sent successfully'
  },
  notificationTaskMessageAuthorError: {
    id: 'actions.task.message.author.error',
    defaultMessage: 'We could not send this message'
  },
  notificationTaskReportSuccess: {
    id: 'actions.task.report.success',
    defaultMessage: 'Task successfuly reported'
  },
  notificationTaskReportError: {
    id: 'actions.task.report.error',
    defaultMessage: 'Error in reporting task'
  },
  notificationUserAccountExist: {
    id: 'actions.user.account.exist',
    defaultMessage: 'There\'s already an account created for this user'
  },
  notificationUserAccountCreateSuccess: {
    id: 'actions.user.account.create.success',
    defaultMessage: 'You successfully created your account to receive payments'
  },
  notificationUserAccountCreateError: {
    id: 'actions.user.account.create.error',
    defaultMessage: 'Your account could not be created'
  },
  notificationUserAccountUpdateSuccess: {
    id: 'actions.user.account.update.success',
    defaultMessage: 'Your account was updated successfully'
  },
  notificationUserAccountUpdateErrorMissing: {
    id: 'actions.user.account.update.error.missing',
    defaultMessage: 'We had an issue to update your account. Please review the information provided'
  },
  notificationAccountUpdateSuccess: {
    id: 'notifications.account.update',
    defaultMessage: 'Your user was updated sucessfully'
  },
  notificationAccountActivateSuccess: {
    id: 'notifications.account.activate',
    defaultMessage: 'Your account was activated sucessfully'
  },
  notificationAccountActivateError: {
    id: 'notifications.account.activate.error',
    defaultMessage: 'We could not activate your account'
  },
  notificationAccountUpdateError: {
    id: 'notifications.account.update.error',
    defaultMessage: 'We could not create your account'
  },
  notificationAccountResendActivation: {
    id: 'notifications.account.resend_activation_email.success',
    defaultMessage: 'We sent you an email with instructions to activate your account'
  },
  notificationAccountResendActivationError: {
    id: 'notifications.account.resend_activation_email.error',
    defaultMessage: 'We could not send you an email to activate your account'
  },
  notificationProfileSettingsDeleteUserNotificationError: {
    id: 'account.profile.settings.delete.user.notification.error',
    defaultMessage: 'We could not delete your account'
  },
  notificationBankGetSuccess: {
    id: 'notifications.bank.get.success',
    defaultMessage: 'We could not obtain your bank account data'
  },
  notificationBankGetError: {
    id: 'notifications.bank.get.error',
    defaultMessage: 'We could not obtain your bank account data'
  },
  notificationBankCreateError: {
    id: 'notifications.bank.create.error',
    defaultMessage: 'We could not create your account'
  },
  notificationBankCreateSuccess: {
    id: 'notifications.bank.create.success',
    defaultMessage: 'Your bank account was registered successfully'
  },
  notificationBankCreateOtherError: {
    id: 'notifications.bank.create.other.error',
    defaultMessage: 'We could not update your account'
  },
  notificationPaymentMessageError: {
    id: 'payment.message.error',
    defaultMessage: 'We couldn\'t process your payment'
  },
  notificationUserInvalid: {
    id: 'user.invalid',
    defaultMessage: 'Invalid e-mail and / or password, please try again'
  },
  notificationOrderSuccess: {
    id: 'task.order.payment.success',
    defaultMessage: 'Your order was completed successfully'
  },
  notificationOrderError: {
    id: 'task.order.payment.error',
    defaultMessage: 'We had a issue to process your payment'
  },
  notificationTaskStatusForbidden: {
    id: 'actions.task.status.forbidden',
    defaultMessage: 'You cannot change the status from this task'
  },
  notificationTaskClaimSuccess: {
    id: 'actions.task.claim.success',
    defaultMessage: 'Issue successfuly claimed'
  },
  notificationTaskClaimError: {
    id: 'actions.task.claim.error',
    defaultMessage: 'Error on claim issue'
  },
  notificationTaskClaimErrorInvalidProvider: {
    id: 'actions.task.claim.error.invalid_provider',
    defaultMessage: 'Invalid provider'
  },
  notificationTaskClaimErrorUserIsNotTheOwner: {
    id: 'actions.task.claim.error.user_is_not_the_owner',
    defaultMessage: 'You cannot claim this issue because you\'re not the Owner.'
  },
  notificationActionOfferUpdateError: {
    id: 'actions.offer.update.error',
    defaultMessage: 'We could not update this offer'
  },
  notificationActionOfferUpdateSucess: {
    id: 'actions.offer.update.sucess',
    defaultMessage: 'Offer updated successfully'
  },
  notificationIssueAlreadyExist: {
    id: 'actions.task.create.validation.url',
    defaultMessage: 'This issue was imported already'
  },
  notificationIssueLimitExceeded: {
    id: 'actions.task.create.validation.limit',
    defaultMessage: 'Github API rate limit exceeded, please try again later'
  },
  notificationIssueNotFound: {
    id: 'actions.task.issues.error.notfound',
    defaultMessage: 'Issue not found'
  },
})

export default messages
