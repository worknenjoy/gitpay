import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import OrganizationCard from 'design-library/molecules/cards/organization-card/organization-card'

export const Root = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100%',
  paddingBottom: theme.spacing(3),
  paddingTop: theme.spacing(3)
}))

export const StyledOrganizationCard = styled(OrganizationCard)({
  height: '100%'
})
