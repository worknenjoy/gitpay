import React from 'react';
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import SubscribeFrom from 'react-mailchimp-subscribe'

import { red, cyan, teal } from 'material-ui/colors';

import './mailchimp.css'

const logo = require('../../images/gitpay-logo.png')

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
  },
  img: {
    marginTop: -18
  },
  button: {
    margin: theme.spacing.unit*2,
    display: 'none'
  },
  mainBlock: {
    textAlign: 'center',
    padding: 10,
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
  action: '//gardering.us9.list-manage.com/subscribe/post?u=5e42ed8d71c8269c0acfa701b&amp;id=454966a133',
  messages: {
    inputPlaceholder: "Seu email",
    btnLabel: "Me inscrever!",
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
                para colocar no ar novas idéias
              </Typography>
              <Typography type="subheading" gutterBottom noWrap>

                    com o <strong>Gitpay</strong> você trabalha de forma independente para empresas sob demanda e recebe
                    por cada código integrado
                
              </Typography>
              <Button raised color="primary" className={classes.button}>
                Start to work now
              </Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.defaultCenterBlock}>
              <div className="subscribe-form">
                <SubscribeFrom  {...formProps} />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
}

export default withStyles(styles)(Welcome);


