import { styled } from '@mui/material/styles'
import {
  Card as MuiCard,
  CardActions as MuiCardActions,
  CardContent as MuiCardContent,
  FormControl as MuiFormControl,
  Typography as MuiTypography,
} from '@mui/material'

export const Form = styled('form')(({ theme }) => ({
  marginTop: 10,
  marginBottom: 10,
  width: '100%',
}))

export const Card = styled(MuiCard)(({ theme }) => ({
  minWidth: 275,
  padding: 0,
  margin: 0,
}))

export const CardEmpty = styled(MuiCard)(({ theme }) => ({
  minWidth: 275,
  textAlign: 'center',
  marginBottom: 40,
}))

export const CardEmptyActions = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 20,
  paddingBottom: 40,
}))

export const CardEmptyActionsAlt = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: 20,
}))

export const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: 0,
  margin: 0,
}))

export const Title = styled('div')(({ theme }) => ({
  marginBottom: 16,
  fontSize: 18,
  fontWeight: 'bold',
}))

export const Pos = styled(MuiTypography)(({ theme }) => ({
  marginBottom: 12,
}))

export const FullWidthFormControl = styled(MuiFormControl)(({ theme }) => ({
  width: '42%',
}))

export const RightActions = styled(MuiCardActions)(({ theme }) => ({
  justifyContent: 'end',
}))
