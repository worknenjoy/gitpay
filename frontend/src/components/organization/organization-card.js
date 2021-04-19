import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Avatar,
  Box,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Link,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  }
}))

const OrganizationCard = ({ className, organization, ...rest }) => {
  const classes = useStyles()

  return (
    <Card
      className={ clsx(classes.root, className) }
      { ...rest }
    >
      <CardContent>
        <Box
          display='flex'
          justifyContent='center'
          mb={ 3 }
        >
          <Avatar aria-label='recipe' className={ classes.avatar }>
            { organization.name[0] }
          </Avatar>
        </Box>
        <Typography
          align='center'
          color='textPrimary'
          gutterBottom
          variant='h6'
        >
          <Link color='textPrimary' href={ '' } onClick={ (e) => {
            e.preventDefault()
            window.location.href = `/#/organizations/${organization.id}`
            window.location.reload()
          } }>
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
          { organization && <Link color='textSecondary' href={ '' } onClick={ (e) => {
            e.preventDefault()
            window.location.href = `/#/organizations/${organization.id}`
            window.location.reload()
          } }>{ organization.User.name || organization.User.username }</Link> }
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
          <Grid
            className={ classes.statsItem }
            item
          >
            <Typography variant='body2' color='textSecondary' component='small' style={ { width: '100%', marginBottom: 10, marginLeft: 16 } }>
              Projects:
            </Typography>
          </Grid>
          <Grid
            className={ classes.statsItem }
            item
            style={ { flexWrap: 'wrap' } }
          >
            { organization.Projects && organization.Projects.map(p =>
              (<Chip key={ p.id } style={ { marginLeft: 10, marginBottom: 10 } } size='medium' clickable onClick={ () => {
                window.location.href = '/#/organizations/' + organization.id + '/projects/' + p.id
                window.location.reload()
              } } label={ p.name }
              />)
            ) }
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

OrganizationCard.propTypes = {
  className: PropTypes.string,
  organization: PropTypes.object.isRequired
}

export default OrganizationCard
