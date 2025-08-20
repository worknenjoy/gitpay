import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { Button, Card, CardContent, CardActions, Typography, styled } from '@mui/material';

const useStyles = styled({
  root: {
    maxWidth: 500,
    margin: 10,
    textAlign: 'right',
    padding: 10
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  name: {
    fontSize: 18
  }
});

type StatusCardProps = {
  name: string | React.ReactNode;
  status: number;
  onAdd?: (e: any) => void;
  action?: React.PropsWithChildren<any>;
  actionProps?: any;
  completed?: boolean;
}

const StatusCard = ({ name, status, onAdd, action, actionProps, completed }: StatusCardProps) => {
  const classes = useStyles();

  return (

    <Card className={classes.root}>
      <CardContent>
        <ReactPlaceholder
          showLoadingAnimation={true}
          type="text"
          ready={completed}
          rows={2}
        >
          <Typography className={classes.name} color="textSecondary" gutterBottom>
            {name}
          </Typography>
          <Typography className={classes.balance} color="primary">
            {status}
          </Typography>
        </ReactPlaceholder>
      </CardContent>
      {onAdd && action && (
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={onAdd}
            {...actionProps}
          >
            {action}
          </Button>
        </CardActions>
      )}

    </Card>

  );
};

export default StatusCard;
