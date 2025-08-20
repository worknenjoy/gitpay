import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';
import useStyles from './action-buttons.styles';


interface ActionButtonsProps {
  primary: any[];
  secondary: any[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ primary, secondary }) => {
  const [ currentKey, setCurrentKey ] = React.useState('');
  const classes = useStyles();

  const actionClick = (key:string, onClick: any) => {
    setCurrentKey(key);
    onClick?.();
  }

  return (
    <div>
      {primary?.map((action, index) => (
        <>
          <div className={classes.primaryWrapper}>
            <Button
              onClick={() => actionClick(action.key, action.onClick)}
              color="primary"
              fullWidth
              size="large"
              variant="contained"
              disabled={action.disabled}
              endIcon={action.icon}
            >
              <span className={classes.primaryLabel}>
          <FormattedMessage id={action.label} />
              </span>
            </Button>
          </div>
          {action.component && React.cloneElement(action.component, { open: action.key === currentKey, onClose: () => setCurrentKey('') })}
        </>
      ))}
      <div className={classes.secondaryContainer}>
        {secondary?.map((action, index) => (
          <>
            <Button
              onClick={() => actionClick(action.key, action.onClick)}
              size="small"
              color="secondary"
              variant="contained"
              disabled={action.disabled}
              fullWidth
              className={classes.secondaryButton}
              endIcon={action.icon}
            >
              <span className={classes.secondaryLabel}>
                {action.label}
              </span>
            </Button>
            {action.component && React.cloneElement(action.component, { open: action.key === currentKey, onClose: () => setCurrentKey('') })}
          </>
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;