import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { MenuList, MenuItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import logo from '../../../../images/gitpay-logo.png'
import {
  Logo,
  StyledButton
} from '../../organisms/topbar/TopbarStyles'

const useStyles = makeStyles((theme) => ({
  sidePaper: {
    backgroundColor: '#2c5c46',
    height: '100%',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  menuItem: {
    marginTop: 10,
    marginBottom: 10,
    /*
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      '& $primary, & $icon': {
        color: theme.palette.primary.main
      }
    }
    */
  },
  primary: {
    color: theme.palette.primary.contrastText
  },
  icon: {
    marginRight: 5,
    color: theme.palette.primary.contrastText
  },
  profile: {
    '& .profile-image': {
      width: 80,
      height: 80,
      objectFit: 'cover',
      maxWitdh: '100%',
      borderRadius: '50%',
      marginBottom: 8,
      border: '4px solid white',
    },
    '& .name': {
      textAlign: 'center',
      color: theme.palette.primary.dark,
      fontSize: '1.2rem',
    },
    '& .website': {
      textAlign: 'center',
      color: '#515bc4',
      fontSize: '0.8rem',
    },
    '& .details': {
      textAlign: 'center',
      marginTop: 10,
      padding: '12px 0 5px 0',
      backgroundColor: '#4D7E6F',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .details-mid': {
      textAlign: 'center',
      marginTop: 10,
      padding: '12px 0 5px 0',
      backgroundColor: '#4D7E6F',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .num': {
      color: '#eee',
      fontSize: '1.5rem',
    },
    '& .buttons': {
      background: 'transparent',
      width: '220px',
      height: '50px',
      textTransform: 'none',
      marginTop: '25px',
      borderRadius: 0,
      justifyContent: 'center',
      border: '2px solid white',
      color: 'white',
    },
    '& .buttons-disabled': {
      background: 'transparent',
      width: '220px',
      height: '50px',
      textTransform: 'none',
      marginTop: '25px',
      borderRadius: 0,
      justifyContent: 'center',
      border: '2px solid #999',
      color: '#999',
    },
    '& .icon': {
      height: '25px',
      width: '25px',
      marginLeft: 15,
    },
  }
}))


interface MenuItemProps {
  include: boolean;
  onClick: () => void;
  icon: React.ReactElement;
  label: React.ReactNode;
  selected?: boolean;
}

interface SideMenuProps {
  menuItems: {
    category?: React.ReactNode;
    items: MenuItemProps[];
  }[];
}

export const SideMenu: React.FC<SideMenuProps> = ({
  menuItems
}) => {
  const classes = useStyles()
  const [selected, setSelected] = useState(0)

  return (
    <div className={classes.sidePaper}>
      <div>
        <div className={classes.profile}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 20, paddingBottom: 0 }}>
            <StyledButton href='/'>
              <Logo src={logo} />
            </StyledButton>
          </div>
          <div className={classes.row}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: 20
            }}>
              <MenuList>
                {menuItems.map((section, sectionIndex) => (
                  <div key={`section-${sectionIndex}`}>
                    {section.category && (
                    <Typography
                      variant="caption"
                      style={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        marginTop: sectionIndex === 0 ? 0 : 16,
                        marginBottom: 16,
                        paddingLeft: 16,
                      }}
                    >
                      {section.category}
                    </Typography>
                    )}
                    {section.items.map((item, index) => (
                      item.include && (
                        <MenuItem
                          key={`item-${sectionIndex}-${index}`}
                          onClick={item.onClick}
                          className={classes.menuItem}
                          selected={item.selected}
                        >
                          <ListItemIcon className={classes.icon}>{item.icon}</ListItemIcon>
                          <ListItemText classes={{ primary: classes.primary }} primary={item.label} />
                        </MenuItem>
                      )
                    ))}
                  </div>
                ))}
              </MenuList>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}