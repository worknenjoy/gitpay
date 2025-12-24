import { styled } from '@mui/material/styles'

export const TaskHeaderContainer = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    margin: '-1rem -1rem 1rem -1rem',
    padding: '1rem',
    '& h1': {
      fontSize: '1.75rem',
    },
  },
}))
