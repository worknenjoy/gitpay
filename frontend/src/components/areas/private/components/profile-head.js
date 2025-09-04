import React, { useEffect } from 'react'
import nameInitials from 'name-initials'

import {
  Typography,
  Chip,
  Avatar
} from '@mui/material'
import { styled } from '@mui/material/styles'

import {
  Person as PersonIcon
} from '@mui/icons-material'
import { withRouter } from 'react-router'

import logoGithub from 'images/github-logo.png'

const Profile = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '30px',
  flexFlow: 'column',
  flexDirection: 'column',
  flexWrap: 'wrap',
  height: 350
}))

const BigAvatar = styled(Avatar)({ width: 160, height: 160 })

const NameContainer = styled('div')({ display: 'flex', alignItems: 'center' })

const Website = styled(Typography)({ textAlign: 'center', color: '#515bc4', fontSize: '0.8rem' })

const ProfileHead = (props) => {
  const { profile } = props

  useEffect(() => {
    const userId = props.match.params.usernameId.split('-')[0]
    if (!isNaN(userId)) {
      props.getUserTypes(userId)
    }
  }, [props.match.params])

  return (
    <Profile>
      <div>
        { profile.picture_url ? (
          <BigAvatar
            alt={ profile.username }
            src={ profile.picture_url }
          />
        ) : (
          <BigAvatar
            alt={ profile.username }
            src=""
          >
            { profile.name ? (
              nameInitials(profile.name)
            ) : profile.username ? (
              nameInitials(profile.username)
            ) : (
              <PersonIcon />
            ) }
          </BigAvatar>
        ) }
      </div>
      <NameContainer>
        <Typography component="h4" variant="h4">{ profile.name }</Typography>
        <a target="_blank" href={ profile.profile_url } rel="noreferrer">
          <img width="20" src={ logoGithub } style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, marginLeft: 10 } } />
        </a>
      </NameContainer>
      <div>
        <Website>
          <a href={ profile.website } target="__blank">
            { profile.website &&
                        profile.website.replace(/^https?:\/\//, '') }
          </a>
        </Website>
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
    </Profile>
  )
}

export default withRouter(ProfileHead)
