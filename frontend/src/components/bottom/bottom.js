import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import List from 'material-ui/List';
import Button from 'material-ui/Button';
import SubscribeFrom from 'react-mailchimp-subscribe';
import Divider from 'material-ui/Divider';

import { withStyles } from 'material-ui/styles'

import HowItWorksPeople from '../welcome/how-it-works-people';
import WhoSubscribes from '../welcome/who-subscribes';
import Workflow from '../welcome/workflow';
import HowItWorksCompany from '../welcome/how-it-works-company';
import WhichCompanies from '../welcome/which-companies';
import Consulting from '../welcome/consulting';
import formProps from '../form/form-props';

import mainStyles from '../styles/style';

const logoCompleteGray = require('../../images/logo-complete-gray.png');

const styles = (theme) => mainStyles(theme);

class Bottom extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {

    const {classes} = this.props;

    return (
      <div className={classes.secBlock}>
        <div className={classes.alignLeftPadding}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={3}>
              <Typography type="subheading">
                <strong>Para freelancers</strong>
              </Typography>
              <List component="nav">
                <HowItWorksPeople classes={classes}/>
                <WhoSubscribes classes={classes}/>
                <Workflow classes={classes}/>
              </List>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography type="subheading">
                <strong>Para empresas</strong>
              </Typography>
              <List component="nav">
                <HowItWorksCompany classes={classes}/>
                <WhichCompanies classes={classes}/>
                <Consulting classes={classes}/>
              </List>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography type="subheading">
                <strong>Parceiros</strong>
              </Typography>
              <Button label="Jooble" href="https://br.jooble.org/vagas-de-emprego-desenvolvedor">Jooble</Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography type="subheading">
                Tá na dúvida aí? Não se preocupe, deixe seu e-mail e fique sabendo de novos desafios!
              </Typography>
              <div className="subscribe-form">
                <SubscribeFrom  {...formProps} />
              </div>
              <Typography type="caption">
                <strong>worknenjoy, Inc.</strong> <br />
                Borgergade, 26 sal 4 lej 3 <br />
                København, Hovedstaden 1300 DK
              </Typography>
            </Grid>
          </Grid>
          <Divider className={classes.spacedTop}/>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={2}>
              <div className={classes.logoSimple}>
                <img className={classes.img} src={logoCompleteGray} width="100"/>
              </div>
            </Grid>
          </Grid>
        </div>
    </div>
    )
  }
}

Bottom.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Bottom);
