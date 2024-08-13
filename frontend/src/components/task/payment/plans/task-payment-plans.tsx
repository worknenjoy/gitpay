import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import DriveEtaIcon from '@material-ui/icons/DriveEta';

export const TaskPaymentPlans = ({ plan, classes }) => {

  return (
    plan === 'open source' ? (
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
                <CheckIcon className={classes.checkIcon} fontSize='small' color='primary' />
                <FormattedMessage id='actions.task.payment.plan.bullet.public' defaultMessage='For Public Projects' />
              </Typography>
              <Typography>
                <CheckIcon className={classes.checkIcon} fontSize='small' color='primary' />
                <FormattedMessage id='actions.task.payment.plan.bullet.basic' defaultMessage='Basic Campaign' />
              </Typography>
            </div>
          </CardContent>

        </Card>
      </Grid>
    ) : (
      <Grid item className={classes.planGridItem} >
        <Card className={classes.planGrid}>
          <CardContent className={classes.planGridContent}>
            <div className={classes.planButton}>
              <DriveEtaIcon color={'primary'} className={classes.planIcon} />
            </div>
            <Typography align='center' color='textPrimary' variant='h5'>
              <FormattedMessage id='actions.task.payment.plan.percentagefee' defaultMessage='{fee}% fee' values={{ fee: '18' }} />
            </Typography >
            <Typography align='center' color='textSecondary' variant='h6'>
              <FormattedMessage id='actions.task.payment.plan.private' defaultMessage='Private Projects' />
            </Typography>
            <Typography align='center' variant='caption' gutterBottom>
              <FormattedMessage id='actions.task.payment.plan.private.info' defaultMessage='For Private Project' />
            </Typography>
            <div className={classes.planBullets}>
              <Typography>
                <CheckIcon className={classes.checkIcon} fontSize='small' color='primary' />
                <FormattedMessage id='actions.task.payment.plan.bullet.private' defaultMessage='Private Projects' />
              </Typography>
              <Typography>
                <CheckIcon className={classes.checkIcon} fontSize='small' color='primary' />
                <FormattedMessage id='actions.task.payment.plan.bullet.basic' defaultMessage='Basic Campaign' />
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    )
  )
}