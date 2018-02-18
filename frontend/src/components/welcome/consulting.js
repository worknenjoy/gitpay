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


class Consulting extends Component {

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
        <ListItemText primary="Consultoria"/>
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
              <div className={classes.spacedTop}>
                <div className={classes.divider}>
                  <Typography type="headline" gutterBottom>
                    Consultoria
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
                    <ListItemText primary="Damos consultoria para seu negócio seguir em frente"
                                  secondary="Você cria as demandas de negócio e colocamos em prática usando as ferramentas ágeis do mercado"/>
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Diversas competências"
                                  secondary="O Gitpay é feito por desenvolvedores, mas quer tornar acessível para outras áreas os processos ágeis, usando os poderes do Git para concepção e marketing de conteúdo" />
                  </ListItem>
                  <ListItem className={classes.listIconTop}>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Colocamos sua empresa na nuvem"
                                  secondary="Gerenciamos a infra estrutura em diversos serviços como Amazon, Heroku e Google Cloud"/>
                  </ListItem>
                </List>
              </div>
            </AppBar>
        </Dialog>
      </ListItem>
    );
  }
}

Consulting.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Consulting;
