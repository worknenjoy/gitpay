import React from 'react'
import { Grid, Typography, styled, Theme } from '@mui/material'

const useStyles = styled((theme: Theme) => ({
  spanText: {
    color: 'gray'
  },
  coverImg: {
    width: 160,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }
}));

const Introduction = ({ title, image, children }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid container spacing={3} justifyContent="flex-start" style={{ textAlign: 'left', marginTop: 15 }}>
  <Grid size={{ xs: 12, md: 3 }}>
          <img src={image} className={classes.coverImg} alt="cover" />
        </Grid>
  <Grid size={{ xs: 12, md: 9 }}>
          <div id="form-dialog-title" style={{ padding: 0 }}>
            <Typography variant="subtitle1">
              {title}
            </Typography>
          </div>
          <Typography variant="caption" gutterBottom>
            <span className={classes.spanText}>
              {children}
            </span>
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Introduction