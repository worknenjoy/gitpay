import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import {
  Grid,
  Typography,
  Divider,
  List,
  Button,
  withStyles,
} from '@material-ui/core'

import SubscribeForm from '../form/subscribe-form'
import HowItWorksPeople from '../welcome/how-it-works-people'
import WhoSubscribes from '../welcome/who-subscribes'
import Workflow from '../welcome/workflow'
import HowItWorksCompany from '../welcome/how-it-works-company'
import WhichCompanies from '../welcome/which-companies'
import Consulting from '../welcome/consulting'

import mainStyles from '../styles/style'

import {
  Container,
  BaseFooter,
  SubscribeFromWrapper
} from './FooterStyles'

const logoCompleteGray = require('../../images/logo-complete-gray.png')
const logoWorknEnjoy = require('../../images/worknenjoy-logo.png')

const styles = theme => mainStyles(theme)

class Bottom extends Component {
  render () {
    const { classes } = this.props

    return (
      <div className={ classes.secBlock }>
        <Container>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 3 }>
              <Typography component='div'>
                <strong>
                  <FormattedMessage id='bottom.header.subheading1' defaultMessage='For Freelancers' />
                </strong>
              </Typography>
              <List component='nav'>
                <HowItWorksPeople classes={ classes } />
                <WhoSubscribes classes={ classes } />
                <Workflow classes={ classes } />
              </List>
            </Grid>
            <Grid item xs={ 12 } sm={ 3 }>
              <Typography component='div'>
                <strong>
                  <FormattedMessage id='bottom.header.subheading2' defaultMessage='For Companies' />
                </strong>
              </Typography>
              <List component='nav'>
                <HowItWorksCompany classes={ classes } />
                <WhichCompanies classes={ classes } />
                <Consulting classes={ classes } />
              </List>
            </Grid>
            <Grid item xs={ 12 } sm={ 2 }>
              <Typography component='div'>
                <strong>
                  <FormattedMessage id='bottom.subheading3' defaultMessage='Partners' />
                </strong>
              </Typography>
              <Button
                label='Jooble'
                href='https://br.jooble.org/vagas-de-emprego-desenvolvedor'
              >
                Jooble
              </Button>
            </Grid>
            <Grid item xs={ 12 } sm={ 4 }>
              <Typography component='div'>
                <FormattedMessage id='bottom.subheading.newsletter' defaultMessage='If you want to get in touch, leave your e-mail with our news and challenges!' />
              </Typography>
              <SubscribeFromWrapper className='subscribe-form'>
                <SubscribeForm render />
              </SubscribeFromWrapper>
              <Typography component='div'>
                <a href='http://worknenjoy.com'>worknenjoy, Inc.</a> <br />
                2035 Sunset Lake Road, Suite B-2 <br />
                Newark, DE 19702 - US
              </Typography>
            </Grid>
          </Grid>
          <Divider className={ classes.spacedTop } />
          <BaseFooter style={ { float: 'right', display: 'flex', alignItems: 'center' } }>
            <div>
              <img className={ classes.img } src={ logoCompleteGray } width='100' />
            </div>
            <Typography component='span' style={ { marginLeft: 10, marginRight: 10, display: 'inline-block' } }>
              <FormattedMessage id='bottom.company.org' defaultMessage='is part of' />
            </Typography>
            <a href='http://worknenjoy.com' target='_blank'>
              <img className={ classes.img } src={ logoWorknEnjoy } width='100' />
            </a>
          </BaseFooter>
        </Container>
      </div>
    )
  }
}

Bottom.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Bottom)
