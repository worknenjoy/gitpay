import React from 'react';
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import SubscribeFrom from 'react-mailchimp-subscribe'

import { red, cyan, teal } from 'material-ui/colors';

import './mailchimp.css'

const logo = require('../../images/gitpay-logo.png')
const logoGitlab = require('../../images/gitlab-logo.png')
const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

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
