import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import ExplorerPublicPage from 'design-library/pages/public-pages/explorer-public-page/explorer-public-page/explorer-public-page'
import IssueExplorerContainer from '../../../../../../containers/explore/issue-explorer'
import ProjectExplorerContainer from '../../../../../../containers/explore/project-explorer'
import OrganizationExplorerContainer from '../../../../../../containers/explore/organization-explorer'

const ExplorePublicPage = () => {
  return (
    <>
      <ExplorerPublicPage>
        <HashRouter>
          <Switch>
            <Route exact path="/explore" component={() => <Redirect to="/explore/issues" />} />
            <Route exact path="/explore/issues" component={IssueExplorerContainer} />
            <Route exact path="/explore/projects" component={ProjectExplorerContainer} />
            <Route exact path="/explore/organizations" component={OrganizationExplorerContainer} />
          </Switch>
        </HashRouter>
      </ExplorerPublicPage>
    </>
  )
}

export default ExplorePublicPage
