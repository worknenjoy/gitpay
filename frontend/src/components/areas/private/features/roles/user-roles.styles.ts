import { styled } from '@mui/material/styles'

// Bottom buttons row
export const ButtonsRow = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3)
}))

export const CancelButton = styled('button')(({ theme }) => ({
  border: 'none',
  backgroundColor: 'transparent',
  color: theme.palette.text.secondary,
  fontWeight: 'bold',
  fontFamily: 'arial',
  borderRadius: 20,
  '& button:focus': {
    outline: 'none'
  },
  cursor: 'pointer'
}))

export const SaveButton = styled('button')(({ theme }) => ({
  border: 0,
  margin: '0 4% 0 4%',
  padding: '10px 60px 10px',
  backgroundColor: theme.palette.secondary.main,
  fontSize: 14,
  borderRadius: 20,
  height: '20%',
  color: '#FFFFFF',
  cursor: 'pointer',
  fontWeight: 'bold',
  '& button:hover': {
    backgroundColor: theme.palette.secondary.dark
  },
  '& button:focus': {
    outline: 'none'
  }
}))
