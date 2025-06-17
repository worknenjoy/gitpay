
import React from 'react';
import { Chip, Tooltip, Typography, withStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

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
    }
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
    },
    {
      id: 5,
      name: '$ 500',
      value: 500
    },
    {
      id: 6,
      name: '$ 1000',
      value: 1000
    },
    {
      id: 7,
      name: '$ 2000',
      value: 2000
    },
    {
      id: 8,
      name: '$ 5000',
      value: 5000,
      info: 'No fee for Open Source projects with a bounty equal or higher than $5000'
    }
  ]

const PickupTagList = ({ classes, onPickItem, primaryText, secondaryText }) => {
  return (
    <div className={classes.root}>
      <div className={classes.chipContainer}>
        <Typography variant="subtitle2">
          {primaryText}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {secondaryText}
        </Typography>
        <div className={classes.chipContainer}>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              className={classes.chip}
              onClick={() => onPickItem(tag.value)}
              icon={tag?.info && (
              <Tooltip title={tag.info}>
                <InfoIcon fontSize="small" />
              </Tooltip>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(PickupTagList)