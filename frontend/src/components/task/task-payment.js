import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import List from 'material-ui/List'
import ListItem from 'material-ui/List/ListItem'
import ListItemAvatar from 'material-ui/List/ListItemAvatar'
import Divider from 'material-ui/Divider'
import ListItemText from 'material-ui/List/ListItemText'
import DialogTitle from 'material-ui/Dialog/DialogTitle'
import DialogContent from 'material-ui/Dialog/DialogContent'
import DialogContentText from 'material-ui/Dialog/DialogContentText'
import Dialog from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import PaymentTypeIcon from '../payment/payment-type-icon'


import FilterListIcon from 'material-ui-icons/FilterList'
import RedeemIcon from 'material-ui-icons/Redeem'
import blue from 'material-ui/colors/blue'

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
}

const statuses = {
  open: 'Em aberto',
  succeeded: 'Paga',
  fail: 'Falha no pagamento'
}

class TaskPayment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTab: 0
    }
  }

  componentDidMount() {
    this.props.filterTaskOrders({
      provider: 'credit-card'
    })
  }

  payTask = e => {
    this.props.onPayTask(this.props.id)
    this.props.onClose()
  }

  payOrder = (e, id) => {
    this.props.onPayOrder({ id })
    this.props.onClose()
  }

  onTabChange = (e, value) => {
    const providerTab = ['credit-card', 'paypal']
    e.preventDefault()
    this.setState({currentTab: value})
    this.props.filterTaskOrders({
      provider: providerTab[value]
    })
  }


  render () {
    const { classes, orders, ...other } = this.props

    const TabContainer = props => {
      return (
        <Typography component='div' style={ { padding: 8 * 3 } }>
          { props.children }
        </Typography>
      )
    }

    const hasOrders = () => {
      return !!this.props.orders.length
    }

    const displayTotal = () => {
      if (hasOrders()) {
        let sum = 0
        this.props.orders.map(item => {
          if (item.status === 'succeeded' && item.provider !== 'paypal') sum += parseInt(item.amount)
        })
        return sum
      }
    }

    const sendTo = id => {
      const chosen = this.props.assigns.filter(item => {
        return item.id === id
      })
      return chosen[0].User.username
    }

    return (
      <Dialog
        onClose={ this.props.onClose }
        aria-labelledby='simple-dialog-title'
        fullWidth
        maxWidth='md'
        { ...other }
      >
        <DialogTitle id='simple-dialog-title'>
          Pagar pela tarefa como recompensa
        </DialogTitle>
        <DialogContent>
          { this.props.paid && (
            <Typography type='subheading' color='primary' gutterBottom noWrap>
              { 'A transferência para esta tarefa já foi realizada' }
            </Typography>
          ) }
          <div>
            <AppBar position='static' color='default'>
              <Tabs
                value={ this.state.currentTab }
                onChange={this.onTabChange}
                scrollable
                scrollButtons='on'
                indicatorColor='primary'
                textColor='primary'
              >
                <Tab value={0} label='Pagamentos com cartão' icon={ <PaymentTypeIcon type="card" notext /> } />
                <Tab value={1} label='Pagamentos com Paypal' icon={ <PaymentTypeIcon type="paypal" /> } />
              </Tabs>
            </AppBar>
            <TabContainer>
            <List>
              { orders.map((order, index) => (
                <div>
                { order.provider === 'paypal' ?
                  (
                    <ListItem key={ order.id }>
                      <ListItemAvatar>
                        <Avatar className={ classes.avatar }>
                          <FilterListIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={ `$ ${order.amount}` }
                        secondary={ `${statuses[order.status] || 'indefinida'}` }
                      />
                      <Button
                        onClick={ (e) => this.payOrder(e, order.id) }
                        style={ { float: 'right', margin: 10 } }
                        variant='raised'
                        color='primary'
                        disabled={ !this.props.assigned }
                      >
                        <RedeemIcon style={ { marginRight: 10 } } />
                        { `Pagar $ ${order.amount}` }
                      </Button>
                    </ListItem>
                  ) :
                  (
                    <ListItem key={ order.id }>
                      <ListItemAvatar>
                        <Avatar className={ classes.avatar }>
                          <FilterListIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={ `$ ${order.amount}` }
                        secondary={ `${statuses[order.status] || 'indefinida'}` }
                      />
                    </ListItem>
                  )
                }
                </div>
              )) }
            </List>
            </TabContainer>
          </div>
          <DialogContentText>
            <span style={ { display: 'inline-block', margin: 20 } }>
              { !this.props.paid ? (
                <div>
                  { this.props.assigned
                    ? `Enviar para ${sendTo(this.props.assigned)}`
                    : 'Ninguém foi escolhido para esta tarefa, então não temos como efetuar o pagamento' }
                </div>
              ) : (
                <div>
                  { `O pagamento foi efetuado para ${sendTo(
                    this.props.assigned
                  )}` }
                </div>
              ) }
            </span>
          </DialogContentText>
          <Divider />
          { hasOrders() ? (
            <div>
              { !this.props.paid && (
                <Button
                  onClick={ this.payTask }
                  style={ { float: 'right', margin: 10 } }
                  variant='raised'
                  color='primary'
                  disabled={ !this.props.assigned }
                >
                  <RedeemIcon style={ { marginRight: 10 } } />
                  { `Pagar $ ${displayTotal()}` }
                </Button>
              ) }
            </div>
          ) : (
            <ListItemText
              variant='raised'
              disabled
              primary={ 'Não temos nenhum pagamento realizado para esta tarefa' }
            />
          ) }
          { !this.props.paid ? (
            <Button
              onClick={ this.props.onClose }
              style={ { float: 'right', margin: 10 } }
            >
              Cancelar
            </Button>
          ) : (
            <Button
              onClick={ this.props.onClose }
              style={ { float: 'right', margin: 10 } }
            >
              Fechar
            </Button>
          ) }
        </DialogContent>
      </Dialog>
    )
  }
}

TaskPayment.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onPay: PropTypes.func,
  selectedValue: PropTypes.string,
  id: PropTypes.number,
  orders: PropTypes.array,
  assigned: PropTypes.bool,
  paid: PropTypes.bool,
  assigns: PropTypes.array
}

export default withStyles(styles)(TaskPayment)
