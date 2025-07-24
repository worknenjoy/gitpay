import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import logo from 'images/gitpay-logo.png'
import {
  IconHamburger,
  LeftSide,
  Logo,
  MenuMobile,
  OnlyDesktop,
  OnlyMobile,
  RightSide,
  StyledButton
} from './side-menu.styled.div'
import ReactPlaceholder from 'react-placeholder'
import SideMenuPlaceholder from './side-menu.placeholder'
import SideMenuItems from './side-menu-items'

const useStyles = makeStyles((theme) => ({
  sidePaper: {
    backgroundColor: '#2c5c46',
    height: '100%'
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  mainHeaderWrapper: { 
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10
    }
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
    },
    [theme.breakpoints.down('sm')]: {
      //border: '1px solid red'
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
  const classes = useStyles()
  const [selected, setSelected] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const handleClickMenuMobile = () => {
    setIsActive(!isActive)
  }

  const menuItemsMobile = menuItems.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      onClick: () => {
        setIsActive(false)
        item.onClick()
      }
    }))
  }))

  return (
    <div className={classes.sidePaper}>
      <div>
        <div className={classes.profile}>
          <LeftSide isActive={isActive}>
            <div className={classes.mainHeaderWrapper}>
              <StyledButton href="/">
                <Logo src={logo} />
              </StyledButton>
              <MenuMobile
                onClick={handleClickMenuMobile}
                variant="text"
                size="small"
              >
                <IconHamburger isActive={isActive} />
              </MenuMobile>
            </div>
          </LeftSide>
          <RightSide isActive={isActive}>
            <div className={classes.row}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '5px 20px'
              }}>
                <ReactPlaceholder
                  ready={completed}
                  customPlaceholder={<SideMenuPlaceholder />}
                >
                  <OnlyDesktop>
                    <SideMenuItems menuItems={menuItems} />
                  </OnlyDesktop>

                  <OnlyMobile>
                    <SideMenuItems menuItems={menuItemsMobile} />
                  </OnlyMobile>

                </ReactPlaceholder>
              </div>

            </div></RightSide>
        </div>
      </div>
    </div>
  )
}