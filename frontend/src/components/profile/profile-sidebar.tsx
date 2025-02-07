import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid, Button, MenuList, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { 
  Home,
  AccountBalanceWallet as WalletIcon,
  LibraryBooks,
  Payment as PaymentIcon,
  AccountBalance as TransferIcon,
  SwapHoriz as PayoutIcon,
  Public as ExploreIcon
} from '@material-ui/icons'
import logo from '../../images/gitpay-logo.png'
import {
  Logo,
  StyledButton
} from '../topbar/TopbarStyles'
import { SideMenu } from '../design-library/molecules/side-menu/side-menu'

const ProfileSidebar = ({
  classes,
  user,
  history
}) => {
  const [selected, setSelected] = useState(0)
  const userTypes = user.Types && user.Types.map(t => t.name)

  useEffect(() => {
    const path = history.location.pathname
    if (path.includes('/profile/tasks')) {
      setSelected(4)
    } else if (path.includes('/profile/user/orgs')) {
      setSelected(3)
    } else if (path.includes('/profile/payments')) {
      setSelected(5)
    } else if(path.includes('/profile/wallets')) {
      setSelected(6)
    } else if(path.includes('/profile/transfers')) {
      setSelected(7)
    } else if(path.includes('/profile/payouts')) {
      setSelected(8)
    } else {
      setSelected(0)
    }
  }, [history.location.pathname])

  return (
    <Grid item xs={ 12 } md={ 2 } spacing={ 0 } className={ classes.sidePaper }>
      <SideMenu
        menuItems={
          [
            {
              items: [
                {
                  include: true,
                  onClick: () => history.push('/profile'),
                  icon: <Home />,
                  label: <FormattedMessage id='account.profile.sidemenu.home.link.label' defaultMessage='Dashboard' />,
                  selected: selected === 0
                }
              ]
            },
            {
              category: <FormattedMessage id='account.profile.sidemenu.issues' defaultMessage='Issues' />,
              items: [
                {
                  include: userTypes && (userTypes?.includes('contributor') || userTypes?.includes('maintainer')),
                  onClick: () => history.push('/profile/tasks'),
                  icon: <LibraryBooks />,
                  label: <FormattedMessage id='account.profile.sidemenu.issues.network' defaultMessage='My issues' />,
                  selected: selected === 4
                },
                {
                  include: userTypes && (userTypes?.includes('contributor') || userTypes?.includes('funding')),
                  onClick: () => history.push('/profile/tasks/explore'),
                  icon: <ExploreIcon />,
                  label: <FormattedMessage id='account.profile.sidemenu.issues.explore' defaultMessage='Explore issues' />
                }
              ]
            },
            {
              category: <FormattedMessage id='account.profile.sidemenu.section.bounties' defaultMessage='Bounties' />,
              items: [
                {
                  include: userTypes && (userTypes?.includes('funding') || userTypes?.includes('maintainer')),
                  onClick: () => history.push('/profile/payments'),
                  icon: <PaymentIcon />,
                  label: <FormattedMessage id='account.profile.payments.list' defaultMessage='Payments' />,
                  selected: selected === 5
                },
                {
                  include: userTypes && (userTypes?.includes('funding') || userTypes?.includes('maintainer')),
                  onClick: () => history.push('/profile/wallets'),
                  icon: <WalletIcon />,
                  label: <FormattedMessage id='account.profile.wallet.list' defaultMessage='Wallets' />,
                  selected: selected === 6
                },
                {
                  include: userTypes && userTypes?.includes('contributor'),
                  onClick: () => history.push('/profile/transfers'),
                  icon: <TransferIcon />,
                  label: <FormattedMessage id='account.profile.transfer.list' defaultMessage='Transfers' />,
                  selected: selected === 7
                },
                {
                  include: userTypes && userTypes?.includes('contributor'),
                  onClick: () => history.push('/profile/payouts'),
                  icon: <PayoutIcon />,
                  label: <FormattedMessage id='account.profile.payout.list' defaultMessage='Payouts' />,
                  selected: selected === 8
                }
              ]
            }
          ]
        }
      />
      <div>
        <div>
          <div className={ classes.profile }>
            <div style={ { display: 'flex', justifyContent: 'center', padding: 20 } }>
              <StyledButton href='/'>
                <Logo src={ logo } />
              </StyledButton>
            </div>
            <div className={ classes.row }>
              <div style={ {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: 20
              } }>
                <MenuList>
                  <MenuItem
                    onClick={ (e) => history.push('/profile')}
                    className={ classes.menuItem }
                    selected={ selected === 0 }
                    
                  >
                    <ListItemIcon className={ classes.icon }>
                      <Home />
                    </ListItemIcon>
                    <ListItemText
                      classes={ { primary: classes.primary } }
                      primary={
                        <span>
                          <FormattedMessage
                            id='account.profile.home.link.label'
                            defaultMessage='Dashboard'
                          />
                        </span>
                      }
                    />
                  </MenuItem>
                  { userTypes && (userTypes?.includes('contributor') || userTypes?.includes('maintainer')) &&
                    <MenuItem
                      onClick={ (e) => history.push('/profile/tasks')}
                      className={ classes.menuItem }
                      selected={ selected === 4 }
                    >
                      <ListItemIcon className={ classes.icon }>
                        <LibraryBooks />
                      </ListItemIcon>
                      <ListItemText
                        classes={ { primary: classes.primary } }
                        primary={
                          <span>
                            <FormattedMessage
                              id='account.profile.issues.setup'
                              defaultMessage='Issues'
                            />
                          </span>
                        }
                      />
                    </MenuItem>
                  }
                  { userTypes && (userTypes?.includes('funding') || userTypes?.includes('maintainer')) &&
                    <MenuItem
                      onClick={ () =>
                        history.push('/profile/payments')
                      }
                      className={ classes.menuItem }
                      selected={ selected === 5 }
                    >
                      <ListItemIcon className={ classes.icon }>
                        <PaymentIcon />
                      </ListItemIcon>
                      <ListItemText
                        classes={ { primary: classes.primary } }
                        primary={
                          <span>
                            <FormattedMessage
                              id='account.profile.payments.list'
                              defaultMessage='Payments'
                            />
                          </span>
                        }
                      />
                    </MenuItem>
                  }
                  { userTypes && (userTypes?.includes('funding') || userTypes?.includes('maintainer')) &&
                    <MenuItem
                      onClick={ () =>
                        history.push('/profile/wallets')
                      }
                      className={ classes.menuItem }
                      selected={ selected === 6 }
                    >
                      <ListItemIcon className={ classes.icon }>
                        <WalletIcon />
                      </ListItemIcon>
                      <ListItemText
                        classes={ { primary: classes.primary } }
                        primary={
                          <span>
                            <FormattedMessage
                              id='account.profile.wallet.list'
                              defaultMessage='Wallets'
                            />
                          </span>
                        }
                      />
                    </MenuItem>
                  }
                  { userTypes && (userTypes?.includes('contributor') || userTypes?.includes('maintainer')) &&
                    <MenuItem
                      onClick={ () =>
                        history.push('/profile/transfers')
                      }
                      className={ classes.menuItem }
                      selected={ selected === 7 }
                    >
                      <ListItemIcon className={ classes.icon }>
                        <TransferIcon />
                      </ListItemIcon>
                      <ListItemText
                        classes={ { primary: classes.primary } }
                        primary={
                          <span>
                            <FormattedMessage
                              id='account.profile.transfer.list'
                              defaultMessage='Transfers'
                            />
                          </span>
                        }
                      />
                    </MenuItem>
                  }
                  { userTypes && (userTypes?.includes('contributor')) &&
                    <MenuItem
                      onClick={ () =>
                        history.push('/profile/payouts')
                      }
                      className={ classes.menuItem }
                      selected={ selected === 8 }
                    >
                      <ListItemIcon className={ classes.icon }>
                        <PayoutIcon />
                      </ListItemIcon>
                      <ListItemText
                        classes={ { primary: classes.primary } }
                        primary={
                          <span>
                            <FormattedMessage
                              id='account.profile.payout.list'
                              defaultMessage='Payouts'
                            />
                          </span>
                        }
                      />
                    </MenuItem>
                  }
                </MenuList>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  )
}

export default ProfileSidebar