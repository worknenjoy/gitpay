import React from 'react';
import {
  Redeem as RedeemIcon,
  CreditCard as BountyIcon,
  HowToReg as HowToRegIcon,
} from '@mui/icons-material';
import IssueActions from 'design-library/atoms/buttons/issue-actions/issue-actions';
import TaskPaymentFormContainer from '../../../../../containers/task-payment-form';
import TaskSolutionDrawer from '../../../../../containers/send-solution-drawer';

interface IssueActionsProps {
  issue: any;
  currentRole: string;
  children?: React.ReactNode;
}

const IssueActionsByRole = ({
  issue,
  currentRole,
}:IssueActionsProps) => {
  const { data } = issue;
  const shouldDisable = data?.paid || data?.transfer_id || data?.Transfer?.id;
  const commonAction = {
    key: 'add-bounty',
    onClick: () => {},
    label: 'Add bounty',
    disabled: shouldDisable,
    icon: <BountyIcon fontSize='small' />,
    component: <TaskPaymentFormContainer />,
  }
  const roles = {
    admin: {
      primary: [
        commonAction
      ]
    },
    user: {
      primary: [
        {
          key: 'send-solution',
          onClick: () => {},
          label: 'Send solution',
          disabled: shouldDisable,
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