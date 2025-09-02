import React from 'react';
import { Box } from '@mui/material';
import Button from '../../../../atoms/buttons/button/button';
import { Root, Message, IconContainer } from './empty-base.styles'

type EmptyBaseProps = {
  onActionClick: () => void;
  icon?: React.ReactElement;
  text: string | React.ReactNode;
  actionText: string | React.ReactNode;
  completed?: boolean;
};

const EmptyBase = ({ 
  onActionClick,
  icon,
  text,
  actionText,
  completed = true
}: EmptyBaseProps) => {
  return (
    <Box component={Root as any}>
      {icon && (
        <IconContainer>
          {icon}
        </IconContainer>
      )}
      <Message variant="h6" gutterBottom>
        {text}
      </Message>
      <Button 
        variant="contained"
        color="secondary"
        onClick={onActionClick}
        completed={completed}
        label={actionText}
      />
    </Box>
  );
};

export default EmptyBase;
