import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  LinkButton,
  LabelButton
} from './TopbarStyles';

const menuItems = [
  {
    label: <FormattedMessage
            id='topbar.link.about'
            defaultMessage='About us' />,
    action: () => window.location.assign('/#/welcome'),
    variant: 'text',
    size: 'small',
    color: 'primary'
  },
  {
    label: <FormattedMessage
            id='topbar.link.prices'
            defaultMessage='Prices' />,
    action: (history) => history.push('/pricing'),
    variant: 'text',
    size: 'small',
    color: 'primary'
  },
  {
    label: <FormattedMessage
            id='task.actions.team'
            defaultMessage='Team' />,
    action: () => window.location.assign('/#/team'),
    variant: 'text',
    size: 'small',
    color: 'primary'
  },
  {
    label: <FormattedMessage
            id='task.actions.docs'
            defaultMessage='Documentation' />,
    action: () => window.open('https://docs.gitpay.me/en'),
    variant: 'text',
    size: 'small',
    color: 'primary'
  },
  {
    label: <FormattedMessage
            id='topbar.link.explore'
            defaultMessage='Explore' />,
    action: (history) => history.push('/tasks/open'),
    variant: 'text',
    size: 'small',
    color: 'primary'
  }
]

export const TopbarMenu = ({
  history
}) => {

  return (
    <>
      {menuItems.map(item => (
        <LinkButton
          onClick={() => item.action(history)}
          variant={item.variant}
          size={item.size}
          color={item.color}
        >
          <LabelButton>
            {item.label}
          </LabelButton>
        </LinkButton>
      ))}
    </>
  )
}

export default TopbarMenu