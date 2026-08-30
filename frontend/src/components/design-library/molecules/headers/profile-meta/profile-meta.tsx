import React from 'react'
import { Root, Line, Sep, Chip, Dot } from './profile-meta.styles'

export type AvailabilityChip = {
  label: React.ReactNode
  dot?: boolean
  warn?: boolean
}

type ProfileMetaProps = {
  /** e.g. ["Joined Mar 2019", "127 issues solved"] */
  identity?: React.ReactNode[]
  /** e.g. [{ label: "Open for job opportunities", dot: true }] */
  availability?: AvailabilityChip[]
  /** e.g. ["215 contributors across repos", "$17,020 paid out"] */
  context?: React.ReactNode[]
}

const JoinedLine = ({ items }: { items: React.ReactNode[] }) => (
  <Line>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <Sep />}
        <span>{item}</span>
      </React.Fragment>
    ))}
  </Line>
)

const ProfileMeta = ({ identity = [], availability = [], context = [] }: ProfileMetaProps) => {
  if (identity.length === 0 && availability.length === 0 && context.length === 0) {
    return null
  }

  return (
    <Root>
      {identity.length > 0 && <JoinedLine items={identity} />}
      {availability.length > 0 && (
        <Line>
          {availability.map((chip, i) => (
            <Chip key={i}>
              {chip.dot && <Dot $warn={chip.warn} />}
              {chip.label}
            </Chip>
          ))}
        </Line>
      )}
      {context.length > 0 && <JoinedLine items={context} />}
    </Root>
  )
}

export default ProfileMeta
