import React from 'react'
import { Root, IconBadge, Text, Label, Sub, Link } from './role-section-header.styles'

export type RoleSectionHeaderProps = {
  icon: React.ReactNode
  label: React.ReactNode
  sub?: React.ReactNode
  linkText?: React.ReactNode
  onLinkClick?: (e: any) => void
}

// A per-role section header for the multi-role Overview — an icon badge, a
// label + one-line summary, and a link out to that role's own full dashboard.
const RoleSectionHeader = ({ icon, label, sub, linkText, onLinkClick }: RoleSectionHeaderProps) => (
  <Root>
    <IconBadge>{icon}</IconBadge>
    <Text>
      <Label>{label}</Label>
      {sub && <Sub>{sub}</Sub>}
    </Text>
    {linkText && <Link onClick={onLinkClick}>{linkText}</Link>}
  </Root>
)

export default RoleSectionHeader
