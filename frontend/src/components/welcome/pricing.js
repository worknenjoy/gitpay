import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Card from 'material-ui/Card'
import CardActions from 'material-ui/Card/CardActions'
import CardContent from 'material-ui/Card/CardContent'
import CardHeader from 'material-ui/Card/CardHeader'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

import {
  MainTitle
} from './components/CommonStyles'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 2,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `0 0 ${theme.spacing.unit * 8}px`,
  },
  heroDesc: {
    paddingTop: theme.spacing.unit * 2
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.light,
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing.unit * 2,
  },
  cardActions: {
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing.unit * 2,
    },
  }
})

const tiers = [
  {
    title: 'Free',
    price: '0',
    description: ['10 users included', '2 GB of storage', 'Help center access', 'Email support'],
    buttonText: 'Sign up for free',
    buttonVariant: 'raised',
  },
  {
    title: 'Pro',
    subheader: 'Most popular',
    price: '15',
    description: [
      '20 users included',
      '10 GB of storage',
      'Help center access',
      'Priority email support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'raised',
  },
  {
    title: 'Enterprise',
    price: '30',
    description: [
      '50 users included',
      '30 GB of storage',
      'Help center access',
      'Phone & email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'raised',
  },
]

class Pricing extends Component {
  render () {
    const { classes } = this.props

    return (
      <div className={classes.layout}>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <MainTitle>
            <Typography variant='headline' gutterBottom>
              Pricing
            </Typography>
          </MainTitle>
          <Typography variant="body1" align="center" color="textSecondary" className={classes.heroDesc}>
            Quickly build an effective pricing table for your potential customers with this layout.
            It&apos;s built with default Material-UI components with little customization.
          </Typography>
        </div>
        {/* End hero unit */}
        <Grid container spacing={40} alignItems="flex-end">
          {tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography variant="headline" color="textPrimary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="subheading" color="textSecondary">
                      /mo
                    </Typography>
                  </div>
                  {tier.description.map(line => (
                    <Typography variant="body1" align="center" key={line}>
                      {line}
                    </Typography>
                  ))}
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <Button fullWidth variant={tier.buttonVariant} color="primary">
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div> 
    )
  }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Pricing)
