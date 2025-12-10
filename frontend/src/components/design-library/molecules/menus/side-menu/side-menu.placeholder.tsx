import React from 'react'
import { Skeleton, Typography } from '@mui/material'
import { MenuItemSection, MenuItemStyled, MenuListStyled } from './side-menu-items.styles'

const SidebarMenuPlaceholder: React.FC = () => {
  const widths = [
    92, 86, 78
  ]
  const sections = 3

  return (
    <div style={{ position: 'relative', width: 218 }}>
      <MenuListStyled>
        <MenuItemSection>
          <MenuItemStyled>
            <Skeleton
              key={'skeleton-main'}
              variant="text"
              animation="wave"
              height={24}
              width={'80%'}
              color="inherit"
            />
          </MenuItemStyled>
        </MenuItemSection>
        {Array.from({ length: sections }).map((_, idx) =>
          <MenuItemSection>
            <Typography
              variant="caption"
            >
              <Skeleton variant="text" animation="wave" height={16} width={80} color="inherit" />
            </Typography>
            {widths.map((w, i) => (
              <MenuItemStyled>
                <Skeleton
                  key={i}
                  variant="text"
                  animation="wave"
                  height={24}
                  width={`${w}%`}
                  color="inherit"
                />
              </MenuItemStyled>
            ))}
          </MenuItemSection>
        )}
      </MenuListStyled>
    </div>
  )
}

export default SidebarMenuPlaceholder
