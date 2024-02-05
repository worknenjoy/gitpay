import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid, Button, MenuList, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Home, Business, LibraryBooks, Payment as PaymentIcon, AccountBalance as TransferIcon, SwapHoriz as PayoutIcon } from '@material-ui/icons'
import classNames from 'classnames'
import logo from '../../images/gitpay-logo.png'
import {
  Logo,
  StyledButton
} from '../topbar/TopbarStyles'
import logoGithub from '../../images/github-logo.png'
import logoBitbucket from '../../images/bitbucket-logo.png'

import api from '../../consts'

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
    } else if(path.includes('/profile/transfers')) {
      setSelected(6)
    } else if(path.includes('/profile/payouts')) {
      setSelected(7)
    } else {
      setSelected(0)
    }
  }, [history.location.pathname])

  return (
    <Grid item xs={ 12 } md={ 2 } spacing={ 0 } className={ classes.sidePaper }>
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
                  { userTypes?.includes('maintainer') &&
                    <MenuItem
                      onClick={ () =>
                        history.push('/profile/user/orgs')
                      }
                      className={ classes.menuItem }
                      selected={ selected === 3 }
                    >
                      <ListItemIcon className={ classes.icon }>
                        <Business />
                      </ListItemIcon>
                      <ListItemText
                        classes={ { primary: classes.primary } }
                        primary={
                          <span>
                            <FormattedMessage
                              id='account.profile.organization.maintainer'
                              defaultMessage='Organizations'
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
                  { userTypes && (userTypes?.includes('contributor') || userTypes?.includes('maintainer')) &&
                    <MenuItem
                      onClick={ () =>
                        history.push('/profile/transfers')
                      }
                      className={ classes.menuItem }
                      selected={ selected === 6 }
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
                      selected={ selected === 7 }
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
            { false &&
              <Grid
                container
                direction='column'
                justifyContent='center'
                alignItems='center'
                className={ classes.rowList }
              >
                <Grid item className={ classNames(classes.rowContent) }>
                  <Button
                    disabled={ user.provider === 'github' }
                    href={ `${api.API_URL}/authorize/github` }
                    variant='outlined'
                    size='medium'
                    className={
                      user.provider === 'github'
                        ? 'buttons-disabled'
                        : 'buttons'
                    }
                  >
                    Connect to Github
                    <img width='16' src={ logoGithub } className='icon' />
                  </Button>
                </Grid>
                <Grid item className={ classNames(classes.rowContent) }>
                  <Button
                    disabled={ user.provider === 'bitbucket' }
                    href={ `${api.API_URL}/authorize/bitbucket` }
                    variant='contained'
                    size='medium'
                    className={
                      user.provider === 'bitbucket'
                        ? 'buttons-disabled'
                        : 'buttons'
                    }
                  >
                    Connect to Bitbucket
                    <img
                      width='16'
                      src={ logoBitbucket }
                      className='icon'
                    />
                  </Button>
                </Grid>
              </Grid> }
          </div>
        </div>
      </div>
    </Grid>
  )
}

export default ProfileSidebar