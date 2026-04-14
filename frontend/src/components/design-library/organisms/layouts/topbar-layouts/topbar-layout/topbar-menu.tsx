import React from 'react'
import { LinkButton, LabelButton, LinkButtonsListStyled } from './TopbarStyles'
import useMainNavItems from '../../../../../../hooks/use-main-nav-items'
import { useHistory } from 'react-router'

type TopbarMenuProps = {
  onClick?: () => void
}

export const TopbarMenu = ({ onClick }: TopbarMenuProps) => {
  const menuItems = useMainNavItems()
  const history = useHistory()

  const handleClick = (itemClick: { path?: string }) => {
    onClick?.()
    if(itemClick.path) history.push(itemClick.path)
  }

  return (
    <LinkButtonsListStyled>
      {menuItems.map((item, index) => (
        <LinkButton
          key={index}
          onClick={() => handleClick(item)}
          variant="text"
          size="small"
          color="primary"
        >
          <LabelButton>{item.label}</LabelButton>
        </LinkButton>
      ))}
    </LinkButtonsListStyled>
  )
}

export default TopbarMenu
