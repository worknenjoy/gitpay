import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

import formProps from '../form/form-props'
import mainStyles from '../styles/style'

import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet'
import WorkIcon from 'material-ui-icons/Work'
import AppsIcon from 'material-ui-icons/Apps'
import AssignmentIcon from 'material-ui-icons/Assignment'
import GroupWorkIcon from 'material-ui-icons/GroupWork'
import ArchiveIcon from 'material-ui-icons/Archive'
import CardMembershipIcon from 'material-ui-icons/CardMembership'
import BugReportIcon from 'material-ui-icons/BugReport'
import SubscribeFrom from 'react-mailchimp-subscribe'

import './mailchimp.css'

import TopBarContainer from '../../containers/topbar'
import InfoContainer from '../../containers/info'
import Bottom from '../../components/bottom/bottom'
import LoginButton from '../../components/session/login-button'

import OurStack from './components/OurStack'

const octodex = require('../../images/octodex.png')
const octodexMotherhubbertocat = require('../../images/octodex-motherhubbertocat-transparent.png')
const deal = require('../../images/deal.png')

import {
  MainTitle,
  MainList,
  MainBanner,
  ResponsiveImage,
  Section
} from './components/CommonStyles'

const styles = (theme) => mainStyles(theme)

class Welcome extends Component {
  render () {
    const { classes, location } = this.props

    return (
      <div className={ classes.root }>
        <TopBarContainer />

        <MainBanner>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } style={ { padding: 0, margin: 0 } }>
              <div className={ classes.mainBlock } style={ { margin: 0, paddingTop: 10 } }>
                <Typography className={ classes.tagline } gutterBottom>
                  <FormattedMessage id='welcome.tagline' />
                </Typography>
                <Typography variant='title' gutterBottom>
                  <FormattedMessage id='welcome.tagline1' />
                </Typography>
                <Typography type='subheading' gutterBottom noWrap>
                  <FormattedHTMLMessage
                    id='welcome.tagline2' />
                </Typography>

                <div className='subscribe-form'>
                  <SubscribeFrom className='subscribe-form-main' { ...formProps } />
                </div>
              </div>

              <div className={ classes.mainBlock } style={ { paddingBottom: 40 } }>
                <LoginButton referer={ location } contrast />
              </div>
              <InfoContainer />
              <OurStack />
            </Grid>
          </Grid>
        </MainBanner>

        <Section>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography type='headline' gutterBottom>
                  Para Freelancers
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <AppsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary='Trabalhe em projetos usando as melhores ferramentas de desenvolvimento'
                      secondary='Com o Gitpay você utiliza os recursos do git e controle de versão para realizar entregas para os clientes'
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary='Colabore com empresas e trabalhe sob demanda'
                      secondary='Trabalhe em diferentes projetos, colabore e aprenda com projetos reais que utilizam diferentes tecnologias'
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary='Receba pelos trabalhos realizados'
                      secondary='Receba o pagamento diretamente na sua conta pelas tarefas de desenvolvimento quando seu código for integrado'
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='600' src={ octodex } />
            </Grid>
          </Grid>
        </Section>

        <Section alternative>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography type='headline' gutterBottom>
                  Para Empresas
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary='Gerencie o desenvolvimento da sua startup'
                      secondary='Com o Gitpay as empresas podem gerir seu negócio utilizando ferramentas de desenvolvimento feitos sobe medida para você'
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <GroupWorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary='Pague pelos trabalhos concluídos com processos inteligentes e automatizados'
                      secondary='Envolva diferentes tipos de freelancers, com experiências variadas que irão ajudar no desenvolvimento do projeto usando as ferramentas que eles conhecem e processos já consolidados'
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary='Desenvolva o seu negócio com ferramentas open source, e pagando por serviços sob demanda'
                      secondary='Empresas podem nascer e se manter com o Gitpay, desde o design até o desenvolvimento, pagando apenas pelas demandas concluídas e integradas com o projeto'
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='500' src={ octodexMotherhubbertocat } />
            </Grid>
          </Grid>
        </Section>

        <Section>
          <MainTitle>
            <Typography type='headline' gutterBottom>Como Funciona</Typography>
          </MainTitle>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='400' src={ deal } />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <div className={ classes.seclist }>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <ArchiveIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Uma nova tarefa de um projeto é criada'
                      secondary='Uma demanda, incidente, melhoria ou sugestão é lançada na plataforma, seja ela de código, SEO, conteúdo ou até infra estrutura e novas idéias'
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='A sua demanda é enviada para a comunidade'
                      secondary='Diferentes grupos de freelancers se interessam por esta demanda por um valor fixo ou sugerido pelos interessados'
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <CardMembershipIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Solicitação de mudança e recompensa'
                      secondary='É enviada uma solicitação no repositório do projeto para que seja integrado e o pagamento é realizado'
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Processos ágeis entre negócios e desenvolvimento'
                      secondary='Queremos facilitar as transações e facilitar os acordos entre empresas e freelancers utilizando ferramentas inteligentes, processos já usados em empresas ágeis e startups'
                    />
                  </ListItem>
                </List>
              </div>
            </Grid>
          </Grid>
        </Section>

        <Bottom />
      </div>
    )
  }
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.string,
}

export default withStyles(styles)(Welcome)
