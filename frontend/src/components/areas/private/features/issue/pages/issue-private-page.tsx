import React, { useEffect } from 'react';
import IssuePrivatePageComponent from 'design-library/organisms/layouts/page-layouts/issue-page-layout/issue-page-layout'
import { useParams } from 'react-router-dom';

const IssuePrivatePage = (props) => {
  const { fetchTask, syncTask } = props;
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    if (fetchTask) {
      fetchTask(id);
    }
    if (syncTask) {
      syncTask(id);
    }
  }, [id]);
  

  return (
    <IssuePrivatePageComponent
      { ...props }
    />
  );
}

export default IssuePrivatePage;
