import React from 'react'
import { Root } from './issue-public-page.styles'
import IssuePage from 'design-library/organisms/layouts/issue-page/issue-page'
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
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  pullRequestData
}) => {
  return (
    <Root>
      <PublicBase
        loggedIn={loggedIn}
        bottomBarProps={bottomBarProps}
        accountMenuProps={accountMenuProps}
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
        />
      </PublicBase>
    </Root>
  )
}

export default IssuePublicPage