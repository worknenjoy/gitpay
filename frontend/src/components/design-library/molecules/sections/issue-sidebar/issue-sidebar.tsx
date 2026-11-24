import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import OfferDrawer from 'design-library/molecules/drawers/offer-drawer/offer-drawer'
import TaskDeadlineDrawer from 'design-library/molecules/drawers/task-deadline-drawer/task-deadline-drawer'
import IssueLevelDropdown from 'design-library/atoms/inputs/dropdowns/issue-level-dropdown/issue-level-dropdown'
import IssueShareBar from 'design-library/molecules/content/issue-share-bar/issue-share-bar'
import IssueFacts from 'design-library/molecules/sections/issue-facts/issue-facts'
import IssueBountyCard from 'design-library/molecules/cards/issue-cards/issue-bounty-card/issue-bounty-card'
import IssueSolveCard from 'design-library/molecules/cards/issue-cards/issue-solve-card/issue-solve-card'
import IssueGithubCard from 'design-library/molecules/cards/issue-cards/issue-github-card/issue-github-card'
import IssueOwnerCard, {
  IssueOwner,
  IssueOwnerReputation
} from 'design-library/molecules/cards/issue-cards/issue-owner-card/issue-owner-card'
import IssueInviteCard from 'design-library/molecules/cards/issue-cards/issue-invite-card/issue-invite-card'
import type { AddBountyWhen } from 'design-library/atoms/buttons/add-bounty-button/add-bounty-button'
import type { LinkedPullRequest } from 'design-library/molecules/menus/linked-pull-requests-menu/linked-pull-requests-menu'
import {
  getBountySummary,
  getPaymentTiming,
  getBreakdownTotals,
  getDeadlineInfo,
  getGithubInfo,
  getIssueVisibility,
  isBountyLocked
} from 'design-library/organisms/layouts/page-layouts/issue-page-layout/issue-page.helpers'
import inviteCover from 'images/funds.png'
import useIssueAuthor from '../../../../../hooks/use-issue-author'
import IssueSidebarPlaceholder from './issue-sidebar.placeholder'
import { SidebarRoot, SpanText } from './issue-sidebar.styles'

export type IssueSidebarProps = {
  user: any
  task: any
  updateTask: (data: any) => any
  inviteTask: (...args: any[]) => void
  fundingInviteTask: (...args: any[]) => void
  /** Opens the Add bounty drawer. */
  onAddBounty: (when: AddBountyWhen) => void
  /** Opens the Send solution drawer. */
  onSendSolution: () => void
  /** Opens the bounty breakdown drawer. */
  onBreakdown?: () => void
  /** Opens the solutions sent drawer. */
  onSolutions?: () => void
  solutionsCount?: number
  /** Pay later is offered only when pledges are supported. */
  allowPayLater?: boolean
  /** Follow segment in the share bar — hidden without it. */
  follow?: { following: boolean; followers?: number; onToggle: () => void }
  /** Issue owner reputation — the owner card is hidden without it. */
  owner?: { profile: IssueOwner; reputation: IssueOwnerReputation }
  linkedPullRequests?: LinkedPullRequest[]
  /** Comment on GitHub with a link to the page — row hidden without it. */
  onPostOnGithub?: () => void
  defaultVisibilityOpen?: boolean
  linkedOpen?: boolean
}

/** The issue page rail: share bar, facts, then the fund / solve / GitHub / owner / share cards. */
const IssueSidebar = ({
  user,
  task,
  updateTask,
  inviteTask,
  fundingInviteTask,
  onAddBounty,
  onSendSolution,
  onBreakdown,
  onSolutions,
  solutionsCount = 0,
  allowPayLater = false,
  follow,
  owner,
  linkedPullRequests,
  onPostOnGithub,
  defaultVisibilityOpen,
  linkedOpen
}: IssueSidebarProps) => {
  const issueAuthor = useIssueAuthor(task, user)
  const { data: taskData, completed: taskCompleted } = task || {}

  const [deadlineForm, setDeadlineForm] = useState(false)
  const [taskFundingDialog, setTaskFundingDialog] = useState(false)
  const [fundingInvite, setFundingInvite] = useState({ email: '', comment: '' })
  const [interestedSuggestedDate, setInterestedSuggestedDate] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [termsAgreed, setTermsAgreed] = useState(false)

  if (!taskCompleted || !taskData) return <IssueSidebarPlaceholder />

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

  const bounty = getBountySummary(taskData)
  const timing = getPaymentTiming(bounty.payments)
  const totals = getBreakdownTotals(bounty.payments)
  const github = getGithubInfo(taskData)
  const locked = isBountyLocked(taskData)
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/#/task/${taskData.id}`
      : `https://gitpay.me/#/task/${taskData.id}`

  const level = issueAuthor ? (
    <IssueLevelDropdown id={taskData.id} level={taskData.level} updateTask={updateTask} />
  ) : (
    taskData.level || undefined
  )

  return (
    <SidebarRoot>
      <div className="share-bar-wrap">
        <IssueShareBar
          url={pageUrl}
          following={follow?.following}
          followers={follow?.followers}
          onFollow={follow?.onToggle}
        />
      </div>

      <IssueFacts
        state={taskData.state}
        visibility={getIssueVisibility(taskData)}
        onVisibilityChange={
          issueAuthor
            ? (value) => updateTask({ id: taskData.id, not_listed: value === 'unlisted' })
            : undefined
        }
        deadline={getDeadlineInfo(taskData.deadline)}
        onDeadlineClick={issueAuthor ? () => setDeadlineForm(true) : undefined}
        defaultVisibilityOpen={defaultVisibilityOpen}
      />

      <IssueBountyCard
        total={bounty.total}
        sponsors={bounty.sponsors}
        timing={timing}
        pledged={totals.pledged}
        onAdd={onAddBounty}
        allowLater={allowPayLater}
        onBreakdown={bounty.payments.length > 0 ? onBreakdown : undefined}
        disabled={locked}
      />

      <IssueSolveCard
        bountyTotal={bounty.total}
        payLater={timing === 'later'}
        solutionsCount={solutionsCount}
        onSolutions={onSolutions}
        onSend={onSendSolution}
        level={level}
        disabled={locked}
      />

      {github && <IssueGithubCard info={github} linkedPullRequests={linkedPullRequests} linkedOpen={linkedOpen} />}

      {owner && <IssueOwnerCard owner={owner.profile} reputation={owner.reputation} />}

      <IssueInviteCard
        onInvite={inviteTask}
        onFunding={handleTaskFundingDialogOpen}
        onPostOnGithub={onPostOnGithub}
        user={user}
        id={taskData.id}
      />

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
        onCommentChange={(e) => setFundingInvite({ ...fundingInvite, comment: e.target.value })}
        onEmailInviteChange={(e) => setFundingInvite({ ...fundingInvite, email: e.target.value })}
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
  )
}

export default IssueSidebar
