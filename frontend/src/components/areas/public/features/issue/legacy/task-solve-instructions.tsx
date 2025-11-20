import * as React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}))

const darkTheme = createTheme({ palette: { mode: 'dark' } })
const lightTheme = createTheme({ palette: { mode: 'light' } })

export default function TaskSolveInstructions({ instruction }) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12 }}>
        <ThemeProvider theme={darkTheme}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: 'background.default',
              display: 'grid',
              gridTemplateColumns: { md: '1fr 1fr' },
              gap: 1,
            }}
          >
            <Typography variant="body1">
              <pre style={{ color: darkTheme.palette.text.secondary }}>{instruction}</pre>
            </Typography>
          </Box>
        </ThemeProvider>
      </Grid>
    </Grid>
  )
}
