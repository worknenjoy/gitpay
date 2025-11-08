import React from 'react'
import { Typography } from '@mui/material'
import { ListStyled, ListItemButtonStyled, TitleStyled } from './vertical-menu-list.styles'
import BottomSectionDialog from 'design-library/molecules/dialogs/bottom-section-dialog/bottom-section-dialog'

type VerticalMenuListProps = {
  type?: 'link' | 'dialog'
  title: React.ReactNode | string
  items: { 
    label: React.ReactNode | string
    onClick?: () => void
    component?: React.ReactNode
  }[]
}

const VerticalMenuList = ({
  type = 'link',
  title,
  items
}: VerticalMenuListProps) => {

  const [ open, setOpen ] = React.useState(-1)

  return (
    <>
      <TitleStyled>
        {title}
      </TitleStyled>
      <ListStyled>
        {items.map((item, index) => (
          <ListItemButtonStyled key={index}>
            <Typography
              variant="subtitle1"
              style={{ display: 'block', width: '100%' }}
              {...type === 'link' ? { onClick: item.onClick } : { onClick: () => setOpen(index) }}
            >
              {item.label}
            </Typography>
          </ListItemButtonStyled>
        ))}
      </ListStyled>
      { type === 'dialog' && open >= 0 && items[open].component &&
        <BottomSectionDialog
          title={ items[open].label }
          content={ items[open].component }
          open={ !!items[open].component }
          onClose={ () => setOpen(-1) }
        />
      }
    </>
  )
}

export default VerticalMenuList