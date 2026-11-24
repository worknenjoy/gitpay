import React from 'react'
import { Tooltip } from '@mui/material'
import {
  Stack,
  StackAvatar,
  AvatarStackSize,
  AVATAR_COLORS,
  ANONYMOUS_COLOR
} from './avatar-stack.styles'

export type AvatarStackPerson = {
  name: string
  avatarUrl?: string
  anonymous?: boolean
}

export type AvatarStackProps = {
  people: AvatarStackPerson[]
  size?: AvatarStackSize
  /** Show at most this many avatars, then a "+N" bubble. */
  max?: number
  /** Show each name in a tooltip. */
  withTooltip?: boolean
}

export const avatarColor = (person: AvatarStackPerson) => {
  if (person.anonymous) return ANONYMOUS_COLOR
  const hash = Array.from(person.name || '').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

const initial = (name: string) => (name || '?').trim().charAt(0).toUpperCase()

const AvatarStack = ({ people, size = 'md', max, withTooltip = true }: AvatarStackProps) => {
  if (!people || people.length === 0) return null
  const visible = max ? people.slice(0, max) : people
  const rest = people.length - visible.length

  return (
    <Stack>
      {visible.map((person, index) => {
        const avatar = (
          <StackAvatar
            key={`${person.name}-${index}`}
            size={size}
            first={index === 0}
            bg={avatarColor(person)}
            src={person.avatarUrl}
            alt={person.name}
          >
            {initial(person.name)}
          </StackAvatar>
        )
        return withTooltip ? (
          <Tooltip key={`${person.name}-${index}`} title={person.name}>
            {avatar}
          </Tooltip>
        ) : (
          avatar
        )
      })}
      {rest > 0 && (
        <StackAvatar size={size} bg={ANONYMOUS_COLOR}>
          +{rest}
        </StackAvatar>
      )}
    </Stack>
  )
}

export default AvatarStack
