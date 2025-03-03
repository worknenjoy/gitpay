import React from 'react';
import { useIntl } from 'react-intl';

import messages from '../../../../../../areas/public/features/task/messages/task-messages'

const IssuePriceField = ({ issue }) => {
  const intl = useIntl();
  const { value } = issue;
  return (
    <div style={{ width: 70, textAlign: 'center' }}>
      {value ? (value === '0' ? intl.formatMessage(messages.noBounty) : `$ ${value}`) : intl.formatMessage(messages.noBounty)}
    </div>
  );
};

export default IssuePriceField;