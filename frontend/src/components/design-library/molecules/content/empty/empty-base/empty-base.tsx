import React from 'react';
import { Box, Typography, SvgIconTypeMap } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import Button from '../../../../atoms/buttons/button/button';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    textAlign: 'center',
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper
  },
  icon: {
    fontSize: 72,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0)
  },
  message: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(5)
  }
}));

type EmptyBaseProps = {
  onActionClick: () => void;
  icon?: React.ReactElement<{ className?: string }>;
  text: string | React.ReactNode;
  actionText: string | React.ReactNode | OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  completed?: boolean;
};

const EmptyBase = ({ 
  onActionClick,
  icon,
  text,
  actionText,
  completed = true
}: EmptyBaseProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div className={classes.icon}>
        {icon && React.cloneElement(icon, { className: classes.icon })}
      </div>
      <Typography variant="h6" className={classes.message}>
        {text}
      </Typography>
      <Button 
        variant="contained"
        color="primary"
        onClick={onActionClick}
        completed={completed}
        label={actionText}
      />
    </Box>
  );
};

export default EmptyBase;
