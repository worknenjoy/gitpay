import React from 'react';
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet';
import WorkIcon from 'material-ui-icons/Work';
import AppsIcon from 'material-ui-icons/Apps';
import SubscribeFrom from 'react-mailchimp-subscribe'

import { red, cyan, teal } from 'material-ui/colors';

import './mailchimp.css'

const logo = require('../../images/gitpay-logo.png')
const logoGitlab = require('../../images/gitlab-logo.png')
const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')
const octodex = require('../../images/octodex.png')
const octodexMotherhubbertocat = require('../../images/octodex-motherhubbertocat.png')
const deal = require('../../images/deal.png')

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
  },
  img: {
    marginTop: -18,
    marginRight: 10
  },
  icon: {
    marginTop: -4,
    marginRight: 5
  },
  button: {
    margin: theme.spacing.unit,
    padding: [theme.spacing.unit*2, theme.spacing.unit*4],
    color: 'white'
  },
  altButton: {
    margin: [theme.spacing.unit],
    padding: [theme.spacing.unit/2, theme.spacing.unit*6],
    color: 'white',
    fontSize: 12
  },
  mainBlock: {
    textAlign: 'center',
    padding: 8,
    color: theme.palette.text.primary
  },
  secBlock: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#f1f0ea'
  },
  divider: {
    textAlign: 'center',
    display: 'inline-block',
    marginLeft: '35%',
    marginBottom: '5%',
    marginTop: 20,
    fontSize: 18,
    paddingBottom: 10,
    borderBottom: '5px solid black',
    width: '25%',
  },
  mainlist: {
    textAlign: 'left',
    marginLeft: '20%',
    width: '100%'
  },
  seclist: {
    textAlign: 'left',
    width: '100%'
  },
  listIconTop: {
    alignItems: 'flex-start'
  },
  defaultCenterBlock: {
    textAlign: 'center',
    padding: 10,
    color: theme.palette.text.primary
  },
  intro: {
    padding: 20,
    margin: 0,
    textAlign: 'center',
    height: 55,
    backgroundColor: 'black',
    color: theme.palette.text.secondary,
  },
  tagline: {
    fontSize: 45,
    color: 'black'
  }
});



const formProps = {
  action: '//truppie.us17.list-manage.com/subscribe/post?u=bb76ecd5ef5cbbc5e60701321&amp;id=63cbedd527',
  messages: {
    inputPlaceholder: "Seu email",
    btnLabel: "Cadastrar!",
    sending: "Registrando...",
    success: "Você foi registrado e irá receber em breve novas oportunidades!",
    error: "Não conseguimos registrar este e-mail, deixou vazio ou colocou algum já existente?"
  },
  styles: {
    sending: {
      fontSize: 14,
      color: cyan["500"]
    },
    success: {
      fontSize: 14,
      color: teal["500"]
    },
    error: {
      fontSize: 14,
      color: red["500"]
    }
  }
}

function Welcome(props) {

  const { classes } = props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <div className={classes.intro}>
              <img className={classes.img} src={logo} width="230" />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.mainBlock}>
              <Typography type="display2" className={classes.tagline} gutterBottom>
                Aqui seu código ganha vida
              </Typography>
              <Typography type="headline" gutterBottom>
                para colocar novas idéias no ar
              </Typography>
              <Typography type="subheading" gutterBottom noWrap>

                    com o <strong>Gitpay</strong> você trabalha de forma independente com projetos sob demanda e recebe
                    por cada código integrado

              </Typography>
              <Button raised color="primary" className={classes.button}>
                Começar agora!
              </Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.mainBlock}>
              <Typography type="subheading" gutterBottom noWrap>
                Ou conecte com algumas dessas contas
              </Typography>
              <Button raised size="small" color="accent" className={classes.altButton}>
                <img width="16" src={logoGithub} className={classes.icon} /> Github
              </Button>
              <Button raised size="small" color="accent" className={classes.altButton}>
                <img width="16" src={logoGitlab} className={classes.icon} /> Gitlab
              </Button>
              <Button raised size="small" color="accent" className={classes.altButton}>
                <img width="16" src={logoBitbucket} className={classes.icon} /> Bitbucket
              </Button>
            </div>
          </Grid>
        </Grid>
        <div className={classes.secBlock}>
          <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <div className={classes.divider}>
                  <Typography type="headline" gutterBottom>
                    Para devs
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
                      <ListItemText primary="Trabalhe em projetos usando as melhores ferramentas de desenvolvimento" secondary="Com o Gitpay você utiliza os recursos do git e controle de versão para realizar entregas para os clientes" />
                    </ListItem>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon>
                        <Avatar>
                          <WorkIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText primary="Colabore com empresas e trabalhe sob demanda" secondary="Trabalhe em diferentes projetos, colabore e aprenda com projetos reais que utilizam diferentes tecnologias" />
                    </ListItem>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon>
                        <Avatar>
                          <AccountBalanceWalletIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText primary="Receba pelos trabalhos realizados" secondary="Receba o pagamento diretamente na sua conta pelas tarefas de desenvolvimento quando seu código for integrado" />
                    </ListItem>
                  </List>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <img width="600" src={octodex} />
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
                        <AppsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Gerencie o desenvolvimento da sua startup" secondary="Com o Gitpay as empresas podem gerir seu negócio utilizando ferramentas de desenvolvimento feito sobe medida para você" />
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Pague pelos trabalhos concluídos ou estimule desenvolvedores a contribuir com seu projeto usando contratos inteligentes" secondary="Envolva diferentes tipos de desenvolvendores, com experiências variadas que irão ajudar no desenvolvimento do projeto usando as ferramentas que ele conhece e processos já consolidados" />
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Desenvolva o seu negócio com ferramentas open source, e pagando por servicos sob demanda" secondary="Empresas podem nascer e se manter com o Gitpay, pagando apenas pelas demandas concluídas e integradas com o projeto" />
                  </ListItem>
                </List>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <img width="500" src={octodexMotherhubbertocat} />
            </Grid>
          </Grid>
        </div>
        <div className={classes.mainBlock}>
          <Grid container spacing={24}>
            <div className={classes.divider}>
              <Typography type="headline" gutterBottom>
                Integracoes
              </Typography>
            </div>
            <Grid item xs={12} sm={6}>
              <img width="400" src={deal} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={classes.seclist}>
                <List>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AppsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Gerencie o desenvolvimento da sua startup" secondary="Com o Gitpay as empresas podem gerir seu negócio utilizando ferramentas de desenvolvimento feito sobe medida para você" />
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Pague pelos trabalhos concluídos ou estimule desenvolvedores a contribuir com seu projeto usando contratos inteligentes" secondary="Envolva diferentes tipos de desenvolvendores, com experiências variadas que irão ajudar no desenvolvimento do projeto usando as ferramentas que ele conhece e processos já consolidados" />
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Desenvolva o seu negócio com ferramentas open source, e pagando por servicos sob demanda" secondary="Empresas podem nascer e se manter com o Gitpay, pagando apenas pelas demandas concluídas e integradas com o projeto" />
                  </ListItem>
                </List>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
}

export default withStyles(styles)(Welcome);

/*
 <Grid item xs={12}>
 <div className={classes.defaultCenterBlock}>
 <div className="subscribe-form">
 <SubscribeFrom  {...formProps} />
 </div>
 </div>
 </Grid>
 */
