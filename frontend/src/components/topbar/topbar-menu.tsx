import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  LinkButton,
  LabelButton
} from './TopbarStyles'


export const TopbarMenu = ({
  history
}) => {

  const menuItems = [
    { onClick: () => window.location.assign('/#/welcome'), id: 'topbar.link.about', defaultMessage: 'About us' },
    { onClick: () => window.location.assign('/#/pricing'), id: 'topbar.link.prices', defaultMessage: 'Prices' },
    { onClick: () => window.location.assign('/#/team'), id: 'task.actions.team', defaultMessage: 'Team' },
    { onClick: () => window.open('https://docs.gitpay.me/en'), id: 'task.actions.docs', defaultMessage: 'Documentation' },
    { onClick: () => window.location.assign('/#/tasks/open'), id: 'topbar.link.explore', defaultMessage: 'Explore' }
  ];

  return (
    <>
      {menuItems.map((item, index) => (
        <LinkButton
          key={index}
          onClick={item.onClick}
          variant='text'
          size='small'
          color='primary'
        >
          <LabelButton>
            <FormattedMessage
              id={item.id}
              defaultMessage={item.defaultMessage} />
          </LabelButton>
        </LinkButton>
      ))}
    </>
  )
}

export default TopbarMenu
