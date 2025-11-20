import { styled } from '@mui/material/styles'
import {
  Typography as MuiTypography,
  FormControl as MuiFormControl,
  Button as MuiButton,
} from '@mui/material'

export const FullWidthFormControl = styled(MuiFormControl)({
  width: '100%',
})

export const HeaderTypography = styled(MuiTypography)({
  display: 'block',
  width: '100%',
})

export const ProvidersWrapper = styled('div')(({ theme }) => ({
  marginTop: 10,
  marginBottom: 10,
}))

export const ProviderButton = styled(MuiButton)(({ theme }) => ({
  marginRight: 10,
  '& span.provider-label': {
    marginLeft: 10,
  },
}))
