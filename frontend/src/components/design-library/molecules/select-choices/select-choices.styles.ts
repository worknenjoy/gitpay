import { styled } from '@mui/material/styles'
import { Paper, Grid, Card, CardContent, CardActions } from '@mui/material'

export const SelectChoicesContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3)
}))

export const SelectChoicesHeader = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& h1, & h4, & h5': {
    fontWeight: 500
  },
  '& p': {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary
  }
}))

export const SelectChoicesGrid = styled(Grid)(() => ({
  width: '100%',
  margin: 0
}))

export const SelectChoicesItem = styled(Grid)(() => ({
  display: 'flex'
}))

export const SelectChoicesCard = styled(Card)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}))

export const SelectChoicesMedia = styled('div')(({ theme }) => ({
  height: 96,
  width: '100%',
  backgroundColor: theme.palette.action.hover,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
}))

export const SelectChoicesLabel = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 0.5, 2)
}))

export const SelectChoicesActionBar = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(0, 2, 1.5, 2),
  marginTop: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  '& p': {
    margin: 0,
    flex: 1,
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
    lineHeight: 1.4
  },
  '& span': {
    padding: 0
  }
}))
