import { styled } from '@mui/material/styles'
import { Paper, Typography, Card, CardMedia, Button } from '@mui/material'

// Wrapper paper with transparent background
export const ExplorePaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent'
}))

// Page title spacing
export const Title = styled(Typography)(({ theme }) => ({
  marginTop: 40
}))

// Section with bottom spacing (wraps login card or results)
export const TopSection = styled('div')(({ theme }) => ({
  marginBottom: 20
}))

// Filters + table wrapper spacing
export const FiltersWrapper = styled('div')(({ theme }) => ({
  marginTop: 20,
  marginBottom: 20
}))

// Login card wrapper
export const StyledCard = styled(Card)(({ theme }) => ({}))

// Media inside the login card
export const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: 600
}))

// Small left gutter for provider label text
export const GutterLeft = styled('span')(({ theme }) => ({
  marginLeft: 10
}))

// Provider auth buttons; add spacing between when multiple
export const ProviderButton = styled(Button)(({ theme }) => ({
  '&:not(:last-of-type)': {
    marginRight: 10
  }
}))
