import React from 'react'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const CoverImg = styled('img')(({ theme }) => ({
  width: 160,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

const SpanText = styled('span')(() => ({
  color: 'gray',
}))

const Introduction = ({ title, image, children }) => {
  return (
    <React.Fragment>
      <Grid
        container
        spacing={3}
        justifyContent="flex-start"
        style={{ textAlign: 'left', marginTop: 15 }}
      >
        <Grid size={{ xs: 12, md: 3 }}>
          <CoverImg src={image} alt="cover" />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <div id="form-dialog-title" style={{ padding: 0 }}>
            <Typography variant="subtitle1">{title}</Typography>
          </div>
          <Typography variant="caption" gutterBottom>
            <SpanText>{children}</SpanText>
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Introduction
