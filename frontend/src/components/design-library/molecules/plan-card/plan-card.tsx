import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, Grid, Typography, withStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import { Theme, createStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    planGridItem: {
      padding: theme.spacing(1),
      margin: 2
    },
    planContainer: {
      paddingTop: 5,
      paddingBottom: 5
    },
    planGrid: {
      margin: 0
    },
    planGridContent: {
      display: 'flex',
      justifyContent: 'space-evenly',
      minHeight: theme.spacing(2),
      margin: 0
    },
    planButton: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    planBullets: {
      paddingLeft: theme.spacing(1),
      padding: 5
    },
    planIcon: {
      textAlign: 'center',
      fontSize: 32,
      padding: 2
    },
  });

const PlanCard = ({ classes }) => {
  return (
    <Grid item className={classes.planGridItem}>
      <Card className={classes.planGrid}>
        <CardContent className={classes.planGridContent}>
          <div className={classes.planButton}>
            <MotorcycleIcon color={'primary'} className={classes.planIcon} />
            <Typography align='center' color='textPrimary' variant='h5'>
              <FormattedMessage id='actions.task.payment.plan.percentagefee' defaultMessage='{fee}% fee' values={{ fee: '8' }} />
            </Typography>
            <Typography align='center' color='textSecondary' variant='h6' gutterBottom>
              <FormattedMessage id='actions.task.payment.plan.opensource' defaultMessage='Open Source' />
            </Typography>
          </div>
          <div className={classes.planBullets}>
            <Typography align='center' variant='caption' gutterBottom>
              <FormattedMessage id='actions.task.payment.plan.opensource.info' defaultMessage='For Open Source Project' />
            </Typography>
            <Typography>
              <CheckIcon fontSize='small' color='primary' />
              <FormattedMessage id='actions.task.payment.plan.bullet.public' defaultMessage='For Public Projects' />
            </Typography>
            <Typography>
              <CheckIcon fontSize='small' color='primary' />
              <FormattedMessage id='actions.task.payment.plan.bullet.basic' defaultMessage='Basic Campaign' />
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Grid>

  );
}

export default withStyles(styles)(PlanCard)