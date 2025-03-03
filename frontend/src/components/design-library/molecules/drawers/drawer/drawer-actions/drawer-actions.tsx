import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

const DrawerActions = ({ actions }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { actions.map ((action, index) => (
        <Button 
          onClick={action.onClick}
          variant={action.variant}
          color={action.color}
          className={classes.button}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default DrawerActions;