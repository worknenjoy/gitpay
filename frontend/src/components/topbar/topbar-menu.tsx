
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  LinkButton,
  LabelButton
} from './TopbarStyles'


export const TopbarMenu = ({
  history
}) => {

  const handleHowItWorks = () => {
    window.location.assign('/#/welcome')
  }

  const handlePricing = () => {
    window.location.assign('/#/pricing')
  }

  const handleTeamLink = () => {
    window.location.assign('/#/team')
  }

  const handleDocsLink = () => {
    window.open('https://docs.gitpay.me/en')
  }

  const handleViewTasks = () => {
    window.location.assign('/#/tasks/open')
  }

  return (
    <>
      <LinkButton
        onClick={ handleHowItWorks }
        variant='text'
        size='small'
        color='primary'
      >
        <LabelButton>
          <FormattedMessage
            id='topbar.link.about'
            defaultMessage='About us' />
        </LabelButton>
      </LinkButton>

      <LinkButton
        onClick={ handlePricing }
        variant='text'
        size='small'
        color='primary'
      >
        <LabelButton>
          <FormattedMessage
            id='topbar.link.prices'
            defaultMessage='Prices' />
        </LabelButton>
      </LinkButton>

      <LinkButton
        onClick={ handleTeamLink }
        variant='text'
        size='small'
        color='primary'
      >
        <LabelButton>
          <FormattedMessage
            id='task.actions.team'
            defaultMessage='Team' />
        </LabelButton>
      </LinkButton>

      <LinkButton
        onClick={ handleDocsLink }
        variant='text'
        size='small'
        color='primary'
      >
        <LabelButton>
          <FormattedMessage
            id='task.actions.docs'
            defaultMessage='Documentation' />
        </LabelButton>
      </LinkButton>

      <LinkButton
        onClick={ handleViewTasks }
        variant='text'
        size='small'
        color='primary'
      >
        <LabelButton>
          <FormattedMessage
            id='topbar.link.explore'
            defaultMessage='Explore' />
        </LabelButton>
      </LinkButton>
    </>
  )
}

export default TopbarMenu