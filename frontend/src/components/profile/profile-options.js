import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import {
  Typography,
  Button,
  CardActions,
  CardContent,
  withStyles
} from '@material-ui/core'

import { Card, CardList, CardMedia } from './ProfileStyles'
import WelcomeUser from '../session/welcome-user'

const taskIcon = require('../../images/task-icon.png')
const paymentIcon = require('../../images/payment-icon.png')
const toolsIcon = require('../../images/tools-icon.png')

const styles = theme => ({
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  }
})

class ProfileOptions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render () {
    const { classes, user } = this.props
    return (
      <Fragment>
        { window.localStorage.getItem('firstLogin') === 'true' && (
          <WelcomeUser />
        ) }
        <div>
          <div>
            <Typography variant='h5' component='h3'>
              <FormattedMessage
                id='account.profile.welcome.headline'
                defaultMessage='Welcome to Gitpay!'
              />
            </Typography>
            <Typography component='p'>
              <FormattedMessage
                id='account.profile.welcome.description'
                defaultMessage='This is the first steps to start to work with Gitpay'
              />
            </Typography>
          </div>

          <CardList>
            { user.Types && user.Types.map(t => t.name).includes('contributor') && 
              <Card>
                <FormattedMessage
                  id='account.profile.tasks.caption'
                  defaultMessage='Tasks'
                >
                  { msg => <CardMedia image={ taskIcon } title={ msg } /> }
                </FormattedMessage>
                <CardContent>
                  <Typography variant='h6'>
                    <FormattedMessage
                      id='account.profile.tasks.headline'
                      defaultMessage='Tasks'
                    />
                  </Typography>
                  <Typography variant='body2'>
                    <FormattedMessage
                      id='account.profile.tasks.description'
                      defaultMessage='Check the tasks available for you'
                    />
                  </Typography>
                </CardContent>
                <CardActions className={ classes.cardActions }>
                  <Button size='small' color='primary'>
                    <Link to={ '/profile/tasks' }>
                      <FormattedMessage
                        id='account.profile.tasks.link.tasks'
                        defaultMessage='See tasks'
                      />
                    </Link>
                  </Button>
                </CardActions>
              </Card>
            }
            { user.Types && user.Types.map(t => t.name).includes('maintainer') && 
              <Card>
                <FormattedMessage
                  id='account.profile.tasks.mine.caption'
                  defaultMessage='Issues'
                >
                  { msg => <CardMedia image={ taskIcon } title={ msg } /> }
                </FormattedMessage>
                <CardContent>
                  <Typography variant='h6'>
                    <FormattedMessage
                      id='account.profile.tasks.mine.headline'
                      defaultMessage='Your issues'
                    />
                  </Typography>
                  <Typography variant='body2'>
                    <FormattedMessage
                      id='account.profile.tasks.mine.description'
                      defaultMessage='The issues you created'
                    />
                  </Typography>
                </CardContent>
                <CardActions className={ classes.cardActions }>
                  <Button size='small' color='primary'>
                    <Link to={ '/profile/user/tasks' }>
                      <FormattedMessage
                        id='account.profile.tasks.mine.link.tasks'
                        defaultMessage='See issues'
                      />
                    </Link>
                  </Button>
                </CardActions>
              </Card>
            }
            { user.Types && user.Types.map(t => t.name).includes('contributor') && 
            <Card>
              <FormattedMessage
                id='account.profile.tasks.payment.caption'
                defaultMessage='Payment'
              >
                { msg => <CardMedia image={ paymentIcon } title={ msg } /> }
              </FormattedMessage>
              <CardContent>
                <Typography variant='h6'>
                  <FormattedMessage
                    id='account.profile.tasks.paid.headline'
                    defaultMessage='Receiving account'
                  />
                </Typography>
                <Typography variant='body2'>
                  <FormattedMessage
                    id='account.profile.tasks.bank.desc'
                    defaultMessage='Register your bank account to receive payments for issues you solved'
                  />
                </Typography>
              </CardContent>
              <CardActions className={ classes.cardActions }>
                <Button size='small' color='primary'>
                  <Link to={ '/profile/payment-options' }>
                    <FormattedMessage
                      id='account.profile.tasks.payment.setup'
                      defaultMessage='Setup payment'
                    />
                  </Link>
                </Button>
              </CardActions>
            </Card>
            }
            <Card>
              <CardMedia image={ toolsIcon } title='Contemplative Reptile' />
              <CardContent>
                <Typography variant='h6'>
                  <FormattedMessage
                    id='account.profile.preferences.headline'
                    defaultMessage='Preferences'
                  />
                </Typography>
                <Typography variant='body2'>
                  <FormattedMessage
                    id='account.profile.preferences.description'
                    defaultMessage='Setup your account with your preferences'
                  />
                </Typography>
              </CardContent>
              <CardActions className={ classes.cardActions }>
                <Button size='small' color='primary'>
                  <Link to='/profile/preferences'>
                    <FormattedMessage
                      id='account.profile.preferences.link'
                      defaultMessage='Setup preferences'
                    />
                  </Link>
                </Button>
              </CardActions>
            </Card>
            <Card>
              <CardMedia image={ toolsIcon } title='Contemplative Reptile' />
              <CardContent>
                <Typography variant='h6'>
                  <FormattedMessage
                    id='account.profile.roles.headline'
                    defaultMessage='Roles'
                  />
                </Typography>
                <Typography variant='body2'>
                  <FormattedMessage
                    id='account.profile.roles.description'
                    defaultMessage='Set your roles to define your capatibilities on Gitpay'
                  />
                </Typography>
              </CardContent>
              <CardActions className={ classes.cardActions }>
                <Button size='small' color='primary'>
                  <Link to='/profile/roles'>
                    <FormattedMessage
                      id='account.profile.roles.link'
                      defaultMessage='Setup your roles on Gitpay'
                    />
                  </Link>
                </Button>
              </CardActions>
            </Card>
          </CardList>
        </div>
      </Fragment>
    )
  }
}

export default injectIntl(withStyles(styles)(ProfileOptions))
