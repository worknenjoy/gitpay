import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Link
} from '@mui/material'
import slugify from '@sindresorhus/slugify'

const RootCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column'
}))

const StatsItem = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex'
}))

const OrganizationCard = ({ className, organization, ...rest }) => {

  const goToOrganization = (event, organization) => {
    event.preventDefault()

    window.location.href = `/#/organizations/${organization.id}/${slugify(organization.name)}`
    window.location.reload()
  }

  return (
    <RootCard
      className={ className }
      { ...rest }
    >
      <CardContent>
        <Box
          display='flex'
          justifyContent='center'
          mb={ 3 }
        >
          <Avatar aria-label='recipe'>
            { organization.name[0] }
          </Avatar>
        </Box>
        <Typography
          align='center'
          color='textPrimary'
          gutterBottom
          variant='h6'
        >
          <Link color='textPrimary' href={ '' } onClick={ (e) => goToOrganization(e, organization) }>
            { organization.name }
          </Link>
        </Typography>
        <Typography
          align='center'
          color='textPrimary'
          gutterBottom
          variant='caption'
          style={ { display: 'inline-block', textAlign: 'center', width: '100%', marginTop: 0 } }
        > by { ' ' }
          { organization &&
            <Link color='textSecondary' href={ organization.User.username ? `/#/users/${organization.User.id}-${organization.User.username}` : `/#/users/${organization.User.id}` } >
              { organization.User.name || organization.User.username }
            </Link>
          }
        </Typography>
        <Typography
          align='center'
          color='textPrimary'
          variant='body1'
        >
          { organization.description }
        </Typography>
      </CardContent>
      <Box flexGrow={ 1 } />
      <Divider />
      <Box p={ 2 }>
        <Grid
          container
          justify='space-between'
          spacing={ 2 }
        >
      <StatsItem item>
            <Typography variant='body2' color='textSecondary' component='small' style={ { width: '100%', marginBottom: 10, marginLeft: 16 } }>
              Projects:
            </Typography>
      </StatsItem>
      <StatsItem item style={ { flexWrap: 'wrap' } }>
            { organization.Projects && organization.Projects.map(p =>
              (<Chip key={ p.id } style={ { marginLeft: 10, marginBottom: 10 } } size='medium' clickable onClick={ () => {
                window.location.href = `/#/organizations/${organization.id}/${organization.name}/projects/${p.id}/${slugify(p.name)}`
                window.location.reload()
              } } label={ p.name }
              />)
            ) }
      </StatsItem>
        </Grid>
      </Box>
    </RootCard>
  )
}

OrganizationCard.propTypes = {
  className: PropTypes.string,
  organization: PropTypes.object.isRequired
}

export default OrganizationCard
