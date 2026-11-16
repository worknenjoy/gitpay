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

/** Title group (left) + header action (right), both sitting on the bottom line */
export const HeaderBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap'
}))

/** Right side of the header bar (e.g. <AutoWithdrawalStatus/>) */
export const HeaderAction = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  marginTop: 4
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
