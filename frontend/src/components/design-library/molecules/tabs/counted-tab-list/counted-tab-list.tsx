import React from 'react'
import { Tabs, Typography, Box } from '@mui/material'
import { StyledTab } from './counted-tab-list.styles'

export type CountedTabItem = {
  value: string
  label: React.ReactNode
  count: number
}

export type CountedTabListProps = {
  items: CountedTabItem[]
  value: string
  /**
   * Presentational only in this phase: updates which tab is visually active,
   * but does not filter/refetch the dataset shown below it — every item here
   * currently shares the same underlying data. Wire this to real per-tab
   * datasets once the backend distinguishes them.
   */
  onChange?: (value: string) => void
}

const CountedTabList = ({ items, value, onChange }: CountedTabListProps) => (
  <Tabs
    value={value}
    onChange={(_, newValue) => onChange?.(newValue)}
    textColor="secondary"
    indicatorColor="secondary"
    variant="scrollable"
    scrollButtons="auto"
    sx={{ mb: 2.5 }}
  >
    {items.map((item) => (
      <StyledTab
        key={item.value}
        value={item.value}
        label={
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.75 }}>
            <Typography component="span" variant="inherit">
              {item.label}
            </Typography>
            <Typography component="span" variant="caption" className="count">
              {item.count}
            </Typography>
          </Box>
        }
      />
    ))}
  </Tabs>
)

export default CountedTabList
