import React, { useEffect } from "react";
import ExplorerIssuePublicPage from "design-library/pages/public-pages/explorer-public-page/explorer-issue-public-page/explorer-issue-public-page";
import { useParams } from "react-router";

const ExploreIssuesPage = ({
  filteredTasks,
  filterTasks,
  listTasks,
  issues,
  labels,
  languages,
  listLabels,
  listLanguages
}) => {

  const { filter } = useParams<{ filter: string }>();

  useEffect(() => {
    listTasks({status: filter});
  }, [filter]);
  
  return (
    <>
      <ExplorerIssuePublicPage
        filteredTasks={filteredTasks}
        filterTasks={filterTasks}
        listTasks={listTasks}
        issues={issues}
        labels={labels}
        languages={languages}
        listLabels={listLabels}
        listLanguages={listLanguages}
      />
    </>
  )
}

export default ExploreIssuesPage