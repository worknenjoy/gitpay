import React from 'react'
import BaseTabs from '../base-tabs/base-tabs'

const ExploreTabs = ({ children }) => {
  const tabs = [
    { label: 'Issues', value: '0', link: '/explore/issues' },
    { label: 'Projects', value: '1', link: '/explore/projects' },
    { label: 'Organizations', value: '2', link: '/explore/organizations' },
  ]

  return (
    <>
      <BaseTabs tabs={tabs} activeTab={'0'} withCard={false}>
        {children}
      </BaseTabs>
    </>
  )
}

export default ExploreTabs
