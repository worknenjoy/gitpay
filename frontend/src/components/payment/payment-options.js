import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import MomentComponent from 'moment';
import TextEllipsis from 'text-ellipsis';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Tabs, { Tab } from 'material-ui/Tabs';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';

import api from '../../consts';
import axios from 'axios';
import { withStyles } from 'material-ui/styles';

import RedeemIcon from 'material-ui-icons/Redeem';
import ItemIcon from 'material-ui-icons/AccountBox';
import DeleteIcon from 'material-ui-icons/Delete';
import ShoppingBasket from 'material-ui-icons/ShoppingBasket';

const logoGithub = require('../../images/github-logo.png');

const styles = theme => ({
  paper: {
    paddingLeft: 20,
    marginLeft: 20
  },
  parentCard: {
    marginTop: 40,
    marginLeft: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    maxWidth: 280,
    marginRight: 10,
    textAlign: 'center'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  },
  icon: {
    backgroundColor: 'black'
  },
  media: {
    width: 128,
    height: 128,
    marginLeft: 64,
    marginTop: 20
  }
});

class PaymentOptions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      cards: [],
      accounts: []
    }

    this.handleTabChange = this.handleTabChange.bind(this);

  }

  componentDidMount() {

  }

  handleTabChange(event, value) {
    this.setState({ tab: value });
  };


  render() {

    const { classes } = this.props;
    const activeTab = this.state.tab;

    const TabContainer = (props) => {
      return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
          {props.children}
        </Typography>
      );
    }

    return(
      <div>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="headline" component="h3">
            Pagamento
          </Typography>
          <Typography component="p" style={{marginBottom: 40}}>
            Aqui você configura seus pagamentos e suas contas bancárias para recebimento
          </Typography>
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.tab}
              onChange={this.handleTabChange}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab value={0} label="Meus cartões" icon={<RedeemIcon />} />
              <Tab value={1} label="Minhas contas bancárias" icon={<ShoppingBasket />} />
            </Tabs>
          </AppBar>
          <TabContainer>
            { activeTab == 0 &&
            <div>
              <Typography variant="subheading">
                { this.props.user.customer_id ? `Costumer id: ${this.props.user.customer_id}` : 'Sem cartão adicionado'}
              </Typography>
              <List component="nav">
                { this.state.cards.map((item, key) => (
                  <ListItem
                    key={key}
                    button
                    onClick={() => this.handleClickListItem(item.id)}
                  >
                    <Chip label={item.status} style={{marginRight: 20, backgroundColor: 'green', color: 'white'}} />
                    <Chip label={item.deadline ? MomentComponent(item.deadline).fromNow() : 'sem data definida'} style={{marginRight: 20, backgroundColor: 'green', color: 'white'}} />
                    <Avatar>
                      <ItemIcon />
                    </Avatar>
                    <ListItemText id={item.id}
                                  primary={TextEllipsis(item.url, 50)}
                                  secondary={`R$ ${item.value}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="provider">
                        <a target="_blank" href={item.url}>
                          <img width="24" src={logoGithub} className={classes.icon} />
                        </a>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
            }
            { activeTab == 1 &&
            <div>
              <Typography variant="subheading">
                { this.props.user.customer_id ? `Costumer id: ${this.props.user.customer_id}` : 'Sem cartão adicionado'}
              </Typography>
              <List component="nav">
                { this.state.accounts.map((item, key) => (
                  <ListItem
                    key={key}
                    button
                    onClick={() => this.handleClickListItem(item.id)}
                  >
                    <Chip label={item.status} style={{marginRight: 20, backgroundColor: 'green', color: 'white'}} />
                    <Chip label={item.deadline ? MomentComponent(item.deadline).fromNow() : 'sem data definida'} style={{marginRight: 20, backgroundColor: 'green', color: 'white'}} />
                    <Avatar>
                      <ItemIcon />
                    </Avatar>
                    <ListItemText id={item.id}
                                  primary={TextEllipsis(item.url, 50)}
                                  secondary={`R$ ${item.value}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="provider">
                        <a target="_blank" href={item.url}>
                          <img width="24" src={logoGithub} className={classes.icon} />
                        </a>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
            }
          </TabContainer>
        </Paper>
      </div>
    )
  }
}

PaymentOptions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(PaymentOptions));
