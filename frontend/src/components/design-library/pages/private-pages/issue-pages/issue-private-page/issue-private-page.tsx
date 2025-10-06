import IssuePage from 'design-library/organisms/layouts/page-layouts/issue-page-layout/issue-page-layout';
import React from 'react';

const IssuePrivatePage = ({
  user,
  account,
  fundingInviteTask,
  createTaskSolution,
  getTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  pullRequestData,
  taskSolution,
  taskSolutionCompleted,
  cleanPullRequestDataState,
  fetchAccount,
  inviteTask,
  messageAuthor,
  onDeleteTask,
  organization,
  project,
  reportTask,
  task,
  updateTask,
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
  syncTask
}) => {
  return (
    <IssuePage
      user={user}
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
  );
};

export default IssuePrivatePage;
