import React from 'react';
import Button from 'design-library/atoms/buttons/button/button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
    marginLeft: theme.spacing(1),
  }
}));

const DrawerActions = ({ actions, completed = true }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { actions.map ((action, index) => (
        <Button 
          onClick={action.onClick}
          variant={action.variant}
          color={action.color}
          disabled={action.disabled}
          label={action.label}
          completed={completed}
        />
      ))}
    </div>
  );
};

export default DrawerActions;