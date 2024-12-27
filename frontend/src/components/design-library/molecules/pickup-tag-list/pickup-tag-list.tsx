
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

  const tags = [
    {
      id: 1,
      name: '$ 20',
      value: 20
    },
    {
      id: 2,
      name: '$ 50',
      value: 50
    },
    {
      id: 3,
      name: '$ 100',
      value: 100
    },
    {
      id: 4,
      name: '$ 150',
      value: 150
    },
    {
      id: 5,
      name: '$ 300',
      value: 300
    }
  ]

const PickupTagList = ({ classes, onPickItem, primaryText, secondaryText }) => {
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