/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react';
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskSolutionDialog from '../../../src/components/task/send-solution-dialog';
import { BrowserRouter } from 'react-router-dom';

const router = {
  history: {},
  route: {
    location: {
      pathname: '/',
    },
    match: {},
  },
};

describe('Components - TaskSolutionDialog', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })
  it('should render correctly on loading state', () => {
    render(
      <BrowserRouter router={router}>
        <TaskSolutionDialog
          taskSolution={{}}
          pullRequestData={{}}
          task={{
            data: {},
          }}
          user={{}}
          cleanPullRequestDataState={() => {}}
          getTaskSolution={() => {}}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Send a solution for this issue')).toBeDefined();
  });
  it('should render correctly with all conditions failed and buttom disabled', async () => {
    render(
      <BrowserRouter router={router}>
        <TaskSolutionDialog
          pullRequestUrl={'https://github.com/alexanmtz/test-repository/pull/2'}
          taskSolution={{}}
          pullRequestData={{
            pullRequestUrl: 'https://github.com/alexanmtz/test-repository/pull/2',
            isPRMerged: false,
            isIssueClosed: false,
            isConnectedToGitHub: false,
            hasIssueReference: false,
          }}
          task={{
            data: {},
            completed: true,
          }}
          user={{}}
          cleanPullRequestDataState={() => {}}
          getTaskSolution={() => {}}
          fetchPullRequestData={() => {}}
          completed={true}
        />
      </BrowserRouter>
    );
    
    userEvent.type(await screen.findByTestId('pull-request-url'), 'test')
    jest.runAllTimers();
    expect(screen.getByTestId('send-solution-button')).toHaveAttribute('disabled');
  });
  it('should have all requirements to submit', async () => {
    const spy = jest.fn(new Promise((resolve) => {
      resolve({})
    }))
    const spyTaskSolution = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({
          pullRequestURL: 'https://github.com/alexanmtz/test-repository/pull/2',
          taskId: 1,
          userId: 1,
        })
      })
    })
    render(
      <BrowserRouter router={router}>
        <TaskSolutionDialog
          pullRequestUrl={'https://github.com/alexanmtz/test-repository/pull/2'}
          taskSolution={{}}
          pullRequestData={{
            merged: true,
            pullRequestUrl: 'https://github.com/alexanmtz/test-repository/pull/2',
            isPRMerged: true,
            isIssueClosed: true,
            isConnectedToGitHub: true,
            hasIssueReference: true,
            isAuthorOfPR: true,
          }}
          task={{
            id: 1,
            data: {},
            completed: true,
          }}
          user={{
            id: 1,
            provider: 'github',
            provider_username: 'alexanmtz'
          }}
          cleanPullRequestDataState={() => {}}
          getTaskSolution={() => {}}
          fetchPullRequestData={() => ({
            state: 'closed',
            title: 'Fixes #1',
            body: 'Fixes #1',
            user: {
              login: 'alexanmtz'
            },
          })}
          completed={true}
          updateTaskSolution={spy}
          createTaskSolution={spyTaskSolution}
        />
      </BrowserRouter>
    );
    
    userEvent.type(await screen.findByTestId('pull-request-url'), 'https://github.com/alexanmtz/test-repository/pull/2')
    jest.runAllTimers();
    expect(screen.getByTestId('send-solution-button')).toBeEnabled();
    screen.getByTestId('send-solution-button').click()
    expect(spyTaskSolution).toHaveBeenCalled()
  });
  it('enable edit mode', async () => {
    render(
      <BrowserRouter router={router}>
        <TaskSolutionDialog
          pullRequestUrl={'https://github.com/alexanmtz/test-repository/pull/2'}
          taskSolution={{
            pullRequestURL: 'https://github.com/alexanmtz/test-repository/pull/2',
            isPRMerged: true,
            isIssueClosed: true,
            isConnectedToGitHub: true,
            hasIssueReference: true,
            isAuthorOfPR: true,
            taskId: 1,
            userId: 1,
            id: 1,
          }}
          pullRequestData={{
            
          }}
          task={{
            id: 1,
            data: {},
            completed: true,
          }}
          user={{
            id: 1,
            provider: 'github',
            provider_username: 'alexanmtz'
          }}
          cleanPullRequestDataState={() => {}}
          getTaskSolution={() => {}}
          fetchPullRequestData={() => ({
            state: 'closed',
            title: 'Fixes #1',
            body: 'Fixes #1',
            user: {
              login: 'alexanmtz'
            },
          })}
          completed={true}
          updateTaskSolution={() => {}}
          createTaskSolution={() => {}}
        />
      </BrowserRouter>

    );
    expect(screen.getByText('Pull Request # 2')).toBeDefined();
    //screen.getByTestId('edit-solution-button').click()
    //expect(screen.getByTestId('send-solution-button')).toBeEnabled();
  });

});