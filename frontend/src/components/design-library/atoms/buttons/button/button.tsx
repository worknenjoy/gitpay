import React from 'react';
import { Button as MaterialButton } from '@mui/material';
import styles from './button.styles';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
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
  completed = true,
  onClick
}:ButtonProps) => {
  const { Progress } = styles as any;
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
        {!completed && (<Progress size={24} color="inherit" />)}
      </>
    </MaterialButton>
  );
}
export default Button;