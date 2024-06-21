import React, { useEffect } from 'react'
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
import { withRouter } from 'react-router'

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
  const { classes, profile } = props

  useEffect(() => {
    const userId = props.match.params.usernameId.split('-')[0]
    if (!isNaN(userId)) {
      props.getUserTypes(userId)
    }
  }, [props.match.params])

  return (
    <div className={ classes.profile }>
      <div>
        { profile.picture_url ? (
          <Avatar
            alt={ profile.username }
            src={ profile.picture_url }
            className={ classes.avatar }
          />
        ) : (
          <Avatar
            alt={ profile.username }
            src=''
            className={ classes.avatar }
          >
            { profile.name ? (
              nameInitials(profile.name)
            ) : profile.username ? (
              nameInitials(profile.username)
            ) : (
              <PersonIcon />
            ) }
          </Avatar>
        ) }
      </div>
      <div className={ classes.nameContainer }>
        <Typography component='h4' variant='h4'>{ profile.name }</Typography>
        <a target='_blank' href={ profile.profile_url } rel="noreferrer">
          <img width='20' src={ logoGithub } style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, marginLeft: 10 } } />
        </a>
      </div>
      <div>
        <Typography className={ classes.website }>
          <a href={ profile.website } target='__blank'>
            { profile.website &&
                        profile.website.replace(/^https?:\/\//, '') }
          </a>
        </Typography>
      </div>
      <div>
        { profile && profile.Types && profile.Types.map(r => {
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

export default withStyles(styles)(withRouter(ProfileHead))
