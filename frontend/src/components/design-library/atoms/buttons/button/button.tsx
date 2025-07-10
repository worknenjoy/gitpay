import React from 'react';
import { Button as MaterialButton, CircularProgress } from '@material-ui/core';
import useStyles from './button.styles';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'default' | 'inherit' | 'primary' | 'secondary';
  label?: React.ReactNode;
  disabled?: boolean;
  completed?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({
  type,
  variant,
  color,
  label,
  disabled,
  completed,
  onClick
}:ButtonProps) => {
  const classes = useStyles();
  return (
    <MaterialButton
      type={type}
      variant={variant}
      color={color}
      disabled={!completed ? true : disabled}
      onClick={onClick}
    >
      <>
        {label}
        {!completed && (
          <CircularProgress className={classes.progress} size={24} color="inherit" />
        )}
      </>
    </MaterialButton>
  );
}
export default Button;