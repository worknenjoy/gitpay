import React from 'react'
import StatCard, { StatCardProps } from './stat-card'
import { Wrapper } from './stat-group-card.styles'

export type StatGroupCardItem = StatCardProps & { id?: string | number }

type StatGroupCardProps = {
  stats: StatGroupCardItem[]
}

const StatGroupCard = ({ stats }: StatGroupCardProps) => (
  <Wrapper>
    {stats.map(({ id, ...stat }, index) => (
      <StatCard key={id ?? index} {...stat} />
    ))}
  </Wrapper>
)

export default StatGroupCard
