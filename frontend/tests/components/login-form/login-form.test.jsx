/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from '../../../src/components/design-library/molecules/form-section/login-form/login-form-main/login-form'

// Instantiate router context
const router = {
  history: {},
  route: {
    location: {
      pathname: '/'
    },
    match: {}
  }
}

xdescribe('Components - Session - LoginForm', () => {
  it('should render and fill the form with invalid email', async () => {
    render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" />
      </BrowserRouter>
    )

    userEvent.type(await screen.findByLabelText(/E-mail/i), 'test')
    userEvent.click(await screen.findByTestId('signup-button'))
    const emailField = await screen.findByLabelText(/E-mail/i)
    expect(emailField.id).toBe('username')
    expect(emailField.value).toBe('test')
    expect(await screen.findByText(/Invalid email/i)).toBeDefined()
  })
  it('should render and fill the form with a valid email', async () => {
    render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" />
      </BrowserRouter>
    )

    await userEvent.type(await screen.findByLabelText(/E-mail/i), 'test@example.com')
    await userEvent.click(await screen.findByTestId('signup-button'))
    const emailField = await screen.findByLabelText(/E-mail/i)
    expect(emailField.id).toBe('username')
    expect(emailField.value).toBe('test@example.com')
    expect(await screen.findByText(/Password cannot be empty or too short/i)).toBeDefined()
  })
  it('should render and fill the form with a valid email and password', async () => {
    render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" />
      </BrowserRouter>
    )

    userEvent.type(await screen.findByLabelText(/E-mail/i), 'test@example.com')
    userEvent.type(await screen.findByLabelText('Password'), '1234')
    userEvent.click(await screen.findByTestId('signup-button'))
    const emailField = await screen.findByLabelText(/E-mail/i)
    expect(emailField.id).toBe('username')
    expect(emailField.value).toBe('test@example.com')
    expect(await screen.findByText(/Password dont match/i)).toBeDefined()
  })
  it('should render and fill the form with a valid email and password and confirm password', async () => {
    const { findByLabelText, findByTestId, findByText, unmount } = render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" />
      </BrowserRouter>
    )

    await userEvent.type(await findByLabelText(/E-mail/i), 'test@example.com')
    await userEvent.type(await findByLabelText('Password'), '1234')
    await userEvent.type(await findByLabelText('Confirm Password'), '1234')
    await userEvent.click(await findByTestId('signup-button'))
    const emailField = await findByLabelText(/E-mail/i)

    expect(emailField.id).toBe('username')
    expect(emailField.value).toBe('test@example.com')
    expect(
      await findByText(/You must agree with the Terms of Service and Privacy Policy/i)
    ).toBeDefined()
    unmount()
  }, 10000)

  it('should render and fill the form with a valid email and password and confirm password with more than 72 characters', async () => {
    const { findByLabelText, findByTestId, findByText, unmount } = render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" />
      </BrowserRouter>
    )

    await userEvent.type(
      await findByLabelText(/E-mail/i),
      'test-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-test@example.com'
    )
    await userEvent.type(
      await findByLabelText('Password'),
      'test-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-test'
    )
    await userEvent.type(
      await findByLabelText('Confirm Password'),
      'test-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-test'
    )
    await userEvent.click(await findByTestId('agree-terms-checkbox'))
    await userEvent.click(await findByTestId('signup-button'))

    expect(await findByText(/Email cannot be longer than 72 characters/i)).toBeDefined()
    unmount()
  }, 1000000)

  it('should render and fill the form with a valid email and password and confirm password with more than 72 characters', async () => {
    const { findByLabelText, findByTestId, findByText, unmount } = render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" />
      </BrowserRouter>
    )

    await userEvent.type(await findByLabelText(/E-mail/i), 'test@example.com')
    await userEvent.type(
      await findByLabelText('Password'),
      'test-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-test'
    )
    await userEvent.type(
      await findByLabelText('Confirm Password'),
      'test-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-testtest-another-test-test-test-test'
    )
    await userEvent.click(await findByTestId('agree-terms-checkbox'))
    await userEvent.click(await findByTestId('signup-button'))
    const emailField = await findByLabelText(/E-mail/i)
    expect(await findByText(/Password cannot be longer than 72 characters/i)).toBeDefined()
    unmount()
  }, 1000000)

  it('should render and fill the form with a valid email and password and confirm password and accepting the terms but name is too big', async () => {
    const onRegisterUser = jest.fn(() => Promise.resolve({ data: {} }))
    const { findByLabelText, findByTestId, unmount, findByText } = render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" registerUser={onRegisterUser} />
      </BrowserRouter>
    )
    await userEvent.type(
      await findByLabelText(/Name/i),
      'A big name with big letters and big words and big everything and other stuff A big name with big letters and big words and big everything and other stuff A big name with big letters and big words and big everything and other stuff A big name with big letters and big words and big everything and other stuff A big A big name with big letters and big words and big everything and other stuff'
    )
    await userEvent.type(await findByLabelText(/E-mail/i), 'test@example.com')
    await userEvent.type(await findByLabelText('Password'), '1234')
    await userEvent.type(await findByLabelText('Confirm Password'), '1234')
    await userEvent.click(await findByTestId('agree-terms-checkbox'))
    await userEvent.click(await findByTestId('signup-button'))

    expect(await findByText(/Name cannot be longer than 72 characters/i)).toBeDefined()
    unmount()
  }, 1000000)

  it('should render and fill the form with a valid email and password and confirm password and accepting the terms but name has url', async () => {
    const onRegisterUser = jest.fn(() => Promise.resolve({ data: {} }))
    const { findByLabelText, findByTestId, unmount, findByText } = render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" registerUser={onRegisterUser} />
      </BrowserRouter>
    )
    await userEvent.type(await findByLabelText(/Name/i), 'Test with url https://alexandremagno.net')
    await userEvent.type(await findByLabelText(/E-mail/i), 'test@example.com')
    await userEvent.type(await findByLabelText('Password'), '1234')
    await userEvent.type(await findByLabelText('Confirm Password'), '1234')
    await userEvent.click(await findByTestId('agree-terms-checkbox'))
    await userEvent.click(await findByTestId('signup-button'))
    expect(await findByText(/Name should not include URL/i)).toBeDefined()
    unmount()
  }, 1000000)

  it('should render and fill the form with a valid email and password and confirm password and accepting the terms', async () => {
    const onRegisterUser = jest.fn(() => Promise.resolve({ data: {} }))
    const { findByLabelText, findByTestId, unmount } = render(
      <BrowserRouter router={router}>
        <LoginForm mode="signup" registerUser={onRegisterUser} />
      </BrowserRouter>
    )

    await userEvent.type(await findByLabelText(/E-mail/i), 'test@example.com')
    await userEvent.type(await findByLabelText('Password'), '1234')
    await userEvent.type(await findByLabelText('Confirm Password'), '1234')
    await userEvent.click(await findByTestId('agree-terms-checkbox'))
    await userEvent.click(await findByTestId('signup-button'))
    const emailField = await findByLabelText(/E-mail/i)

    expect(emailField.id).toBe('username')
    expect(emailField.value).toBe('test@example.com')
    expect(onRegisterUser).toHaveBeenCalled()
    unmount()
  })
})
