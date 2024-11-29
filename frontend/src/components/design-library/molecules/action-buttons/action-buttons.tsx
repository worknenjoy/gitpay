import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@material-ui/core';


interface ActionButtonsProps {
  primary: any[];
  secondary: any[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ primary, secondary }) => {
  const [ currentKey, setCurrentKey ] = React.useState('');

  const actionClick = (key:string, onClick: any) => {
    setCurrentKey(key);
    onClick?.();
  }

  return (
    <div>
      {primary?.map((action, index) => (
        <>
          <div style={{ marginTop: 30, marginBottom: 10 }}>
            <Button
              onClick={() => actionClick(action.key, action.onClick)}
              color='primary'
              fullWidth
              size='large'
              variant='contained'
              disabled={action.disabled}
              endIcon={action.icon}
            >
              <span style={{ display: 'inline-block', marginRight: 10 }}>
          <FormattedMessage id={action.label} />
              </span>
            </Button>
          </div>
          {action.component && React.cloneElement(action.component, { open: action.key === currentKey, onClose: () => setCurrentKey('') })}
        </>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        {secondary?.map((action, index) => (
          <>
            <Button
              onClick={() => actionClick(action.key, action.onClick)}
              size='small'
              color='secondary'
              variant='contained'
              disabled={action.disabled}
              fullWidth
              style={{ marginRight: 5 }}
              endIcon={action.icon}
            >
              <span style={{ display: 'inline-block', marginRight: 10 }}>
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