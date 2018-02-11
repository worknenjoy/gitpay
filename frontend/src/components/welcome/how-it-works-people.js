import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import AppsIcon from 'material-ui-icons/Apps';
import WorkIcon from 'material-ui-icons/Work';
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet';
import Transition from '../transition';


class HowItWorksPeople extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {

  }

  handleClickOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };

  render() {

    const {classes} = this.props;

    return (
      <ListItem button onClick={this.handleClickOpen} component="a">
        <ListItemText primary="Como funciona"/>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          transition={Transition}
        >
          <Grid item xs={12} sm={12}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton color="inherits" onClick={this.handleClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="title" color="secondary">
                  Para freelancers
                </Typography>
              </Toolbar>
              <div classeName={classes.spacedTop}>
                <div className={classes.divider}>
                  <Typography type="headline" gutterBottom>
                    Como funciona
                  </Typography>
                </div>
              </div>
              <div className={classes.mainlist}>
                <Typography variant="title" color="secondary">
                  Freelancers podem usar como ferramenta para trabalhar remotamente usando ferramentas que você já
                  conhece, como Trello e o Github
                </Typography>
                <List>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AppsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Uma metaplataforma de trabalho distribuido"
                                  secondary="O core team é um time dedicado ao gitpay para evoluir e mostrar na prática como o processo funciona"/>
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Projetos são referências"
                                  secondary="Com este modelo membros do projeto podem ser tornar do core de diferentes plataformas"/>
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Entre para o time"
                                  secondary="A cada trabalho realizado a oportunidade de próximos"/>
                  </ListItem>
                </List>
              </div>
            </AppBar>
          </Grid>
        </Dialog>
      </ListItem>
    );
  }
}

HowItWorksPeople.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default HowItWorksPeople;
