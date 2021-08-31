import React from 'react'
import nameInitials from 'name-initials'

import {
  withStyles,
  Typography,
  Chip,
  Avatar,
} from '@material-ui/core'

import {
  Person as PersonIcon
} from '@material-ui/icons'

const logoGithub = require('../../images/github-logo.png')

const styles = theme => ({
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '30px 30px 30px 30px',
    flexFlow: 'column',
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: 350
  },
  avatar: {
    width: 160,
    height: 160
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  website: {
    textAlign: 'center',
    color: '#515bc4',
    fontSize: '0.8rem',
  }
})

const ProfileHead = (props) => {
  const { classes, user } = props

  return (
    <div className={ classes.profile }>
      <div>
        { user.picture_url ? (
          <Avatar
            alt={ user.username }
            src={ user.picture_url }
            className={ classes.avatar }
          />
        ) : (
          <Avatar
            alt={ user.username }
            src=''
            className={ classes.avatar }
          >
            { user.name ? (
              nameInitials(user.name)
            ) : user.username ? (
              nameInitials(user.username)
            ) : (
              <PersonIcon />
            ) }
          </Avatar>
        ) }
      </div>
      <div className={ classes.nameContainer }>
        <Typography component='h4' variant='h4'>{ user.name }</Typography>
        <a target='_blank' href={ user.profile_url }>
          <img width='20' src={ logoGithub } style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, marginLeft: 10 } } />
        </a>
      </div>
      <div>
        <Typography className={ classes.website }>
          <a href={ user.website } target='__blank'>
            { user.website &&
                        user.website.replace(/^https?:\/\//, '') }
          </a>
        </Typography>
      </div>
      <div>
        { user && user.Types && user.Types.map(r => {
          return (
            <Chip
              style={ { marginRight: 10 } }
              label={ r.name }
            />
          )
        }) }
      </div>
    </div>
  )
}

export default withStyles(styles)(ProfileHead)
