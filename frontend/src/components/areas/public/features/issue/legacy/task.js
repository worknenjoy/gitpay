import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl, FormattedMessage } from 'react-intl'
import MomentComponent from 'moment'
import { Skeleton } from '@mui/material'
import { styled } from '@mui/material/styles'

import { messages } from '../../../../../../messages/messages'
import TaskInviteCard from '../../../../../design-library/molecules/cards/issue-cards/issue-invite-card/issue-invite-card'
import queryString from 'query-string'

import {
  Avatar,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Button,
  Link,
  DialogContentText,
  MobileStepper,
  Fab,
  Collapse
} from '@mui/material'

import {
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  CreditCard as BountyIcon,
  Gavel as OfferIcon,
  Redeem as RedeemIcon,
  EmojiFoodBeverage as CoffeeIcon
} from '@mui/icons-material'

import OfferDrawer from 'design-library/molecules/drawers/offer-drawer/offer-drawer'
import IssueActionsByRole from '../../../../../design-library/atoms/buttons/issue-actions-by-role/issue-actions-by-role'
import TopBarContainer from '../../../../../../containers/topbar'
import Bottom from '../../../../../../containers/bottom'
import LoginButton from '../../../../private/components/session/login-button'
import TaskPaymentForm from '../../../../../design-library/molecules/drawers/issue-payment-drawer/issue-payment-drawer'
import TaskPayments from '../../../../../design-library/molecules/lists/issue-payments-list/issue-payments-list'
import TaskLevelSplitButton from '../../../../../design-library/atoms/inputs/dropdowns/issue-level-dropdown/issue-level-dropdown'
import TaskOfferDrawer from '../../../../../design-library/molecules/drawers/issue-offer-drawer/issue-offer-drawer'
import TaskStatusIcons from '../../../../../design-library/atoms/status/issue-public-status/issue-public-status'
import Constants from '../../../../../../consts'
import TaskDeadlineDrawer from 'design-library/molecules/drawers/task-deadline-drawer/task-deadline-drawer'
import IssueContent from 'design-library/molecules/content/issue-content/issue-content'

import taskCover from 'images/task-cover.png'
import inviteCover from 'images/funds.png'

import bounty from 'images/bounty.png'
import sharing from 'images/sharing.png'
import notifications from 'images/notifications.png'

// Styled components
const SidebarGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: '#eee',
  padding: 25,
  [theme.breakpoints.down('sm')]: {
    padding: 15
  }
}))

const SidebarSection = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  marginTop: 20,
  marginBottom: 20,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  }
}))

const SidebarItem = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: 15,
    maxWidth: '100%'
  }
}))

const TaskInfoContent = styled('div')(({ theme }) => ({
  verticalAlign: 'super',
  marginLeft: 5,
  marginTop: 10,
  display: 'inline-block',
  textAlign: 'middle'
}))

const StatusChip = styled(Chip, { shouldForwardProp: (prop) => prop !== 'status' })(
  ({ theme, status }) => ({
    marginBottom: theme.spacing(1),
    backgroundColor: 'transparent',
    color: status === 'closed' ? theme.palette.error.main : theme.palette.primary.success
  })
)

const StatusAvatarDot = styled(Avatar, { shouldForwardProp: (prop) => prop !== 'status' })(
  ({ theme, status }) => ({
    backgroundColor: status === 'closed' ? theme.palette.error.main : theme.palette.primary.success
  })
)

const SpanText = styled('span')(() => ({
  display: 'inline-block',
  verticalAlign: 'middle'
}))

