/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckoutFormPure } from '../../../../../../../design-library/organisms/forms/payment-forms/credit-card-payment-form/credit-card-payment-form'
import '@testing-library/jest-dom'

xdescribe('CheckoutFormPure component', () => {
  it('renders input fields', () => {
    render(<CheckoutFormPure />)

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('fills and submits the form', () => {
    render(<CheckoutFormPure />)

    const fullNameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    fireEvent.change(fullNameInput, { target: { value: 'Foo me' } })
    fireEvent.change(emailInput, { target: { value: 'foo@mail.com' } })

    fireEvent.click(submitButton)

    expect(fullNameInput.value).toBe('Foo me')
    expect(emailInput.value).toBe('foo@mail.com')
  })

  it('prefills name and email from user prop', () => {
    render(
      <CheckoutFormPure
        user={{
          id: 1,
          name: 'Foo me',
          email: 'foo@mail.com'
        }}
      />
    )

    const fullNameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email/i)

    expect(fullNameInput.value).toBe('Foo me')
    expect(emailInput.value).toBe('foo@mail.com')
  })
})
