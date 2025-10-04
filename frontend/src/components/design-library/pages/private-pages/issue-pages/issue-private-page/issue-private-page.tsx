import IssuePage from 'design-library/organisms/layouts/page-layouts/issue-page-layout/issue-page-layout';
import PrivateBase from 'design-library/templates/base/private-base/private-base';
import React from 'react';


const IssuePrivatePage = ({
  loggedIn,
  account,
  fundingInviteTask,
  createTaskSolution,
  getTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  pullRequestData,
  taskSolution,
  taskSolutionCompleted,
  createTask,
  signOut,
  bottomProps,
  cleanPullRequestDataState,
  fetchAccount,
  inviteTask,
  messageAuthor,
  onDeleteTask,
  organization,
  project,
  reportTask,
  onResendActivationEmail,
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
    <PrivateBase
      createTask={createTask}
      signOut={signOut}
      user={loggedIn}
      bottomProps={bottomProps}
      onResendActivationEmail={onResendActivationEmail}
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
    </PrivateBase>
  );
};

export default IssuePrivatePage;