function Task(props) {
  const {
    task,
    project,
    order,
    noTopBar,
    noBottomBar,
    match,
    history,
    location,
    logged,
    user,

    // actions
    syncTask,
    fetchTask,
    updateTask,
    deleteTask,
    addNotification,
    actionAssign,
    inviteTask,
    fundingInviteTask,
    messageAuthor,
    reportTask,
    requestClaimTask,
    createOrder,
    openDialog,
    closeDialog,
    fetchCustomer,
    customer,
    listWallets,
    wallets,
    fetchWallet,
    wallet,
    offerUpdate,
    assignTask,
    messageOffer
  } = props

  const intl = useIntl()

  const [deadline, setDeadline] = useState(null)
  const [assigned, setAssigned] = useState(null)
  const [finalPrice, setFinalPrice] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [interestedComment, setInterestedComment] = useState('')
  const [interestedLearn, setInterestedLearn] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [confirmOffer, setConfirmOffer] = useState(false)
  const [priceConfirmed, setPriceConfirmed] = useState(false)
  const [orderPrice, setOrderPrice] = useState(0)
  const [assignDialog, setAssignDialog] = useState(false)
  const [statusDialog, setStatusDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [termsDialog, setTermsDialog] = useState(false)
  const [paymentForm, setPaymentForm] = useState(false)
  const [deadlineForm, setDeadlineForm] = useState(false)
  const [taskPaymentDialog, setTaskPaymentDialog] = useState(false)
  const [taskInviteDialog, setTaskInviteDialog] = useState(false)
  const [taskFundingDialog, setTaskFundingDialog] = useState(false)
  const [taskSolveDialog, setTaskSolveDialog] = useState(false)
  const [taskMessageAuthorDialog, setTaskMessageAuthorDialog] = useState(false)
  const [assignIssueDialog, setAssignIssueDialog] = useState(false)
  const [reportIssueDialog, setReportIssueDialog] = useState(false)
  const [taskClaimDialog, setTaskClaimDialog] = useState(false)
  const [notification, setNotification] = useState({ open: false, message: 'loading' })
  const [showSuggestAnotherDateField, setShowSuggestAnotherDateField] = useState(false)
  const [charactersCount, setCharactersCount] = useState(0)
  const [maxWidth, setMaxWidth] = useState('md')
  const [isFirstTask, setIsFirstTask] = useState(false)
  const [firstTaskSteps, setFirstTaskSteps] = useState(0)
  const [fundingInvite, setFundingInvite] = useState({ email: '', comment: '' })
  const [interestedSuggestedDate, setInterestedSuggestedDate] = useState(null)

  const taskOwner = useCallback(() => {
    const t = task
    const creator = logged && t.data?.User && user?.id === t.data.User.id
    const owner =
      t.data?.members && t.data.members.length
        ? t.data.members.filter((m) => m.User.id === user?.id).length > 0
        : false
    return creator || owner
  }, [logged, task, user])

  useEffect(() => {
    const run = async () => {
      const id = match.params.id
      const status = match.params.status
      const orderId = match.params.order_id // not used here
      const slug = match.params.slug // not used here

      try {
        await syncTask(id)
        await fetchTask(id)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('error to sync', e)
      }

      if (status) {
        if (id && logged && task.data.user && logged.user.id === task.data.user.id) {
          await updateTask({ id, status })
        } else {
          addNotification('actions.task.status.forbidden')
          history.push(`/task/${id}`)
        }
      }

      if (history && history.location.pathname.startsWith(`/task/${id}/claim`)) {
        if (logged) {
          const params = queryString.parse(location.search)
          requestClaimTask(id, user.id, params.comments, true, params.token, history)
        }
      }

      const assign_id = match.params.interested_id
      const hash = location.hash
      const isOfferPage = match.path === '/profile/task/:id/offers'

      if (isOfferPage) {
        setAssignDialog(true)
      }

      if (hash === '#task-solution-dialog') {
        setTaskSolveDialog(true)
      }

      if (hash === '#accept' || hash === '#reject') {
        setTaskPaymentDialog(true)

        if (assign_id) {
          if (hash === '#accept') {
            await actionAssign(id, assign_id, true)
            addNotification('actions.task.status.accept')
          }
          if (hash === '#reject') {
            await actionAssign(id, assign_id, false)
            addNotification('actions.task.status.reject')
          }
        }
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount only

  useEffect(() => {
    if (taskOwner()) {
      const hadFirstTask = localStorage.getItem('hadFirstTask')
      if (!hadFirstTask) {
        setIsFirstTask(true)
        localStorage.setItem('hadFirstTask', true)
      }
    }
  }, [taskOwner])

  const handleAssignFundingDialogClose = () => {
    if (assignDialog) {
      setAssignDialog(false)
      setCurrentPrice(0)
      setTermsAgreed(false)
      setPriceConfirmed(false)
    }
    if (taskFundingDialog) {
      setTaskFundingDialog(false)
      setFundingInvite({ email: '', comment: '' })
      setTermsAgreed(false)
    }
  }

  const handleAssignDialogOpen = () => {
    setInterestedSuggestedDate(null)
    setShowSuggestAnotherDateField(false)
    setCurrentPrice(0)
    setInterestedLearn(false)
    setInterestedComment('')
    setAssignDialog(true)
  }

  const handleTaskFundingDialogOpen = () => {
    setInterestedSuggestedDate(null)
    setShowSuggestAnotherDateField(false)
    setCurrentPrice(0)
    setInterestedLearn(false)
    setInterestedComment('')
    setTaskFundingDialog(true)
  }

  const handleTaskSolveDialogOpen = () => setTaskSolveDialog(true)
  const handleTaskSolveDialogClose = () => setTaskSolveDialog(false)

  const handleStatusDialog = () => {
    const id = match.params.id
    if (history && history.location.pathname !== `/task/${id}/status`) {
      history.push(`/task/${id}/status`)
    }
    setStatusDialog(true)
  }

  const handleStatusDialogClose = () => {
    const id = match.params.id
    history.push(`/task/${id}`)
    setStatusDialog(false)
  }

  const handleDeleteDialog = () => setDeleteDialog(true)
  const handleTaskPaymentDialog = () => setTaskPaymentDialog(true)
  const handleMessageAuthorDialog = () => setTaskMessageAuthorDialog(true)
  const handleClaimDialog = () => setTaskClaimDialog(true)
  const handleTaskPaymentDialogClose = () => setTaskPaymentDialog(false)
  const handleTermsDialog = () => setTermsDialog(true)

  const handleTermsDialogClose = (agree) => {
    if (agree === true) setTermsAgreed(true)
    else if (agree === false) setTermsAgreed(false)
    setTermsDialog(false)
  }

  const handleOfferTask = () => {
    updateTask({
      id: match.params.id,
      Offer: {
        userId: user.id,
        suggestedDate: interestedSuggestedDate,
        value: currentPrice,
        learn: interestedLearn,
        comment: interestedComment
      }
    })
    setAssignDialog(false)
    setTermsAgreed(false)
  }

  const handleDeleteTask = () => {
    deleteTask({ id: match.params.id, userId: user.id })
      .then(() => {
        history.push('/tasks/all')
        setDeleteDialog(false)
      })
      .catch((e) => console.log(e))
  }

  const togglePaymentForm = (e) => {
    e.preventDefault()
    setPaymentForm((p) => !p)
    setDeadlineForm(false)
  }

  const toggleDeadlineForm = (e) => {
    e.preventDefault()
    setDeadlineForm((d) => !d)
    setPaymentForm(false)
  }

  const handleInvite = () => setTaskInviteDialog(true)
  const handleReportIssueDialog = () => setReportIssueDialog(true)
  const handleAssignDialog = () => setAssignIssueDialog(true)

  const handleInputInterestedCommentChange = (e) => {
    setInterestedComment(e.target.value)
    setCharactersCount(e.target.value.length)
  }

  const handleInputInterestedAmountChange = (e) => {
    const value = parseFloat(e.target.value)
    setCurrentPrice(value)
    if (value !== 0) setInterestedLearn(false)
  }

  const handleCheckboxLearn = () => {
    const learn = !interestedLearn
    setInterestedLearn(learn)
    if (learn) setCurrentPrice(0)
  }

  const handleCheckboxTerms = (e) => setTermsAgreed(e.target.checked)
  const handleCheckboxIwillDoFor = (e) => setPriceConfirmed(e.target.checked)
  const handleSuggestAnotherDate = () => setShowSuggestAnotherDateField((s) => !s)
  const handleInputChangeCalendar = (e) => setInterestedSuggestedDate(e.target.value)

  const pickTaskPrice = (price) => {
    setCurrentPrice(price)
    setFinalPrice(parseInt(price) + parseInt(orderPrice))
    setInterestedLearn(false)
  }

  const goToProjectRepo = (url) => window.open(url, '_blank')

  const renderIssueAuthorLink = () => {
    if (task.data.metadata && task.data.metadata.issue.user.html_url) {
      return (
        <Link href={`${task.data.metadata.issue.user.html_url}`} target="_blank">
          <FormattedMessage
            id="task.status.created.name.short"
            defaultMessage="by {name}"
            values={{ name: task.data.metadata ? task.data.metadata.issue.user.login : 'unknown' }}
          />
        </Link>
      )
    }
    return (
      <FormattedMessage
        id="task.status.created.name.short"
        defaultMessage="by {name}"
        values={{ name: task.data.metadata ? task.data.metadata.issue.user.login : 'unknown' }}
      />
    )
  }

  const handleFirstTaskBounties = () => {
    setIsFirstTask(false)
    setPaymentForm(true)
  }

  const handleFirstTaskNotifications = () => {
    setIsFirstTask(false)
    setDeadlineForm(true)
  }

  const handleFirstTaskContent = () => {
    if (firstTaskSteps === 0) {
      return {
        image: bounty,
        title: <FormattedMessage id="first.task.bounties.title" defaultMessage="Add Bounties" />,
        description: (
          <div>
            <FormattedMessage
              id="first.task.bounties.description"
              defaultMessage="Add bounties to reward contributors to solve your issue"
            />
            <Button
              onClick={handleFirstTaskBounties}
              color="primary"
              variant="contained"
              style={{ display: 'block', margin: '20px auto' }}
            >
              <FormattedMessage id="first.task.bounties.action" defaultMessage="Add bounties now" />
            </Button>
          </div>
        )
      }
    }
    if (firstTaskSteps === 1) {
      return {
        image: notifications,
        title: <FormattedMessage id="first.task.deadline.title" defaultMessage="Set a deadline" />,
        description: (
          <div>
            <FormattedMessage
              id="first.task.deadline.description"
              defaultMessage="Set a deadline in order to define when your issues should be solved"
            />
            <Button
              onClick={handleFirstTaskNotifications}
              color="primary"
              variant="contained"
              style={{ display: 'block', margin: '20px auto' }}
            >
              <FormattedMessage id="first.task.deadline.action" defaultMessage="Set deadline" />
            </Button>
          </div>
        )
      }
    }
    if (firstTaskSteps === 2) {
      return {
        image: sharing,
        title: (
          <FormattedMessage
            id="first.task.community.title"
            defaultMessage="Send to our community"
          />
        ),
        description: (
          <FormattedMessage
            id="first.task.community.description"
            defaultMessage="We will make a campaign to let our community know that you have an issue to be solved"
          />
        )
      }
    }
    return {}
  }

  const handleFundingEmailInputChange = (event) => {
    setFundingInvite({ ...fundingInvite, email: event.target.value })
  }

  const handleFundingInputMessageChange = (event) => {
    setFundingInvite({ ...fundingInvite, comment: event.target.value })
    setCharactersCount(event.target.value.length)
  }

  const sendFundingInvite = (e) => {
    e.preventDefault()
    fundingInviteTask(
      task.data.id,
      fundingInvite.email,
      fundingInvite.comment,
      currentPrice,
      interestedSuggestedDate,
      user
    )
    handleAssignFundingDialogClose()
  }

  // Error handling when task does not exist
  if (task.completed && !task.values) {
    history.push('/404')
    return null
  }

  const updatedAtTimeString = task.data.metadata
    ? MomentComponent(task.data.metadata.issue.updated_at).utc().fromNow()
    : 'not available'
  const timePlaceholder = (
    <Typography
      type="subheading"
      variant="caption"
      style={{ padding: 10, color: 'gray', marginRight: 10 }}
    >
      <FormattedMessage id="task.bounties.interested.created" defaultMessage="created" />{' '}
      {updatedAtTimeString}
    </Typography>
  )

  const deliveryDate =
    task.data.deadline !== null
      ? MomentComponent(task.data.deadline).utc().format('MM-DD-YYYY')
      : intl.formatMessage(messages.deliveryDateNotInformed)

  const deadlineDiff =
    task.data.deadline !== null
      ? MomentComponent(task.data.deadline).diff(MomentComponent(), 'days')
      : false

  const firstStepsContent = handleFirstTaskContent()

  return (
    <div>
      <Dialog open={isFirstTask} maxWidth="xs" aria-labelledby="form-dialog-title">
        <DialogContent>
          <div style={{ textAlign: 'center' }}>
            <img src={firstStepsContent.image} style={{ margin: '20px auto 0' }} width="70%" />
            <DialogTitle style={{ marginTop: 20 }}>
              <Fab size="small" aria-label="close" onClick={() => setIsFirstTask(false)}>
                <CloseIcon />
              </Fab>
              <Typography variant="h4">{firstStepsContent.title}</Typography>
            </DialogTitle>
            <DialogContentText>{firstStepsContent.description}</DialogContentText>
          </div>
        </DialogContent>
        <MobileStepper
          variant="dots"
          steps={3}
          position="static"
          activeStep={firstTaskSteps}
          nextButton={
            <Button
              size="small"
              onClick={() => setFirstTaskSteps((s) => s + 1)}
              disabled={firstTaskSteps === 2}
            >
              <FormattedMessage id="first.task.next" defaultMessage="Next" />
            </Button>
          }
          backButton={
            <Button
              onClick={() => setFirstTaskSteps((s) => s - 1)}
              disabled={firstTaskSteps === 0}
              size="small"
            >
              <FormattedMessage id="first.task.back" defaultMessage="Back" />
            </Button>
          }
        />
      </Dialog>

      {noTopBar ? null : <TopBarContainer />}

      <Grid container style={{ marginBottom: 4 }} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 12, md: 8 }} style={{ marginBottom: 40 }}>
          <IssueContent
            logged={logged?.data?.id}
            task={task}
            project={project}
            user={user}
            updateTask={updateTask}
            reportTask={reportTask}
            messageAuthor={messageAuthor}
            onDeleteTask={handleDeleteTask}
          />

          {logged ? (
            task.completed ? (
              <TaskPaymentForm
                match={match}
                dialog={props.dialog}
                task={task}
                plan={task.data.private ? 'private' : 'open source'}
                order={order}
                open={paymentForm}
                onClose={() => setPaymentForm(false)}
                user={user}
                openDialog={openDialog}
                closeDialog={closeDialog}
                addNotification={addNotification}
                updateTask={updateTask}
                createOrder={createOrder}
                fetchCustomer={fetchCustomer}
                customer={customer}
                listWallets={listWallets}
                wallets={wallets}
                fetchWallet={fetchWallet}
                wallet={wallet}
                fetchTask={fetchTask}
                syncTask={syncTask}
              />
            ) : (
              <>
                <Skeleton variant="text" animation="wave" width="80%" />
                <Skeleton variant="text" animation="wave" width="60%" />
              </>
            )
          ) : (
            <Collapse in={paymentForm}>
              <div style={{ marginBottom: 40 }}>
                <LoginButton referer={location} includeForm />
              </div>
            </Collapse>
          )}
        </Grid>

        <SidebarGrid item size={{ xs: 12, sm: 12, md: 4 }}>
          {task.values && task.values.available > 0 && (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                <FormattedMessage id="task.value.label" defaultMessage="Value offered" />
              </Typography>
              <div>
                <MoneyIcon style={{ verticalAlign: 'middle' }} />
                <Typography variant="h5" component="span" sx={{ verticalAlign: 'middle', ml: 1 }}>
                  {task.values.available}
                  {task.data.paid && <Chip sx={{ ml: 1 }} size="small" label="paid" />}
                </Typography>
              </div>
            </div>
          )}

          <SidebarSection>
            <SidebarItem>
              <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                <FormattedMessage id="task.publicy.label" defaultMessage="Publicy" />
              </Typography>
              <div>
                <TaskStatusIcons status={task.data.private ? 'private' : 'public'} bounty />
              </div>
            </SidebarItem>

            {task.data.status && (
              <SidebarItem>
                <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage id="task.status.label" defaultMessage="Status" />
                </Typography>
                <div>
                  <StatusChip
                    status={task.data.status}
                    label={intl.formatMessage(Constants.STATUSES[task.data.status])}
                    avatar={<StatusAvatarDot status={task.data.status}> </StatusAvatarDot>}
                  />
                </div>
              </SidebarItem>
            )}
          </SidebarSection>

          <SidebarSection>
            {task.data.level && !taskOwner() && (
              <SidebarItem>
                <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage id="task.level.label" defaultMessage="Level" />
                </Typography>
                <div>
                  <CoffeeIcon />
                  <Typography variant="h6" className={TaskInfoContent}>
                    <TaskInfoContent>{task.data.level}</TaskInfoContent>
                  </Typography>
                </div>
              </SidebarItem>
            )}

            {task.data.deadline && !taskOwner() && (
              <SidebarItem>
                <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage id="task.deadline.label" defaultMessage="Deadline" />
                </Typography>
                <div>
                  <Typography variant="h6">
                    <Button onClick={() => setDeadlineForm(true)}>
                      {task.data.deadline ? (
                        <div>
                          <div>{deliveryDate}</div>
                          {deadlineDiff && parseInt(deadlineDiff) > 0 ? (
                            <small>in {deadlineDiff} days</small>
                          ) : (
                            <Chip
                              size="small"
                              label={
                                <FormattedMessage id="task.dealine.past" defaultMessage="Overdue" />
                              }
                            />
                          )}
                        </div>
                      ) : (
                        <FormattedMessage id="task.deadline.call" defaultMessage="Set deadline" />
                      )}
                    </Button>
                  </Typography>
                </div>
              </SidebarItem>
            )}

            {taskOwner() && (
              <SidebarItem>
                <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage id="task.level.label" defaultMessage="Level" />
                </Typography>
                <div>
                  <Typography variant="h6">
                    <TaskLevelSplitButton
                      id={task.data.id}
                      level={task.data.level}
                      updateTask={updateTask}
                    />
                  </Typography>
                </div>
              </SidebarItem>
            )}

            {taskOwner() && (
              <SidebarItem>
                <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage id="task.deadline.label" defaultMessage="Deadline" />
                </Typography>
                <div>
                  <Typography variant="h6">
                    <Button onClick={() => setDeadlineForm(true)}>
                      {task.data.deadline ? (
                        <div>
                          <div>{deliveryDate}</div>
                          {deadlineDiff && parseInt(deadlineDiff) > 0 ? (
                            <small>in {deadlineDiff} days</small>
                          ) : (
                            <Chip
                              size="small"
                              label={
                                <FormattedMessage id="task.dealine.past" defaultMessage="Overdue" />
                              }
                            />
                          )}
                        </div>
                      ) : (
                        <FormattedMessage id="task.deadline.call" defaultMessage="Set deadline" />
                      )}
                    </Button>
                  </Typography>
                </div>
              </SidebarItem>
            )}
          </SidebarSection>

          <TaskDeadlineDrawer
            open={deadlineForm}
            onClose={() => setDeadlineForm(false)}
            taskId={task.data.id}
            task={task.data}
            onUpdate={(updatedTask) => {
              updateTask(updatedTask)
              setDeadlineForm(false)
            }}
          />

          {task?.data && (task?.data?.orders?.length || task?.data?.Orders?.length) ? (
            <div>
              <TaskPayments
                orders={(task?.data?.orders || task?.data?.Orders)?.filter(
                  (o) => o.paid && o.status === 'succeeded'
                )}
              />
            </div>
          ) : null}

          <IssueActionsByRole issue={task} currentRole={taskOwner() ? 'admin' : 'user'} />

          <TaskInviteCard
            onInvite={inviteTask}
            onFunding={handleTaskFundingDialogOpen}
            user={user}
            id={task.data.id}
          />

          <TaskOfferDrawer
            issue={task}
            open={assignDialog}
            onClose={handleAssignFundingDialogClose}
            offerUpdate={offerUpdate}
            loggedUser={logged}
            createOrder={createOrder}
            assignTask={assignTask}
            assigns={task.data.Assigns}
            onMessage={messageOffer}
            updateTask={updateTask}
          />

          <OfferDrawer
            hasEmailInput
            title={
              <FormattedMessage
                id="issue.offer.drawer.invite.title"
                defaultMessage="Invite sponsor"
              />
            }
            introTitle={
              <FormattedMessage
                id="task.funding.title"
                defaultMessage="Invite someone to add bounties to this issue"
              />
            }
            introMessage={
              <FormattedMessage
                id="task.funding.description"
                defaultMessage={
                  'You can invite a investor, sponsor, or the project owner to fund this issue and let them know your suggestions'
                }
              >
                {(msg) => <SpanText>{msg}</SpanText>}
              </FormattedMessage>
            }
            simpleInfoText={
              <FormattedMessage
                id="issue.funding.invite.info"
                defaultMessage="You will invite a sponsor to add bounties to this issue"
              />
            }
            commentAreaPlaceholder={
              <FormattedMessage
                id="task.funding.comment.value"
                defaultMessage="Leave a message to be sent together with the invite"
              />
            }
            pickupTagListTitle={
              <FormattedMessage
                id="task.funding.invite.title"
                defaultMessage="Suggest a bounty for the sponsor"
              />
            }
            pickutTagListDescription={
              <FormattedMessage
                id="task.funding.invite.headline"
                defaultMessage="You can suggest a bounty for the sponsor to add a bounty to this issue"
              />
            }
            introImage={inviteCover}
            issue={task}
            open={taskFundingDialog}
            onDeliveryDateChange={(date) => setInterestedSuggestedDate(date)}
            onChangePrice={(price) => setCurrentPrice(price)}
            onClose={handleAssignFundingDialogClose}
            onCommentChange={handleFundingInputMessageChange}
            onEmailInviteChange={handleFundingEmailInputChange}
            onTermsCheckboxChange={(checked) => setTermsAgreed(checked)}
            actions={[
              {
                label: <FormattedMessage id="task.funding.cancel" defaultMessage="Cancel" />,
                onClick: handleAssignFundingDialogClose
              },
              {
                disabled:
                  !fundingInvite.email || !termsAgreed || !currentPrice || currentPrice === 0,
                label: <FormattedMessage id="task.funding.invite" defaultMessage="Invite" />,
                onClick: sendFundingInvite,
                variant: 'contained',
                color: 'secondary'
              }
            ]}
          />
        </SidebarGrid>
      </Grid>

      {noBottomBar ? null : <Bottom />}
    </div>
  )
}

Task.propTypes = {
  fetchTask: PropTypes.func,
  dialog: PropTypes.object,
  addNotification: PropTypes.func,
  location: PropTypes.object,
  paymentTask: PropTypes.func,
  assignTask: PropTypes.func,
  actionAssign: PropTypes.func,
  task: PropTypes.object,
  logged: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
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
  requestClaimTask: PropTypes.func,
  history: PropTypes.object,
  project: PropTypes.object,
  createOrder: PropTypes.func,
  fetchCustomer: PropTypes.func,
  customer: PropTypes.object,
  listWallets: PropTypes.func,
  wallets: PropTypes.object,
  fetchWallet: PropTypes.func,
  wallet: PropTypes.object,
  offerUpdate: PropTypes.func,
  messageOffer: PropTypes.func,
  messageAuthor: PropTypes.func,
  noTopBar: PropTypes.bool,
  noBottomBar: PropTypes.bool
}

export default Task
