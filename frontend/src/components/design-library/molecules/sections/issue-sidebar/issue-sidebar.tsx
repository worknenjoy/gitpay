import React, { useState } from 'react'
import { Typography, Chip, Button } from '@mui/material'
import { AttachMoney as MoneyIcon, EmojiFoodBeverage as CoffeeIcon } from '@mui/icons-material'
import { FormattedMessage, useIntl } from 'react-intl'
import MomentComponent from 'moment'
import OfferDrawer from 'design-library/molecules/drawers/offer-drawer/offer-drawer'
import {
  SidebarItem,
  SidebarSection,
  SpanText,
  TaskInfoContent,
  StatusChip,
  StatusAvatarDot,
  SidebarRoot
} from './issue-sidebar.styles'
import IssuePublicStatus from 'design-library/atoms/status/issue-public-status/issue-public-status'
import TaskDeadlineDrawer from 'design-library/molecules/drawers/task-deadline-drawer/task-deadline-drawer'
import IssueActionsByRole from 'design-library/atoms/buttons/issue-actions-by-role/issue-actions-by-role'
import Constants from '../../../../../consts'
import inviteCover from 'images/funds.png'
import IssueLevelDropdown from 'design-library/atoms/inputs/dropdowns/issue-level-dropdown/issue-level-dropdown'
import { messages } from '../../../../../messages/messages'
import IssueInviteCard from 'design-library/molecules/cards/issue-cards/issue-invite-card/issue-invite-card'
import IssuePaymentsList from 'design-library/molecules/lists/issue-payments-list/issue-payments-list'
import useIssueAuthor from '../../../../../hooks/use-issue-author'
import IssueSidebarPlaceholder from './issue-sidebar.placeholder'

