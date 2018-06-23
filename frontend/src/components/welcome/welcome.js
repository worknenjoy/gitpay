import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import Notification from '../notification/notification';

import formProps from '../form/form-props';
import mainStyles from '../styles/style';

import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet';
import WorkIcon from 'material-ui-icons/Work';
import AppsIcon from 'material-ui-icons/Apps';
import AssignmentIcon from 'material-ui-icons/Assignment';
import GroupWorkIcon from 'material-ui-icons/GroupWork';
import ArchiveIcon from 'material-ui-icons/Archive';
import CardMembershipIcon from 'material-ui-icons/CardMembership';
import BugReportIcon from 'material-ui-icons/BugReport';
import SubscribeFrom from 'react-mailchimp-subscribe';

import './mailchimp.css';

import TopBarContainer from '../../containers/topbar';
import Bottom from '../../components/bottom/bottom';
import LoginButton from '../../components/session/login-button'

const logoSymbol = require('../../images/logo-symbol.png');
const octodex = require('../../images/octodex.png');
const octodexMotherhubbertocat = require('../../images/octodex-motherhubbertocat.png');
const deal = require('../../images/deal.png');

const styles = (theme) => mainStyles(theme);

class Welcome extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <TopBarContainer />
          <Grid item xs={12}>
            <div className={classes.mainBlock}>
              <Typography type="display2" className={classes.tagline} gutterBottom>
                Aqui sua contribuição vira recompensa
              </Typography>
              <Typography type="headline" gutterBottom>
                e coloca novas ideias no ar!
              </Typography>
              <Typography type="subheading" gutterBottom noWrap>

                com o <strong>Gitpay</strong> você contribui de forma independente com projetos sob demanda

              </Typography>
              <div className="subscribe-form">
                <SubscribeFrom className="subscribe-form-main"  {...formProps} />
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.mainBlock}>
            <LoginButton referer={this.props.location} />
          </div>
        </Grid>
        <div className={classes.secBlock}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <div className={classes.divider}>
                <Typography type="headline" gutterBottom>
                  Para freelancers
                </Typography>
              </div>
              <div className={classes.mainlist}>
                <List>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AppsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Trabalhe em projetos usando as melhores ferramentas de desenvolvimento"
                                  secondary="Com o Gitpay você utiliza os recursos do git e controle de versão para realizar entregas para os clientes"/>
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Colabore com empresas e trabalhe sob demanda"
                                  secondary="Trabalhe em diferentes projetos, colabore e aprenda com projetos reais que utilizam diferentes tecnologias"/>
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Receba pelos trabalhos realizados"
                                  secondary="Receba o pagamento diretamente na sua conta pelas tarefas de desenvolvimento quando seu código for integrado"/>
                  </ListItem>
                </List>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <img width="600" src={octodex}/>
            </Grid>
          </Grid>
        </div>
        <div className={classes.mainBlock}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <div className={classes.divider}>
                <Typography type="headline" gutterBottom>
                  Para empresas
                </Typography>
              </div>
              <div className={classes.mainlist}>
                <List>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Gerencie o desenvolvimento da sua startup"
                                  secondary="Com o Gitpay as empresas podem gerir seu negócio utilizando ferramentas de desenvolvimento feitos sobe medida para você"/>
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <GroupWorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Pague pelos trabalhos concluídos com processos inteligentes e automatizados"
                      secondary="Envolva diferentes tipos de freelancers, com experiências variadas que irão ajudar no desenvolvimento do projeto usando as ferramentas que eles conhecem e processos já consolidados"/>
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Desenvolva o seu negócio com ferramentas open source, e pagando por servicos sob demanda"
                      secondary="Empresas podem nascer e se manter com o Gitpay, desde o design até o desenvolvimento, pagando apenas pelas demandas concluídas e integradas com o projeto"/>
                  </ListItem>
                </List>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <img width="500" src={octodexMotherhubbertocat}/>
            </Grid>
          </Grid>
        </div>
        <div className={classes.mainBlock}>
          <Grid container spacing={24}>
            <div className={classes.divider}>
              <Typography type="headline" gutterBottom>
                Como funciona
              </Typography>
            </div>
            <Grid item xs={12} sm={6}>
              <img width="400" src={deal}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={classes.seclist}>
                <List>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <ArchiveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Uma nova tarefa de um projeto é criada"
                                  secondary="Uma demanda, incidente, melhoria ou sugestão é lançada na plataforma, seja ela de código, SEO, conteúdo ou até infra estrutura e novas idéias"/>
                  </ListItem>
                  <Divider />
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText primary="A sua demanda é enviada para a comunidade"
                                  secondary="Diferentes grupos de freelancers se interessam por esta demanda por um valor fixo ou sugerido pelos interessados"/>
                  </ListItem>
                  <Divider />
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <CardMembershipIcon />
                    </ListItemIcon>
                    <ListItemText primary="Solicitação de mudança e recompensa"
                                  secondary="É enviada uma solicitação no repositório do projeto para que seja integrado e o pagamento é realizado"/>
                  </ListItem>
                  <Divider />
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Processos ágeis entre negócios e desenvolvimento"
                                  secondary="Queremos facilitar as transações e facilitar os acordos entre empresas e freelancers utilizando ferramentas inteligentes, processos já usados em empresas ágeis e startups"/>
                  </ListItem>
                </List>
              </div>
            </Grid>
          </Grid>
        </div>
        <Bottom />
      </div>
    );
  }
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Welcome);
