/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import TeamCard from '../team-card'

const renderWithIntl = (content, { locale = 'en', messages = {} } = {}) =>
  render(
    <IntlProvider locale={locale} messages={messages}>
      {content}
    </IntlProvider>
  )

xdescribe('TeamCard component', () => {
  it('should render with no data', () => {
    renderWithIntl(<TeamCard />)
    expect(screen.getByTestId('team-card')).toBeInTheDocument()
  })

  it('should render with data', () => {
    renderWithIntl(<TeamCard data={[{ name: 'foo' }]} />)
    expect(screen.getByText('foo')).toBeInTheDocument()
  })
})
