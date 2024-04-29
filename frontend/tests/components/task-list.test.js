/**
 * @jest-environment jsdom
 */

jest.mock('@sindresorhus/slugify', () => ({
  __esModule: true,
  default: (text) => text
}));

jest.mock('prop-types', () => ({
  __esModule: true,
  func: () => {},
  object: () => {},
  string: () => {},
  oneOf: () => {},
  oneOfType: () => {},
  shape: () => {},
  arrayOf: () => {},
  number: () => {},
  bool: () => {}
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  BrowserRouter: ({ children }) => children,
}));

import React from 'react';
import { render, screen } from '@testing-library/react'
import TaskList from '../../src/components/task/task-list';

import { BrowserRouter } from 'react-router-dom';

// Instantiate router context
const router = {
  history: {},
  route: {
    location: {
      pathname: '/',
    },
    match: {},
  },
};

xdescribe('Components - Task - TaskList', () => {
  xit('should render TaskList', async () => {
    render(
      <BrowserRouter router={router}>
        <TaskList />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Invalid email/i)).toBeDefined()
  });
});