const IssueSidebar = ({
  user,
  account,
  task,
  updateTask,
  inviteTask,
  fundingInviteTask,
  cleanPullRequestDataState,
  fetchAccount,
  fetchPullRequestData,
  taskSolution,
  taskSolutionCompleted,
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  pullRequestData,
  customer,
  addNotification,
  createOrder,
  order,
  fetchWallet,
  wallet,
  listWallets,
  wallets,
  fetchTask,
  syncTask,
  fetchCustomer
}) => {
  const intl = useIntl()
  const issueAuthor = useIssueAuthor(task, user)
  const { data: taskData, completed: taskCompleted } = task || {}

  const isReady = taskCompleted

  const [deadlineForm, setDeadlineForm] = useState(false)
  const [taskFundingDialog, setTaskFundingDialog] = useState(false)
  const [fundingInvite, setFundingInvite] = useState({ email: '', comment: '' })
  const [interestedSuggestedDate, setInterestedSuggestedDate] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [termsAgreed, setTermsAgreed] = useState(false)

  const handleFundingEmailInputChange = (e) => {
    setFundingInvite({ ...fundingInvite, email: e.target.value })
  }
  const handleFundingInputMessageChange = (e) => {
    setFundingInvite({ ...fundingInvite, comment: e.target.value })
  }
  const handleAssignFundingDialogClose = () => {
    setTaskFundingDialog(false)
    setFundingInvite({ email: '', comment: '' })
    setTermsAgreed(false)
    setInterestedSuggestedDate(null)
  }

  const handleTaskFundingDialogOpen = () => {
    setInterestedSuggestedDate(null)
    setCurrentPrice(0)
    setTaskFundingDialog(true)
  }

  const sendFundingInvite = (e) => {
    e.preventDefault()
    fundingInviteTask(
      taskData.id,
      fundingInvite.email,
      fundingInvite.comment,
      currentPrice,
      interestedSuggestedDate,
      user
    )
    handleAssignFundingDialogClose()
  }

  const deliveryDate =
    taskData.deadline !== null
      ? MomentComponent(taskData.deadline).utc().format('MM-DD-YYYY')
      : intl.formatMessage(messages.deliveryDateNotInformed)

  const deadlineDiff =
    taskData.deadline !== null
      ? MomentComponent(taskData.deadline).diff(MomentComponent(), 'days')
      : false

  const paidOrders = (taskData.orders || taskData.Orders)?.filter((o) => o.paid)

  return isReady ? (
    <SidebarRoot>
      {task.values && task.values.available > 0 && (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
            <FormattedMessage id="task.value.label" defaultMessage="Value offered" />
          </Typography>
          <div>
            <div style={{ verticalAlign: 'sub', display: 'inline-block' }}>
              <MoneyIcon />
            </div>
            <Typography variant="h5" component="span">
              {task.values.available}
              {taskData.paid && <Chip sx={{ ml: 1 }} size="small" label="paid" />}
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
            <IssuePublicStatus status={taskData.private ? 'private' : 'public'} />
          </div>
        </SidebarItem>

        {taskData.status && (
          <SidebarItem>
            <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
              <FormattedMessage id="task.status.label" defaultMessage="Status" />
            </Typography>
            <div>
              <StatusChip
                status={taskData.status}
                label={intl.formatMessage(Constants.STATUSES[taskData.status])}
                avatar={<StatusAvatarDot status={taskData.status}> </StatusAvatarDot>}
              />
            </div>
          </SidebarItem>
        )}
      </SidebarSection>

      <SidebarSection>
        {taskData.level && !issueAuthor && (
          <SidebarItem>
            <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
              <FormattedMessage id="task.level.label" defaultMessage="Level" />
            </Typography>
            <div>
              <div style={{ verticalAlign: 'bottom', display: 'inline-block' }}>
                <CoffeeIcon />
              </div>
              <Typography variant="h6" component="span" sx={{ verticalAlign: 'baseline', ml: 1 }}>
                <TaskInfoContent>{taskData.level}</TaskInfoContent>
              </Typography>
            </div>
          </SidebarItem>
        )}

        {taskData.deadline && !issueAuthor && (
          <SidebarItem>
            <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
              <FormattedMessage id="task.deadline.label" defaultMessage="Deadline" />
            </Typography>
            <div>
              <Typography variant="h6">
                <Button onClick={() => setDeadlineForm(true)}>
                  {taskData.deadline ? (
                    <div>
                      <div>{deliveryDate}</div>
                      {deadlineDiff && deadlineDiff > 0 ? (
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

        {issueAuthor && (
          <SidebarItem>
            <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
              <FormattedMessage id="task.level.label" defaultMessage="Level" />
            </Typography>
            <div>
              <Typography variant="h6">
                <IssueLevelDropdown
                  id={taskData.id}
                  level={taskData.level}
                  updateTask={updateTask}
                />
              </Typography>
            </div>
          </SidebarItem>
        )}

        {issueAuthor && (
          <SidebarItem>
            <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
              <FormattedMessage id="task.deadline.label" defaultMessage="Deadline" />
            </Typography>
            <div>
              <Typography variant="h6">
                <Button onClick={() => setDeadlineForm(true)}>
                  {taskData.deadline ? (
                    <div>
                      <div>{deliveryDate}</div>
                      {deadlineDiff && deadlineDiff > 0 ? (
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
        taskId={taskData.id}
        task={taskData}
        onUpdate={(updatedTask) => {
          updateTask(updatedTask)
          setDeadlineForm(false)
        }}
      />

      {taskData && (taskData.orders?.length || taskData.Orders?.length) ? (
        <IssuePaymentsList orders={paidOrders} />
      ) : (
        <div />
      )}

      <IssueActionsByRole
        issue={task}
        currentRole={issueAuthor ? 'admin' : 'user'}
        cleanPullRequestDataState={cleanPullRequestDataState}
        account={account}
        fetchAccount={fetchAccount}
        user={user}
        taskSolution={taskSolution}
        taskSolutionCompleted={taskSolutionCompleted}
        getTaskSolution={getTaskSolution}
        createTaskSolution={createTaskSolution}
        updateTaskSolution={updateTaskSolution}
        fetchPullRequestData={fetchPullRequestData}
        pullRequestData={pullRequestData}
        updateTask={updateTask}
        task={task}
        fetchCustomer={fetchCustomer}
        customer={customer}
        addNotification={addNotification}
        createOrder={createOrder}
        order={order}
        fetchWallet={fetchWallet}
        wallet={wallet}
        listWallets={listWallets}
        wallets={wallets}
        fetchTask={fetchTask}
        syncTask={syncTask}
      />

      <IssueInviteCard
        onInvite={inviteTask}
        onFunding={handleTaskFundingDialogOpen}
        user={user}
        id={taskData.id}
      />

      <OfferDrawer
        hasEmailInput
        title={
          <FormattedMessage id="issue.offer.drawer.invite.title" defaultMessage="Invite sponsor" />
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
            disabled: !fundingInvite.email || !termsAgreed || !currentPrice || currentPrice === 0,
            label: <FormattedMessage id="task.funding.invite" defaultMessage="Invite" />,
            onClick: sendFundingInvite,
            variant: 'contained',
            color: 'secondary'
          }
        ]}
      />
    </SidebarRoot>
  ) : (
    <IssueSidebarPlaceholder />
  )
}

export default IssueSidebar
