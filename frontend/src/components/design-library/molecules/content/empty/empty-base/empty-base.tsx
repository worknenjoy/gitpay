import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '../../../../atoms/buttons/button/button';
import { Root, IconWrapper, Message } from './empty-base.styles'

type EmptyBaseProps = {
  onActionClick: () => void;
  icon?: React.ReactElement<{ className?: string }>;
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
      <IconWrapper>
        {icon && React.cloneElement(icon, { className: undefined })}
      </IconWrapper>
      <Typography variant="h6" component={Message as any}>
        {text}
      </Typography>
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
