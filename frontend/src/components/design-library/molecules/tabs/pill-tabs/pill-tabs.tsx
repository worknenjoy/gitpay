import React from 'react'
import BaseTabs from '../base-tabs/base-tabs'
import { Root } from './pill-tabs.styles'

type PillTabsProps = {
  tabs: Array<{ label: React.ReactNode; value: string | number; disabled?: boolean }>
  activeTab?: string | number
  onChange?: (event: React.SyntheticEvent, newValue: string | number) => void
  children?: React.ReactNode
}

/** A segmented-pill switcher — same tab machinery as BaseTabs, styled to read as a
 *  compact toggle group (e.g. "Services / Bounties") rather than an underlined tab bar. */
const PillTabs = ({ tabs, activeTab, onChange, children }: PillTabsProps) => (
  <Root>
    <BaseTabs tabs={tabs} activeTab={activeTab} onChange={onChange} withCard={false}>
      {children}
    </BaseTabs>
  </Root>
)

export default PillTabs
