import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Redeem as RedeemIcon,
  CreditCard as BountyIcon,
  HowToReg as HowToRegIcon,
} from '@material-ui/icons';
import IssueActions from '../../design-library/organisms/issue-actions/issue-actions';
import TaskPaymentContainer from '../../../containers/task-payment';
import TaskPaymentFormContainer from '../../../containers/task-payment-form';
import TaskSolutionDrawer from '../../../containers/send-solution-drawer';

interface IssueActionsProps {
  currentRole: string;
  children?: React.ReactNode;
}

const IssueActionsByRole = ({
  currentRole,
}:IssueActionsProps) => {
  const commonAction = {
    key: 'add-bounty',
    onClick: () => {},
    label: 'Add bounty',
    disabled: false,
    icon: <BountyIcon fontSize='small' />,
    component: <TaskPaymentFormContainer />,
  }
  const roles = {
    admin: {
      primary: [
        {
          key: 'pay-contributor',
          onClick: () => {},
          label: 'Pay contributor',
          disabled: false,
          icon: <RedeemIcon fontSize='small' />,
          component: <TaskPaymentContainer />,
        },
      ],
      secondary: [
        commonAction
      ],
    },
    user: {
      primary: [
        {
          key: 'send-solution',
          onClick: () => {},
          label: 'Send solution',
          disabled: false,
          icon: <HowToRegIcon fontSize='small' />,
          component: <TaskSolutionDrawer />,
        },
      ],
      secondary: [
        commonAction
      ],
    },
  }
  return (
    <IssueActions
      role={currentRole}
      roles={roles}
    />
  );
};

export default IssueActionsByRole;