import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkButton, LabelButton } from './TopbarStyles'

export const TopbarMenu = () => {
  const menuItems = [
    {
      onClick: () => window.location.assign('/#/welcome'),
      message: <FormattedMessage id="topbar.link.about" defaultMessage="About us" />,
    },
    {
      onClick: () => window.location.assign('/#/pricing'),
      message: <FormattedMessage id="topbar.link.prices" defaultMessage="Prices" />,
    },
    {
      onClick: () => window.location.assign('/#/team'),
      message: <FormattedMessage id="task.actions.team" defaultMessage="Team" />,
    },
    {
      onClick: () => window.open('https://docs.gitpay.me/en'),
      message: <FormattedMessage id="task.actions.docs" defaultMessage="Documentation" />,
    },
    {
      onClick: () => window.location.assign('/#/tasks/open'),
      message: <FormattedMessage id="topbar.link.explore" defaultMessage="Explore" />,
    },
  ]

  return (
    <>
      {menuItems.map((item, index) => (
        <LinkButton key={index} onClick={item.onClick} variant="text" size="small" color="primary">
          <LabelButton>{item.message}</LabelButton>
        </LinkButton>
      ))}
    </>
  )
}

export default TopbarMenu
