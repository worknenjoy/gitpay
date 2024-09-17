
import React from 'react';
import { Chip, Typography, withStyles } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import { Theme, createStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column' as 'column'
    }
  });

const PickupTagList = ({ tags, classes, onPickItem }) => {
  return (
    <div className={classes.root}>
      <Typography variant='subtitle2'>
        <FormattedMessage id='issue.payment.headline.bounty.add' defaultMessage='Add a bounty for this issue' />
      </Typography>
      <Typography variant='body1' color='textSecondary' gutterBottom>
        <FormattedMessage id='issue.payment.form.message.subheading' defaultMessage='Create a bounty for this issue and who you assign will receive the payment for this bounty' />
      </Typography>
      <div className={classes.chipContainer}>
        {tags.map((tag) => (
          <Chip
            label={tag.name}
            className={classes.chip}
            onClick={() => onPickItem(tag.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default withStyles(styles)(PickupTagList)