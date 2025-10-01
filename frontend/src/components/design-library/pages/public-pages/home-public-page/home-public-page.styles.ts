import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { Section as BaseSection, ResponsiveImage } from './CommonStyles'

// Root wrapper
export const Root = styled('div')(() => ({
  flexGrow: 1,
  marginTop: 0,
}))

// Section with alternate background
export const AltSection = styled(BaseSection)(({ theme }) => ({
  backgroundColor: theme.palette.primary.contrastText,
}))

// Image helpers
export const HeroImage = styled(ResponsiveImage)(() => ({
  width: '100%',
}))

export const ImageContainer = styled('div')(() => ({
  marginLeft: 20,
}))

// Lists
export const SecList = styled('div')(() => ({
  padding: 20,
}))

export const ListItemTop = styled(ListItem)(() => ({
  marginTop: 20,
}))

// Buttons
export const GutterTopButton = styled(Button)<ButtonProps>(() => ({
  marginTop: 20,
}))

export const MLButton = styled(Button)(() => ({
  marginLeft: 20,
}))

// Bottom call-to-action section and copy
export const BottomCTASection = styled(BaseSection)(() => ({
  height: 350,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const BottomCopy = styled(Typography)(() => ({
  padding: '0 60px',
}))
