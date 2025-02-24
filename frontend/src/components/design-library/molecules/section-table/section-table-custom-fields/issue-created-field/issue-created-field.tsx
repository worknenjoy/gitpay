import React from 'react';
import { useIntl } from 'react-intl';
import MomentComponent from 'moment'

import messages from '../../../../../areas/public/features/task/messages/task-messages'

const IssueCreatedField = ({ issue }) => {
  const intl = useIntl();
  const { createdAt } = issue;
  return (
    <div style={{ width: 120 }}>
      {createdAt ? MomentComponent(createdAt).fromNow() : intl.formatMessage(messages.noDefined)}
    </div>
  );
};

export default IssueCreatedField;