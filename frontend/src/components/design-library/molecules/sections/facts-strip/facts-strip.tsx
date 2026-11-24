import React from 'react'
import { Skeleton } from '@mui/material'
import HelpTooltip from 'design-library/atoms/data-display/help-tooltip/help-tooltip'
import { Root, Cell, Label, Value, Sub } from './facts-strip.styles'

export type Fact = {
  label: React.ReactNode
  /** Optional "?" explanation next to the label. */
  help?: React.ReactNode
  value: React.ReactNode
  /** Small line under the value, e.g. "22 days left". */
  sub?: React.ReactNode
}

export type FactsStripProps = {
  facts: Fact[]
  completed?: boolean
}

/** A bordered row of 2–4 label / value cells. Domain-agnostic. */
const FactsStrip = ({ facts, completed = true }: FactsStripProps) => {
  const visible = facts.filter(Boolean)
  if (visible.length === 0) return null

  return (
    <Root columns={visible.length}>
      {visible.map((fact, index) => (
        <Cell key={index}>
          <Label>
            {fact.label}
            {fact.help && <HelpTooltip label={fact.label} text={fact.help} />}
          </Label>
          {completed ? <Value>{fact.value}</Value> : <Skeleton variant="text" width="70%" />}
          {completed && fact.sub && <Sub>{fact.sub}</Sub>}
        </Cell>
      ))}
    </Root>
  )
}

export default FactsStrip
