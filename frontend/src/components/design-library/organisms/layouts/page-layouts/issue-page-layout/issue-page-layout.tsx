import React from 'react'
import { Grid } from '@mui/material'
import IssueContent from 'design-library/molecules/content/issue-content/issue-content'
import IssueSidebar from 'design-library/molecules/sections/issue-sidebar/issue-sidebar'

const IssuePage = ({
  user,
  task,
  project,
  organization,
  onDeleteTask,
  account,
  updateTask,
  reportTask,
  messageAuthor,
  inviteTask,
  fundingInviteTask,
  cleanPullRequestDataState,
  fetchAccount,
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
}) => {
  return (
    <Grid container style={{ marginBottom: 4 }} alignItems="stretch">
      <Grid size={{ xs: 12, sm: 12, md: 8 }} style={{ marginBottom: 40 }}>
        <IssueContent
          user={user}
          task={task}
          project={project}
          updateTask={updateTask}
          reportTask={reportTask}
          messageAuthor={messageAuthor}
          organization={organization}
          onDeleteTask={onDeleteTask}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }} style={{ marginBottom: 40 }}>
        <IssueSidebar
          user={user}
          account={account}
          task={task}
          updateTask={updateTask}
          inviteTask={inviteTask}
          cleanPullRequestDataState={cleanPullRequestDataState}
          fetchAccount={fetchAccount}
          fundingInviteTask={fundingInviteTask}
          createTaskSolution={createTaskSolution}
          getTaskSolution={getTaskSolution}
          updateTaskSolution={updateTaskSolution}
          fetchPullRequestData={fetchPullRequestData}
          pullRequestData={pullRequestData}
          taskSolution={taskSolution}
          taskSolutionCompleted={taskSolutionCompleted}
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
          fetchCustomer={fetchCustomer}
        />
      </Grid>
    </Grid>
  )
}

export default IssuePage
