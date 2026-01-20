import React from 'react'
import IssuePage from 'design-library/organisms/layouts/page-layouts/issue-page-layout/issue-page-layout'

const IssuePublicPage = ({
  user,
  task,
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
  validateCoupon,
  couponStoreState
}) => {
  return (
    <IssuePage
      user={user}
      task={task}
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
      validateCoupon={validateCoupon}
      couponStoreState={couponStoreState}
    />
  )
}

export default IssuePublicPage
