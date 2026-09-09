import React from 'react'
import { Typography } from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'
import nameInitials from 'name-initials'
import Button from 'design-library/atoms/buttons/button/button'
import RolePill from 'design-library/atoms/badges/role-pill/role-pill'
import VerifiedBadge from 'design-library/atoms/badges/verified-badge/verified-badge'
import CountryLine from 'design-library/atoms/data-display/country-line/country-line'
import LinkChip, { LinkChipProps } from 'design-library/atoms/data-display/link-chip/link-chip'
import AvailabilityChip from 'design-library/atoms/status/availability-chip/availability-chip'
import ShareBar from 'design-library/molecules/content/share-bar/share-bar'
import {
  Root,
  ShareRow,
  AvatarWrap,
  BigAvatar,
  VerifiedBadgeSlot,
  Block,
  LinksRow,
  CtaRow,
  MetaLine,
  MetaSeparator,
  MetaBlock
} from './profile-header.styles'

/** Profile types this header supports. Only 'contributor' is wired to a page today —
 * maintainer/provider are listed so the header's contract doesn't need to change
 * when those variants are implemented. */
export type ProfileType = 'contributor' | 'maintainer' | 'provider'

export type ProfileHeaderAction = {
  key: string
  label: React.ReactNode
  variant?: 'filled' | 'ghost' | 'accent'
}

export type ProfileHeaderProps = {
  profileType: ProfileType
  username: string
  name: string
  pictureUrl?: string
  verified?: boolean
  country?: { flagEmoji?: string; name: string; utcOffset?: string }
  links?: LinkChipProps[]
  role?: { name: string; tone?: 'orange' | 'teal' | 'yellow' }
  actions?: ProfileHeaderAction[]
  onAction?: (key: string) => void
  identity?: string[]
  availability?: { label: string; active?: boolean }[]
  shareUrl: string
}

const buttonPropsForVariant = (variant: ProfileHeaderAction['variant'] = 'filled') => {
  switch (variant) {
    case 'accent':
      return { variant: 'contained' as const, color: 'secondary' as const }
    case 'ghost':
      return { variant: 'outlined' as const, color: 'inherit' as const }
    default:
      return {
        variant: 'contained' as const,
        color: 'inherit' as const,
        sx: {
          bgcolor: 'text.primary',
          color: 'background.paper',
          '&:hover': { bgcolor: 'text.primary' }
        }
      }
  }
}

const ProfileHeader = ({
  profileType,
  username,
  name,
  pictureUrl,
  verified,
  country,
  links = [],
  role,
  actions = [],
  onAction,
  identity = [],
  availability = [],
  shareUrl
}: ProfileHeaderProps) => (
  <Root data-profile-type={profileType}>
    <ShareRow>
      <ShareBar url={shareUrl} label={username} />
    </ShareRow>

    <AvatarWrap>
      <BigAvatar alt={name} src={pictureUrl}>
        {!pictureUrl && (name ? nameInitials(name) : <PersonIcon />)}
      </BigAvatar>
      {verified && (
        <VerifiedBadgeSlot>
          <VerifiedBadge size="small" />
        </VerifiedBadgeSlot>
      )}
    </AvatarWrap>

    <Block>
      <Typography
        component="h1"
        variant="h6"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          mb: 0.5
        }}
      >
        {name}
      </Typography>
      {country && (
        <CountryLine
          flagEmoji={country.flagEmoji}
          countryName={country.name}
          utcOffset={country.utcOffset}
        />
      )}
      {identity.length > 0 && (
        <MetaLine sx={{ mt: 1 }}>
          {identity.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <MetaSeparator />}
              <Typography component="span" variant="caption" color="text.secondary">
                {item}
              </Typography>
            </React.Fragment>
          ))}
        </MetaLine>
      )}
    </Block>

    {links.length > 0 && (
      <Block>
        <LinksRow>
          {links.map((link) => (
            <LinkChip key={link.href} {...link} />
          ))}
        </LinksRow>
      </Block>
    )}

    {role && (
      <Block>
        <RolePill name={role.name} active tone={role.tone} />
        {actions.length > 0 && (
          <CtaRow>
            {actions.map((cta) => (
              <Button
                key={cta.key}
                label={cta.label}
                onClick={() => onAction?.(cta.key)}
                {...buttonPropsForVariant(cta.variant)}
              />
            ))}
          </CtaRow>
        )}
      </Block>
    )}

    {availability.length > 0 && (
      <MetaBlock>
        <MetaLine>
          {availability.map((item) => (
            <AvailabilityChip key={String(item.label)} label={item.label} active={item.active} />
          ))}
        </MetaLine>
      </MetaBlock>
    )}
  </Root>
)

export default ProfileHeader
