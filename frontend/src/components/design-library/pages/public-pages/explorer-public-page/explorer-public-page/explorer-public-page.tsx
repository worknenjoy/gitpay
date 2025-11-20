import React from 'react'
import { FormattedMessage } from 'react-intl'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import ExploreTabs from 'design-library/molecules/tabs/explore-tabs/explore-tabs'
import { RootContainer } from './explorer-public-page.styles'

const ExplorerPublicPage = ({ children }) => {
  return (
    <RootContainer maxWidth="lg">
      <MainTitle
        title={
          <FormattedMessage
            id="issues.explore.header.title"
            defaultMessage="Explore issues, projects and organizations"
          />
        }
      />
      <div style={{ marginTop: 24 }}>
        <ExploreTabs>{children}</ExploreTabs>
      </div>
    </RootContainer>
  )
}

export default ExplorerPublicPage
