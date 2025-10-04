import React from 'react'
import { Root } from './issue-public-page.styles'
import IssuePage from 'design-library/organisms/layouts/page-layouts/issue-page-layout/issue-page-layout'
import PublicBase from 'design-library/templates/base/public-base/public-base'

const IssuePublicPage = ({
  loggedIn,
  task,
  bottomBarProps,
  accountMenuProps,
  project,
  organization,
  onDeleteTask,
  updateTask,
  reportTask,
  messageAuthor,
  inviteTask,
  fundingInviteTask,
  cleanPullRequestDataState,
  account,
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
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}) => {
  return (
    <Root>
      <PublicBase
        loggedIn={loggedIn}
        bottomBarProps={bottomBarProps}
        accountMenuProps={accountMenuProps}
        loginFormSignupFormProps={loginFormSignupFormProps}
        loginFormForgotFormProps={loginFormForgotFormProps}
        importIssuesProps={importIssuesProps}
      >
        <IssuePage
          logged={loggedIn}
          task={task}
          project={project}
          organization={organization}
          onDeleteTask={onDeleteTask}
          account={account}
          updateTask={updateTask}
          reportTask={reportTask}
          messageAuthor={messageAuthor}
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
      </PublicBase>
    </Root>
  )
}

export default IssuePublicPage