import React, { useEffect } from 'react';
import useCommonActions from '../../../../../../hooks/use-common-actions'
import IssuePublicPageComponent from 'design-library/pages/public-pages/issue-public-page/issue-public-page'
import { useHistory, useParams } from 'react-router-dom';

const IssuePublicPage = (props) => {
  const { fetchTask } = props;
  const { id } = useParams<{ id: string }>();
  
  const commonProps = useCommonActions(props);

  useEffect(() => {
    if (fetchTask) {
      fetchTask(id);
    }
  }, [fetchTask, id]);

  return (
    <IssuePublicPageComponent
      { ...props }
      { ...commonProps }
    />
  );
}

export default IssuePublicPage;
