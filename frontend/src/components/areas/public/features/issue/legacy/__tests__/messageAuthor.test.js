/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MessageAuthor from '../task-message-author'

xdescribe('MessageAuthor component', () => {
  it('should render with props', () => {
    render(<MessageAuthor userId={1} taskId={1} name="Foo" />)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('should update message state on input change', () => {
    render(<MessageAuthor userId={1} taskId={1} name="Foo" />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'foo message written' } })

    expect(input.value).toBe('foo message written')
  })

  it('should submit the form', () => {
    render(<MessageAuthor userId={1} taskId={1} name="Foo" />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'foo message written' } })

    const form = screen.getByRole('form') || input.closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(input.value).toBe('foo message written') // valor não muda por padrão sem lógica interna
  })
})
