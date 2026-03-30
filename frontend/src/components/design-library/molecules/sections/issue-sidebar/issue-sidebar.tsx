import React, { useState } from 'react'
import { Typography, Chip, Button, Divider, Tooltip } from '@mui/material'
import { AttachMoney as MoneyIcon, EmojiFoodBeverage as CoffeeIcon, InfoOutlined, VisibilityOff } from '@mui/icons-material'
import { FormattedMessage, useIntl } from 'react-intl'
import MomentComponent from 'moment'
import OfferDrawer from 'design-library/molecules/drawers/offer-drawer/offer-drawer'
import {
  SidebarItem,
  SidebarSection,
  SidebarCard,
  SpanText,
  TaskInfoContent,
  StatusChip,
  StatusAvatarDot,
  SidebarRoot
} from './issue-sidebar.styles'
import IssuePublicStatus from 'design-library/atoms/status/issue-public-status/issue-public-status'
import TaskStateStatus from 'design-library/atoms/status/task-state-status/task-state-status'
import TaskDeadlineDrawer from 'design-library/molecules/drawers/task-deadline-drawer/task-deadline-drawer'
import IssueActionsByRole from 'design-library/atoms/buttons/issue-actions-by-role/issue-actions-by-role'
import Constants from '../../../../../consts'
import inviteCover from 'images/funds.png'
import IssueLevelDropdown from 'design-library/atoms/inputs/dropdowns/issue-level-dropdown/issue-level-dropdown'
import { messages } from '../../../../../messages/messages'
import IssueInviteCard from 'design-library/molecules/cards/issue-cards/issue-invite-card/issue-invite-card'
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


    return isReady ? (
      <SidebarRoot>
        {/* Not listed chip at the top */}
        {taskData && taskData.not_listed && (
          <SidebarSection style={{ marginTop: 0, marginBottom: 10, justifyContent: 'center' }}>
            <Tooltip
              title={
                <FormattedMessage
                  id="task.notListed.tooltip"
                  defaultMessage="This task is visible by a direct link but not listed in our network."
                />
              }
              arrow
            >
              <Chip
                icon={<VisibilityOff fontSize="small" style={{ color: 'inherit' }} />}
                label={<FormattedMessage id="task.notListed.info" defaultMessage="Not listed" />}
                color="warning"
                size="small"
                style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
              />
            </Tooltip>
          </SidebarSection>
        )}

        {/* Top: Gitpay state + funded value */}
        <SidebarSection>
          {taskData.state && (
            <SidebarItem>
              <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                <FormattedMessage id="task.state.label" defaultMessage="State" />
              </Typography>
              <div>
                <TaskStateStatus state={taskData.state} completed={taskCompleted} />
              </div>
            </SidebarItem>
          )}
          {task.values && task.values.available > 0 && (
            <SidebarItem>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage id="task.value.funded.label" defaultMessage="Value funded" />
                </Typography>
                <Tooltip
                  title={intl.formatMessage({
                    id: 'task.value.funded.tooltip',
                    defaultMessage: 'The funds are already on Gitpay and available to pay out to whoever completes the PR'
                  })}
                  arrow
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', marginLeft: 2 }}>
                    <InfoOutlined fontSize="small" style={{ color: '#888' }} />
                  </span>
                </Tooltip>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <MoneyIcon fontSize="small" />
                <Typography variant="h6" component="span">
                  {task.values.available}
                </Typography>
                {taskData.paid && <Chip size="small" label="paid" />}
              </div>
            </SidebarItem>
          )}
        </SidebarSection>

      {/* Provider card: visibility + issue status */}
      <SidebarCard elevation={0} variant="outlined">
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
          {taskData.provider
            ? taskData.provider.charAt(0).toUpperCase() + taskData.provider.slice(1)
            : <FormattedMessage id="task.provider.label" defaultMessage="Provider" />}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <SidebarSection>

          <SidebarItem>
            <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
              <FormattedMessage id="task.visibility.label" defaultMessage="Visibility" />
            </Typography>
            <div>
              {/* Use GitHub repo visibility if available, fallback to private flag */}
              <IssuePublicStatus status={taskData.repoVisibility ? taskData.repoVisibility : (taskData.private ? 'private' : 'public')} />
            </div>
          </SidebarItem>



          {taskData.status && (
            <SidebarItem>
              <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
                <FormattedMessage id="task.status.label" defaultMessage="Issue status" />
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
      </SidebarCard>

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
