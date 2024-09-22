
import React from 'react';
import { Chip, Typography, withStyles } from '@material-ui/core';

import { Theme, createStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    chipContainer: {
      marginTop: 12,
      marginBottom: 12,
      width: '100%'
    },
    chip: {
      marginRight: theme.spacing(1)
    },
  });

const PickupTagList = ({ tags, classes, onPickItem, primaryText, secondaryText }) => {
  return (
    <div className={classes.root}>
      <div className={classes.chipContainer}>
        <Typography variant='subtitle2'>
          {primaryText}
        </Typography>
        <Typography variant='body1' color='textSecondary' gutterBottom>
          {secondaryText}
        </Typography>
        <div className={classes.chipContainer}>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              className={classes.chip}
              onClick={() => onPickItem(tag.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(PickupTagList)