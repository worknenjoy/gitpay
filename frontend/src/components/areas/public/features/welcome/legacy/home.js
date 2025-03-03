import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Container
} from '@material-ui/core'

import {
  Work,
  Archive,
  CardMembership,
  BugReport
} from '@material-ui/icons'

import { injectIntl, FormattedMessage } from 'react-intl'

import TopBarContainer from '../../../../../../containers/topbar'
import Bottom from '../../../../../design-library/organisms/layouts/bottom-bar/bottom'
import messages from './messages'
import mainStyles from '../../../../../../styleguide/styles/style'

const freelancerImage = require('images/collections/collection-flat-build.svg')
const citySoftware = require('images/collections/collection-flat-background.svg')
const deal = require('images/collections/collection-flat-works.svg')

import {
  MainTitle,
  ResponsiveImage,
  Section,
  HeroSection,
  HeroTitle,
  HeroContent,
  HeroActions
} from '../components/CommonStyles'

const styles = theme => mainStyles(theme)

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 0
    }
  }

  render () {
    const { classes } = this.props

    return (
      <div className={ classes.root }>
        <TopBarContainer ref='intro' hide />
        <Section ref='hero'>
          <HeroSection>
            <Grid container spacing={ 3 } alignContent={ 'flex-end' }>
              <Grid item xs={ 12 } sm={ 5 }>
                <ResponsiveImage width={ 580 } src={ freelancerImage } className={ classes.svg } />
              </Grid>
              <Grid item xs={ 12 } sm={ 7 }>
                <HeroTitle>
                  <Typography variant='h3' gutterBottom align='left'>
                    <FormattedMessage
                      id='home.hero.headline.title'
                      defaultMessage='Collaborate and earn bounties for solving issues from projects'
                    />
                  </Typography>
                </HeroTitle>
                <HeroContent>
                  <Typography variant='h6' gutterBottom align='left'>
                    <FormattedMessage
                      id='home.hero.headline.description'
                      defaultMessage='Gitpay is a platform that allows you to collaborate with other developers and earn bounties for solving issues from projects. You can also create your own projects and invite other developers to collaborate with you.'
                    />
                  </Typography>
                </HeroContent>
                <HeroActions>
                  <Button
                    variant='text'
                    color='primary'

                    onClick={ () => this.props.history.push('/tasks/open') }
                  >
                    <FormattedMessage
                      id='home.hero.headline.button.primary'
                      defaultMessage='Work on an issue'
                    />
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    className={ classes.button }
                    style={ { marginLeft: 20 } }
                    onClick={ () => this.props.history.push('/signup') }
                  >
                    <FormattedMessage
                      id='home.hero.headline.button.secondary'
                      defaultMessage='Import issue'
                    />
                  </Button>
                </HeroActions>
              </Grid>
            </Grid>
          </HeroSection>
        </Section>

        <Section ref='how-it-works' className={ classes.sectionBgAlt }>
          <MainTitle>
            <Typography variant='h5' gutterBottom>
              <FormattedMessage
                id='welcome.tagline.headline.how.title'
                defaultMessage='How Gitpay works'
              />
            </Typography>
          </MainTitle>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <div style={ { marginLeft: 20 } }>
                <ResponsiveImage width='400' src={ deal } />
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <div className={ classes.seclist }>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Archive />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemOnePrimary
                      ) }
                      secondary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemOneSecondary
                      ) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReport />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemTwoPrimary
                      ) }
                      secondary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemTwoSecondary
                      ) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <CardMembership />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemThreePrimary
                      ) }
                      secondary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemThreeSecondary
                      ) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Work />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemFourPrimary
                      ) }
                      secondary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemFourSecondary
                      ) }
                    />
                  </ListItem>
                </List>
              </div>
            </Grid>
          </Grid>
        </Section>
        <Section
          ref='get-started'
          style={ {
            // background: `url(${citySoftware}) 50% 5px no-repeat`,
            // backgroundSize: 'cover',
            height: 350,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          } }
        >
          <Typography variant='h6' gutterBottom style={ { padding: '0 60px' } }>
            <FormattedMessage
              id='welcome.bottom.call'
              defaultMessage='A better way to build your project, a better way to work in projects'
            />
          </Typography>
          <Button
            component='a'
            href='/#/signup'
            size='large'
            variant='contained'
            color='primary'
            className={ classes.gutterTopSmall }
          >
            <FormattedMessage
              id='welcome.bottom.link'
              defaultMessage='Get started'
            />
          </Button>
          <Button
            component='a'
            href='https://docs.gitpay.me'
            size='large'
            variant='text'
            color='primary'
            className={ classes.gutterTopSmall }
          >
            <FormattedMessage
              id='welcome.bottom.linkAlt'
              defaultMessage='See our documentation'
            />
          </Button>
        </Section>
        <Bottom />
      </div>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(Home))
