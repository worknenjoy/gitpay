import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { MenuList, MenuItem, ListItemIcon, ListItemText, Typography, Tooltip, IconButton } from '@material-ui/core'
import logo from 'images/gitpay-logo.png'
import responsiveLogo from 'images/logo-symbol.png'
import {
  Logo,
  StyledButton
} from '../../../organisms/layouts/topbar/TopbarStyles'
import ReactPlaceholder from 'react-placeholder'
import SideMenuPlaceholder from './side-menu.placeholder'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const useStyles = makeStyles((theme) => ({
  sidePaper: (props: { collapsed: boolean }) => ({
    backgroundColor: '#2c5c46',
    height: '100%',
    width: props.collapsed && 70 ,
    transition: 'width 0.3s ease'
  }),
  row: {
    display: 'flex',
    justifyContent: 'center'
  },
  menuItem: {
    marginTop: 10,
    marginBottom: 10
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
    color: theme.palette.primary.contrastText,
    fontSize: '11px !important',
    fontWeight: 500
    
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
      border: '4px solid white'
    },
    '& .name': {
      textAlign: 'center',
      color: theme.palette.primary.dark,
      fontSize: '1.2rem'
    },
    '& .website': {
      textAlign: 'center',
      color: '#515bc4',
      fontSize: '0.8rem'
    },
    '& .details': {
      textAlign: 'center',
      marginTop: 10,
      padding: '12px 0 5px 0',
      backgroundColor: '#4D7E6F',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    '& .details-mid': {
      textAlign: 'center',
      marginTop: 10,
      padding: '12px 0 5px 0',
      backgroundColor: '#4D7E6F',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    '& .num': {
      color: '#eee',
      fontSize: '1.5rem'
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
      color: 'white'
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
      color: '#999'
    },
    '& .icon': {
      height: '25px',
      width: '25px',
      marginLeft: 15
    }
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
  completed: boolean;
  menuItems: {
    category?: React.ReactNode;
    items: MenuItemProps[];
  }[];
}

export const SideMenu: React.FC<SideMenuProps> = ({
  completed,
  menuItems
}) => {
  const [collapsed, setCollapsed] = useState(false)
  const classes = useStyles({collapsed});

  return (
    <div className={classes.sidePaper}>
      <div className={classes.profile}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20, paddingBottom: 0 }}>
          <StyledButton href="/" >
            <Logo src={!collapsed?logo:responsiveLogo} style={{
              width:collapsed&&'50px'
            }}  />
             
          </StyledButton>
        </div>
        <div className={classes.row}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '5px 20px', position:'relative', zIndex:1 }}>
            <ReactPlaceholder ready={completed} customPlaceholder={<SideMenuPlaceholder />}>
        
            <IconButton onClick={() => setCollapsed(!collapsed)} style={{ color: 'white' , width:'30px',height:'30px', position:'absolute', right:0,top:-10, fontWeight:'bold',
              fontSize:'15px',padding:'3px', zIndex:5,backgroundColor:"#d3d3d3"}}>
                
              {!collapsed?<ChevronLeftIcon color="primary" /> : <ChevronRightIcon color="primary" />}
            </IconButton>
       
              <MenuList>
                {menuItems.map((section, sectionIndex) => (
                  <div key={`section-${sectionIndex}`}>
                    {section.category  && (
                      <Typography
                        variant="caption"
                        style={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: "0.58rem",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          marginTop: sectionIndex === 0 ? 0 : 16,
                          marginBottom: 16,
                          paddingLeft: 16
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
                          <Tooltip title={item.label} placement="right" disableHoverListener={!collapsed}>
                          <ListItemIcon className={classes.icon}>
                            <>{item.icon}</>
                          </ListItemIcon>
                          </Tooltip>
                          {!collapsed && (
                            <ListItemText
                              classes={{ primary: classes.primary }}
                              primary={item.label}
                            />
                          )}
                        </MenuItem>
                      )
                    ))}
                  </div>
                ))}
              </MenuList>
            </ReactPlaceholder>
          </div>
        </div>
      </div>
    </div>
  )
}