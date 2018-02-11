import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import AppsIcon from 'material-ui-icons/Apps';
import WorkIcon from 'material-ui-icons/Work';
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet';
import Transition from '../transition';


class WhichCompanies extends Component {

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
        <ListItemText primary="Para quais empresas?"/>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          transition={Transition}
        >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton color="inherits" onClick={this.handleClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="title" color="secondary">
                  Para empresas
                </Typography>
              </Toolbar>
              <div classeName={classes.spacedTop}>
                <div className={classes.divider}>
                  <Typography type="headline" gutterBottom>
                    Para quais empresas?
                  </Typography>
                </div>
              </div>
              <div className={classes.mainlist}>
                <List>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AppsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Para qualquer tipo de empresa"
                                  secondary="O trabalho distribuído pode ajudar a sua empresa a crescer e ter suas idéias desenvolvidas usando processos ágeis de desenvolvimento"/>
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Uma comunidade inteira disponível"
                                  secondary="Empresas usam o Open Source para criar ferramentas compartilhadas e tecnologias que ajudam outras empresas" />
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Avaliamos o seu negócio"
                                  secondary="Levantamos as demandas para preparar seu projeto para trabalhar com o desenvolvimento de forma independente"/>
                  </ListItem>
                </List>
              </div>
            </AppBar>
        </Dialog>
      </ListItem>
    );
  }
}

WhichCompanies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default WhichCompanies;
