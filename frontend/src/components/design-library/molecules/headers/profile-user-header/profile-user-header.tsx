import React from 'react'
import nameInitials from 'name-initials'

import { Typography, Chip } from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'
import RolePill, { RoleTone } from 'design-library/atoms/badges/role-pill/role-pill'
import Button from 'design-library/atoms/buttons/button/button'
import ProfileMeta, {
  AvailabilityChip
} from 'design-library/molecules/headers/profile-meta/profile-meta'
import {
  Profile,
  BigAvatar,
  NameContainer,
  Website,
  RoleRow,
  CtaRow
} from './profile-user-header.styles'

import logoGithub from 'images/github-logo.png'

export type ProfileRole = {
  name: React.ReactNode
  tone: RoleTone
  active?: boolean
}

export type ProfileCta = {
  label: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: 'contained' | 'outlined'
  color?: 'primary' | 'secondary'
}

export type ProfileHeaderMeta = {
  identity?: React.ReactNode[]
  availability?: AvailabilityChip[]
  context?: React.ReactNode[]
}

type ProfileUserHeaderProps = {
  profile: any
  /** Role pills, replacing the raw `profile.Types` chip fallback. */
  roles?: ProfileRole[]
  /** CTA buttons under the role row, e.g. "Hire me" / "Sponsor". */
  cta?: ProfileCta[]
  /** Structured identity/availability/context lines (see ProfileMeta). */
  meta?: ProfileHeaderMeta
}

const ProfileUserHeader = ({ profile, roles, cta, meta }: ProfileUserHeaderProps) => {
  const extended = !!(roles || cta || meta)

  return (
    <Profile $extended={extended}>
      <div>
        {profile.picture_url ? (
          <BigAvatar alt={profile.username} src={profile.picture_url} />
        ) : (
          <BigAvatar alt={profile.username} src="">
            {profile.name ? (
              nameInitials(profile.name)
            ) : profile.username ? (
              nameInitials(profile.username)
            ) : (
              <PersonIcon />
            )}
          </BigAvatar>
        )}
      </div>
      <NameContainer>
        <Typography component="h4" variant="h4">
          {profile.name}
        </Typography>
        <a target="_blank" href={profile.profile_url} rel="noreferrer">
          <img
            width="20"
            src={logoGithub}
            style={{
              borderRadius: '50%',
              padding: 3,
              backgroundColor: 'black',
              borderColor: 'black',
              borderWidth: 1,
              marginLeft: 10
            }}
          />
        </a>
      </NameContainer>
      <div>
        <Website>
          <a href={profile.website} target="__blank">
            {profile.website && profile.website.replace(/^https?:\/\//, '')}
          </a>
        </Website>
      </div>
      <div>
        {roles
          ? roles.length > 0 && (
              <RoleRow>
                {roles.map((r, i) => (
                  <RolePill key={i} name={r.name} tone={r.tone} active={r.active ?? true} />
                ))}
              </RoleRow>
            )
          : profile &&
            profile.Types &&
            profile.Types.map((r) => {
              return <Chip key={r.id ?? r.name} style={{ marginRight: 10 }} label={r.name} />
            })}
      </div>
      {cta && cta.length > 0 && (
        <CtaRow>
          {cta.map((c, i) => (
            <Button
              key={i}
              variant={c.variant ?? 'contained'}
              color={c.color ?? 'secondary'}
              onClick={c.onClick}
              {...(c.href
                ? { component: 'a', href: c.href, target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              {c.label}
            </Button>
          ))}
        </CtaRow>
      )}
      {meta && <ProfileMeta {...meta} />}
    </Profile>
  )
}

export default ProfileUserHeader
