import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import AccountContainer from '../../containers/account';

import { withStyles } from 'material-ui/styles';


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
      cards: []
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

    return(
      <div>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="headline" component="h3">
            Pagamento
          </Typography>
          <Typography component="p" style={{marginBottom: 40}}>
            Aqui você configura seus pagamentos e suas contas bancárias para recebimento
          </Typography>
          <AccountContainer />
        </Paper>
      </div>
    )
  }
}

PaymentOptions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(PaymentOptions));
