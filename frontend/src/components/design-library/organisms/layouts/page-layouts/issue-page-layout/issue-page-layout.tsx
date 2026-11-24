import React, { useState } from 'react'
import { Grid, Dialog, DialogContent, DialogTitle, Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import IssueContent from 'design-library/molecules/content/issue-content/issue-content'
import IssueSidebar from 'design-library/molecules/sections/issue-sidebar/issue-sidebar'
import IssuePaymentDrawer from 'design-library/molecules/drawers/issue-payment-drawer/issue-payment-drawer'
import SendSolutionDrawer from 'design-library/molecules/drawers/send-solution-drawer/send-solution-drawer'
import BountyBreakdownDrawer from 'design-library/molecules/drawers/bounty-breakdown-drawer/bounty-breakdown-drawer'
import IssueSolutionsDrawer from 'design-library/molecules/drawers/issue-solutions-drawer/issue-solutions-drawer'
import IssueMessageAuthorDialog from 'design-library/molecules/dialogs/issue-message-author-dialog/issue-message-author-dialog'
import LoginButton from 'design-library/molecules/form-section/login-form/login-form-signin/login-form-signin'
import type { IssueOwner, IssueOwnerReputation } from 'design-library/molecules/cards/issue-cards/issue-owner-card/issue-owner-card'
import type { LinkedPullRequest } from 'design-library/molecules/menus/linked-pull-requests-menu/linked-pull-requests-menu'
import type { MyPullRequest } from 'design-library/molecules/form-section/solution-pr-field/solution-pr-field'
import type { IssueSolution } from 'design-library/molecules/lists/issue-solutions-list/issue-solutions-list'
import type { AddBountyMethod } from 'design-library/molecules/drawers/issue-payment-drawer/issue-payment-drawer'
import { getBountySummary, getImporter, getSolutionsFromTaskSolution } from './issue-page.helpers'

export type IssuePageDialog = 'bounty' | 'solution' | 'breakdown' | 'solutions' | 'message' | null

const IssuePage = ({
  user,
  task,
  onDeleteTask,
  updateTask,
  reportTask,
  messageAuthor,
  inviteTask,
  fundingInviteTask,
  cleanPullRequestDataState,
  taskSolution,
  taskSolutionCompleted,
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  pullRequestData,
  fetchCustomer,
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
  // Data and actions the back end doesn't provide yet — each section stays
  // hidden until its prop is passed.
  solutions,
  follow,
  owner,
  linkedPullRequests,
  myPullRequests,
  connectedAs,
  onConnectGithub,
  onPledge,
  onRequestPayment,
  onPostOnGithub,
  messageTopics,
  // Initial UI state, for stories.
  initialDialog = null,
  initialBountyMethod,
  initialBountyWhen = 'now',
  defaultVisibilityOpen,
  linkedOpen
}: {
  [key: string]: any
  solutions?: IssueSolution[]
  follow?: { following: boolean; followers?: number; onToggle: () => void }
  owner?: { profile: IssueOwner; reputation: IssueOwnerReputation }
  linkedPullRequests?: LinkedPullRequest[]
  myPullRequests?: MyPullRequest[]
  connectedAs?: string
  onConnectGithub?: () => void
  onPledge?: (amount: number) => void
  onRequestPayment?: (payload: { pullRequestURL: string; taskId: number }) => void
  onPostOnGithub?: () => void
  messageTopics?: string[]
  initialDialog?: IssuePageDialog
  initialBountyMethod?: AddBountyMethod
  initialBountyWhen?: 'now' | 'later'
  defaultVisibilityOpen?: boolean
  linkedOpen?: boolean
}) => {
  const [dialog, setDialog] = useState<IssuePageDialog>(initialDialog)
  const [bountyWhen, setBountyWhen] = useState<'now' | 'later'>(initialBountyWhen)
  const close = () => setDialog(null)

  const taskData = task?.data
  const issueSolutions = solutions || getSolutionsFromTaskSolution(taskSolution, user)
  const bounty = getBountySummary(taskData)
  const importer = getImporter(taskData)

  return (
    <>
      <Grid container style={{ marginBottom: 4 }} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 12, md: 8 }} style={{ marginBottom: 40 }}>
          <IssueContent
            user={user}
            task={task}
            updateTask={updateTask}
            reportTask={reportTask}
            onDeleteTask={onDeleteTask}
            onMessage={importer ? () => setDialog('message') : undefined}
            solutions={issueSolutions}
            onSendSolution={() => setDialog('solution')}
            linkedPullRequests={linkedPullRequests}
            linkedOpen={linkedOpen}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }} style={{ marginBottom: 40 }}>
          <IssueSidebar
            user={user}
            task={task}
            updateTask={updateTask}
            inviteTask={inviteTask}
            fundingInviteTask={fundingInviteTask}
            onAddBounty={(when) => {
              setBountyWhen(when)
              setDialog('bounty')
            }}
            onSendSolution={() => setDialog('solution')}
            onBreakdown={() => setDialog('breakdown')}
            onSolutions={issueSolutions.length > 0 ? () => setDialog('solutions') : undefined}
            solutionsCount={issueSolutions.length}
            allowPayLater={Boolean(onPledge)}
            follow={follow}
            owner={owner}
            linkedPullRequests={linkedPullRequests}
            onPostOnGithub={onPostOnGithub}
            defaultVisibilityOpen={defaultVisibilityOpen}
            linkedOpen={linkedOpen}
          />
        </Grid>
      </Grid>

      {taskData && (
        <>
          <IssuePaymentDrawer
            open={dialog === 'bounty'}
            onClose={close}
            fetchCustomer={fetchCustomer}
            customer={customer}
            addNotification={addNotification}
            updateTask={updateTask}
            user={user}
            task={task}
            createOrder={createOrder}
            order={order}
            fetchWallet={fetchWallet}
            wallet={wallet}
            listWallets={listWallets}
            wallets={wallets}
            fetchTask={fetchTask}
            syncTask={syncTask}
            price={taskData.price || 0}
            initialMethod={initialBountyMethod}
            initialWhen={bountyWhen}
            onPledge={
              onPledge
                ? (amount: number) => {
                    onPledge(amount)
                    close()
                  }
                : undefined
            }
          />

          {dialog === 'solution' && (
            <SendSolutionDrawer
              open
              onClose={close}
              cleanPullRequestDataState={cleanPullRequestDataState}
              pullRequestData={pullRequestData}
              task={task}
              createTaskSolution={createTaskSolution}
              updateTaskSolution={updateTaskSolution}
              getTaskSolution={getTaskSolution}
              user={user}
              taskSolution={taskSolution}
              fetchPullRequestData={fetchPullRequestData}
              taskSolutionCompleted={taskSolutionCompleted}
              myPullRequests={myPullRequests}
              connectedAs={connectedAs}
              onConnectGithub={onConnectGithub}
              onRequestPayment={onRequestPayment}
            />
          )}

          <BountyBreakdownDrawer
            open={dialog === 'breakdown'}
            onClose={close}
            payments={bounty.payments}
          />

          <IssueSolutionsDrawer
            open={dialog === 'solutions'}
            onClose={close}
            solutions={issueSolutions}
            onSendSolution={() => setDialog('solution')}
          />

          {user?.logged ? (
            <IssueMessageAuthorDialog
              open={dialog === 'message'}
              userId={user?.data?.id}
              taskId={taskData.id}
              name={importer?.name}
              avatarUrl={importer?.avatarUrl}
              recipientNote={
                <FormattedMessage
                  id="task.message.recipient.importer"
                  defaultMessage="Imported this issue"
                />
              }
              topics={messageTopics}
              onClose={close}
              onSend={messageAuthor}
            />
          ) : (
            <Dialog open={dialog === 'message'} onClose={close} aria-labelledby="login-dialog-title">
              <DialogTitle id="login-dialog-title">
                <FormattedMessage
                  id="task.bounties.logged.info"
                  defaultMessage="You need to login to send messages to the author"
                />
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <LoginButton onClose={close} />
                </Box>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </>
  )
}

export default IssuePage
