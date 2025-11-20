import { styled } from '@mui/material/styles'
import { Paper, Grid, Card, CardContent, CardActions } from '@mui/material'

// Container with padding used as the outer wrapper
export const RolesContainer = styled(Paper)(({ theme }) => ({
  padding: '10px 20px 20px 20px',
}))

// Header section with title/description
export const BigRow = styled('div')(({ theme }) => ({
  margin: '2% 5% 0 0',
  padding: 0,
  '& h1': {
    fontWeight: 500,
  },
  '& h4': {
    fontWeight: 500,
  },
  '& p': {
    color: 'gray',
    fontSize: 18,
  },
}))

// Grid container row
export const RowGrid = styled(Grid)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    margin: 'auto',
  },
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    width: '100%',
    padding: '3% 0',
    margin: 0,
    alignItems: 'center',
  },
}))

// Grid item wrapper for each role card
export const RowListItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    margin: '0 0% 10% 0',
  },
  [theme.breakpoints.up('lg')]: {
    margin: '0 5% 0% 0',
  },
}))

// Card wrapper and inner elements
export const RowCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  height: '100%',
  '& div': {
    height: '100%',
  },
  '& img': {
    backgroundColor: '#263238',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
}))

export const RootLabel = styled(CardContent)(({ theme }) => ({
  padding: '5px 16px 0px',
  backgroundColor: '#455a64',
  '& h5': {
    color: 'white',
  },
}))

export const ActionBar = styled(CardActions)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingTop: 0,
  backgroundColor: '#455a64',
  '& p': {
    padding: '0 10px 0 15px',
    float: 'left',
    width: '90%',
    alignItems: 'center',
    color: '#c7ced1',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontSize: '0.78rem',
  },
  '& span': {
    paddingTop: 0,
    paddingLeft: 0,
    '& svg': {
      backgroundColor: 'white',
    },
  },
}))

// Bottom buttons row
export const ButtonsRow = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
}))

export const CancelButton = styled('button')(({ theme }) => ({
  border: 'none',
  backgroundColor: 'transparent',
  color: '#00b58e',
  fontWeight: 'bold',
  fontFamily: 'arial',
  '& button:focus': {
    outline: 'none',
  },
  cursor: 'pointer',
}))

export const SaveButton = styled('button')(({ theme }) => ({
  border: 0,
  margin: '0 4% 0 4%',
  padding: '10px 60px 10px',
  backgroundColor: '#00b58e',
  fontSize: 14,
  height: '20%',
  color: '#FFFFFF',
  cursor: 'pointer',
  fontWeight: 'bold',
}))
