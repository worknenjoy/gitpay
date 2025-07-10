import React from 'react';
import { useIntl } from 'react-intl';

import messages from '../../../../../../../areas/public/features/task/messages/task-messages'

const AmountField = ({ value }) => {
  const intl = useIntl();
  return (
    <div style={{ width: 70, textAlign: 'center' }}>
      {value ? (value === '0' ? intl.formatMessage(messages.noBounty) : `$ ${value}`) : intl.formatMessage(messages.noBounty)}
    </div>
  );
};

export default AmountField;