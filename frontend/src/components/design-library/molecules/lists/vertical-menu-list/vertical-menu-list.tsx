import { List, ListItemButton, Typography } from '@mui/material'
import BottomSectionDialog from 'design-library/molecules/dialogs/bottom-section-dialog/bottom-section-dialog'
import React from 'react'

type VerticalMenuListProps = {
  type?: 'link' | 'dialog'
  title: string | React.ReactNode
  items: { 
    label: string;
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
      <Typography component="div">
        <strong>{title}</strong>
      </Typography>
      <List component="nav">
        {items.map((item, index) => (
          <ListItemButton component="a" key={index}>
            <Typography
              variant="subtitle1"
              component="div"
              style={{ display: 'block', width: '100%' }}
              {...type === 'link' ? { onClick: item.onClick } : { onClick: () => setOpen(index) }}
            >
              {item.label}
            </Typography>
          </ListItemButton>
        ))}
      </List>
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