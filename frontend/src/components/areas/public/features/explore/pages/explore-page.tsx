import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import ExplorerPublicPage from "design-library/pages/public-pages/explorer-public-page/explorer-public-page/explorer-public-page";
import IssueExplorerContainer from "../../../../../../containers/issue-explorer";

const ExplorePublicPage = () => {
  return (
    <>
      <ExplorerPublicPage>
        <HashRouter>
          <Switch>
            <Route exact path="/explore" component={ () => <Redirect to="/explore/issues/open" /> } />
            <Route exact path="/explore/issues/:filter" component={ IssueExplorerContainer } />
          </Switch>
        </HashRouter>
      </ExplorerPublicPage>
    </>
  );
  
};

export default ExplorePublicPage;
