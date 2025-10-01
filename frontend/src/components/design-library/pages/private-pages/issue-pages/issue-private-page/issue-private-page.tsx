import IssuePage from 'design-library/organisms/layouts/issue-page/issue-page';
import PrivateBase from 'design-library/templates/base/private-base/private-base';
import React from 'react';


const IssuePrivatePage = ({
  createTask,
  signOut,
  user,
  bottomProps,
  assignDialog,
  assignTask,
  cleanPullRequestDataState,
  currentPrice,
  fetchAccount,
  fundingInvite,
  handleAssignFundingDialogClose,
  handleFundingEmailInputChange,
  handleFundingInputMessageChange,
  handleTaskFundingDialogOpen,
  createOrder,
  inviteTask,
  messageAuthor,
  messageOffer,
  offerUpdate,
  onDeleteTask,
  organization,
  project,
  reportTask,
  setCurrentPrice,
  setInterestedSuggestedDate,
  setTermsAgreed,
  taskFundingDialog,
  onResendActivationEmail,
  task,
  updateTask,
  sendFundingInvite,
  termsAgreed
}) => {

  return (
    <PrivateBase
      createTask={createTask}
      signOut={signOut}
      user={user}
      bottomProps={bottomProps}
      onResendActivationEmail={onResendActivationEmail}
    >
      <IssuePage
        assignDialog={assignDialog}
        assignTask={assignTask}
        cleanPullRequestDataState={cleanPullRequestDataState}
        currentPrice={currentPrice}
        fetchAccount={fetchAccount}
        fundingInvite={fundingInvite}
        handleAssignFundingDialogClose={handleAssignFundingDialogClose}
        handleFundingEmailInputChange={handleFundingEmailInputChange}
        handleFundingInputMessageChange={handleFundingInputMessageChange}
        handleTaskFundingDialogOpen={handleTaskFundingDialogOpen}
        createOrder={createOrder}
        inviteTask={inviteTask}
        logged={user}
        messageAuthor={messageAuthor}
        messageOffer={messageOffer}
        offerUpdate={offerUpdate}
        onDeleteTask={onDeleteTask}
        organization={organization}
        project={project}
        reportTask={reportTask}
        setCurrentPrice={setCurrentPrice}
        setInterestedSuggestedDate={setInterestedSuggestedDate}
        setTermsAgreed={setTermsAgreed}
        taskFundingDialog={taskFundingDialog}
        task={task}
        updateTask={updateTask}
        user={user}
        sendFundingInvite={sendFundingInvite}
        termsAgreed={termsAgreed}
      />
    </PrivateBase>
  );
};

export default IssuePrivatePage;
