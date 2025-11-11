import React, { useEffect } from 'react'
import nameInitials from 'name-initials'

import {
  Typography,
  Chip,
} from '@mui/material'

import {
  Person as PersonIcon
} from '@mui/icons-material'
import { useParams } from 'react-router'
import { Profile, BigAvatar, NameContainer, Website } from './profile-user-header.styles'

import logoGithub from 'images/github-logo.png'


const ProfileUserHeader = ({ profile, getUserTypes }) => {

  const { usernameId } = useParams<{ usernameId: string }>()

  useEffect(() => {
    const userId = parseInt(usernameId?.split('-')[0])
    if (!isNaN(userId)) {
      getUserTypes?.(userId)
    }
  }, [usernameId])

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

export default ProfileUserHeader
