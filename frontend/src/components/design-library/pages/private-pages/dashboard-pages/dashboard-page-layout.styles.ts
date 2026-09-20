import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5)
}))

export const Header = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4
}))

export const HeaderTitleRow = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap'
}))

export const Body = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 340px',
  gap: theme.spacing(2.5),
  alignItems: 'start',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr'
  }
}))

export const Column = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  minWidth: 0
}))
