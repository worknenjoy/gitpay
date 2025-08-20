import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, Grid, Typography, withStyles } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { TwoWheeler as Motorcycle } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    planGridItem: {
      padding: theme.spacing(1),
      marginTop: 16
    },
    planContainer: {
      paddingTop: 5,
      paddingBottom: 5
    },
    planGrid: {
      margin: 0,
      padding: 8
    },
    planGridContent: {
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      margin: 0,
      '&.MuiCardContent-root': {
        padding: 0
      }
    },
    planButton: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    },
    planBullets: {
      paddingLeft: theme.spacing(1),
      padding: 5
    },
    planIcon: {
      textAlign: 'center',
      fontSize: 32,
      padding: 2
    }
  }));

type PlanDetails = {
  fee?: number;
  category?: string;
  title?: string;
  items?: string[];
}

type PlanProps = {
  classes: any;
  plan?: PlanDetails;
}

const PlanCard = ({ plan }:PlanProps) => {
  const classes = useStyles();
  const { fee, category, title, items } = plan;
  return (
    <Grid className={classes.planGridItem}>
      <Card className={classes.planGrid}>
        <CardContent className={classes.planGridContent}>
          <div className={classes.planButton}>
            <Motorcycle color={'primary'} className={classes.planIcon} />
            <Typography align="center" color="textPrimary" variant="h5">
              <FormattedMessage id="actions.task.payment.plan.percentagefee" defaultMessage="{fee}% fee" values={{ fee: fee }} />
            </Typography>
            <Typography align="center" color="textSecondary" variant="h6" gutterBottom>
              {category}
            </Typography>
          </div>
          <div className={classes.planBullets}>
            <Typography align="center" variant="caption" gutterBottom>
              {title}
            </Typography>
            {items.map((item, index) => (
              item && <Typography>
                <CheckIcon fontSize="small" color="primary" />
                {item}
              </Typography>
            ))}
          </div>
        </CardContent>
      </Card>
    </Grid>

  );
}

export default PlanCard