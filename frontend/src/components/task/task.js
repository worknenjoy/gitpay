import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MomentComponent from 'moment'
import ReactPlaceholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import 'react-placeholder/lib/reactPlaceholder.css'

import Grid from 'material-ui/Grid'
import Avatar from 'material-ui/Avatar'
import Card, { CardContent, CardMedia } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'

import RedeemIcon from 'material-ui-icons/Redeem'
import ShoppingBasket from 'material-ui-icons/ShoppingBasket'
import AddIcon from 'material-ui-icons/Add'
import FilterIcon from 'material-ui-icons/FilterList'
import TrophyIcon from 'material-ui-icons/AccountBalanceWallet'
import DateIcon from 'material-ui-icons/DateRange'
import CalendarIcon from 'material-ui-icons/PermContactCalendar'
import GroupWorkIcon from 'material-ui-icons/GroupAdd'
import DoneIcon from 'material-ui-icons/Done'

import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import Chip from 'material-ui/Chip'
import PaymentDialog from '../payment/payment-dialog'
import PaypalPaymentDialog from '../payment/paypal-payment-dialog'
import StatusDialog from './status-dialog'
import TaskPayment from './task-payment'

import StatsCard from '../Cards/StatsCard'
import RegularCard from '../Cards/RegularCard'
import Table from '../Table/Table'

import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'

import marked from 'marked'
import renderHTML from 'react-render-html'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'
import LoginButton from '../session/login-button'

const paymentIcon = require('../../images/payment-icon-alt.png')
const timeIcon = require('../../images/time-icon.png')
const creditCardIcon = require('../../images/credit-card-icon.svg')

const logoGithub = require('../../images/github-logo.png')
const logoPaypal = require('../../images/paypal-icon.png')

import Constants from '../../consts'

import { PageContent } from 'app/styleguide/components/Page'

import styled from 'styled-components'
import media from 'app/styleguide/media'

const TaskHeader = styled.div`
  box-sizing: border-box;
  background: black;
  padding: 1rem 3rem 1rem 3rem;
  position: relative;
  margin: -2rem -3rem 1rem -3rem;

  border-top: 1px solid #999;

  ${media.phone`
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;

    & h1 {
      font-size: 1.75rem;
    }
  `}
`

const Tags = styled.div`
  display: inline-block;

  ${media.phone`
    display: block;
    margin-top: 1rem;
    margin-left: -20px;
  `}
`

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  rootTabs: {
    backgroundColor: theme.palette.text.secondary
  },
  formPayment: {
    marginTop: 10,
    marginBottom: 10
  },
  chipContainer: {
    marginTop: 12,
    marginBottom: 12
  },
  chip: {
    marginRight: 10,
    marginBottom: 20
  },
  chipStatus: {
    marginLeft: 20,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  chipStatusPaid: {
    marginLeft: 0,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  typo: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -30,
    paddingTop: 10,
    paddingBottom: 20
  },
  typoSmall: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
    paddingTop: 10,
    paddingBottom: 20,
    borderTop: '1px solid #999'
  },
  typoEmpty: {
    marginTop: 40,
    marginBottom: 5,
    padding: 10,
    fontSize: 32
  },
  gridBlock: {
    paddingLeft: 20,
    paddingRight: 20
  },
  spaceRight: {
    marginRight: 10
  },
  altButton: {
    margin: 0,
    border: `1px dashed ${theme.palette.primary.main}`
  },
  btnPayment: {
    float: 'right',
    marginTop: 10,
    color: 'white'
  },
  avatar: {
    width: 40,
    height: 40,
    border: `4px solid ${theme.palette.primary.main}`
  },
  bigAvatar: {
    width: 180,
    height: 180
  },
  smallAvatar: {
    width: 32,
    height: 32
  },
  parentCard: {
    marginTop: 40,
    marginLeft: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  otherCard: {
    maxWidth: 280,
    marginRight: 10,
    marginBottom: 40,
    textAlign: 'center'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  },
  media: {
    width: 60,
    height: 60,
    marginLeft: 0,
    marginTop: 0
  },
  menuContainer: {
    marginBottom: 40,
    marginRight: 20,
    marginLeft: 20,
    width: '100%'
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  icon: {},
  card: {
    display: 'flex',
    marginBottom: 20
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  contentBody: {
    img: {
      width: 400
    }
  },
  cover: {
    width: 44,
    height: 44,
    margin: 20,
    padding: 20,
    textAlign: 'center',
    verticalAlign: 'center'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  },
  light: {
    color: 'white'
  }
})

class Task extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deadline: null,
      assigned: null,
      final_price: 0,
      current_price: 0,
      order_price: 0,
      assignDialog: false,
      statusDialog: false,
      taskPaymentDialog: false,
      notification: {
        open: false,
        message: 'loading'
      }
    }

    this.handleDeadline = this.handleDeadline.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputChangeCalendar = this.handleInputChangeCalendar.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleCloseNotification = this.handleCloseNotification.bind(this)
    this.handleAssignDialogClose = this.handleAssignDialogClose.bind(this)
    this.handleAssignDialogOpen = this.handleAssignDialogOpen.bind(this)
    this.handleAssignTask = this.handleAssignTask.bind(this)
    this.handleStatusDialog = this.handleStatusDialog.bind(this)
    this.handleStatusDialogClose = this.handleStatusDialogClose.bind(this)
    this.handleTaskPaymentDialog = this.handleTaskPaymentDialog.bind(this)
    this.handleTaskPaymentDialogClose = this.handleTaskPaymentDialogClose.bind(
      this
    )
  }

  componentWillMount () {
    this.props.fetchTask(this.props.match.params.id)
    this.props.syncTask(this.props.match.params.id)
  }

  handleCloseNotification () {
    this.setState({ notification: { open: false } })
  }

  handlePayment (value) {
    this.props.openDialog(value)
  }

  handleDeadline () {
    this.props.updateTask({
      id: this.props.match.params.id,
      deadline: this.state.deadline
    })
  }

  pickTaskPrice (price) {
    this.setState({
      current_price: price,
      final_price: parseInt(price) + parseInt(this.state.order_price)
    })
  }

  pickTaskDeadline (time) {
    const date = MomentComponent(this.state.deadline).isValid()
      ? MomentComponent(this.state.deadline)
      : MomentComponent()
    const newDate = date.add(time, 'days').format()
    this.setState({ deadline: newDate })
  }

  handleInputChange (e) {
    e.preventDefault()
    this.setState({ current_price: e.target.value })
  }

  handleInputChangeCalendar (e) {
    this.setState({ deadline: e.target.value })
  }

  handleTabChange (event, tab) {
    this.props.changeTab(tab)
  }

  handleAssignDialogClose () {
    this.setState({ assignDialog: false })
  }

  handleAssignDialogOpen () {
    this.setState({ assignDialog: true })
  }

  handleStatusDialog () {
    this.setState({ statusDialog: true })
  }

  handleStatusDialogClose () {
    this.setState({ statusDialog: false })
  }

  handleTaskPaymentDialog () {
    this.setState({ taskPaymentDialog: true })
  }

  handleTaskPaymentDialogClose () {
    this.setState({ taskPaymentDialog: false })
  }

  handleAssignTask () {
    this.props.updateTask({
      id: this.props.match.params.id,
      Assigns: [
        {
          userId: this.props.user.id
        }
      ]
    })
    this.setState({ assignDialog: false })
  }

  render () {
    const { classes, task } = this.props

    const TabContainer = props => {
      return (
        <Typography component='div' style={ { padding: 8 * 3 } }>
          { props.children }
        </Typography>
      )
    }

    const statuses = {
      open: 'Em aberto',
      succeeded: 'Realizado com sucesso',
      fail: 'Falha no pagamento'
    }

    const taskOwner = () => {
      return this.props.logged && this.props.user.id === task.data.userId
    }

    const paymentType = type => {
      if(type === 'paypal') {
        return (<div style={{textAlign: 'left'}}><img src={logoPaypal} width={48} /></div>)
      }
      return (<div style={{textAlign: 'left', color: '#12789a', fontSize: 10}}><img src={creditCardIcon} width={48} /> <br />Cartão de crédito</div>)
    }

    const userRow = user => {
      return (<span>
            { user.profile_url
              ? (
                <Tooltip id='tooltip-github' title='ver perfil deste usuário no github' placement='bottom'>
                  <a target='_blank' href={ user.profile_url } style={ { display: 'flex', alignItems: 'center' } }>
                    <span>{ user.username }</span>
                    <img style={ { backgroundColor: 'black', marginLeft: 10 } } width={ 18 } src={ logoGithub } />
                  </a>
                </Tooltip>
              )
              : (
                `${user.username}`
              )
            }
          </span>)
    }

    const displayOrders = orders => {
      if (!orders.length) {
        return []
      }
      return orders.map((item, i) => [
        item.paid ? 'Sim' : 'Não',
        statuses[item.status] || 'Não processado',
        `$ ${item.amount}`,
        MomentComponent(item.updatedAt).fromNow(),
        userRow(item.User),
        paymentType(item.provider)
      ])
    }

    const assignActions = (assign) => {
      const taskData = this.props.task.data

      return (
        <div>
          { taskOwner() &&
          <Button
            disabled={ assign.id === taskData.assigned }
            onClick={ () =>
              this.props.assignTask(this.props.task.data.id, assign.id)
            }
            style={ { marginRight: 10 } }
            variant='raised'
            size='small'
            color='primary'
          >
            <GroupWorkIcon style={ { marginRight: 5 } } /> escolher
          </Button>
          }
          { assign.id === taskData.assigned && (
            <Chip label='Escolhido' className={ classes.chip } />
          ) }
        </div>
      )
    }

    const displayAssigns = assign => {
      if (!assign.length) {
        return []
      }

      const items = assign.map((item, i) => {
        const userField = () => (
          <span>
            { item.User.profile_url
              ? (
                <Tooltip id='tooltip-github' title='ver perfil deste usuário no github' placement='bottom'>
                  <a target='_blank' href={ item.User.profile_url } style={ { display: 'flex', alignItems: 'center' } }>
                    <span>{ item.User.username }</span>
                    <img style={ { backgroundColor: 'black', marginLeft: 10 } } width={ 18 } src={ logoGithub } />
                  </a>
                </Tooltip>
              )
              : (
                `${item.User.username}`
              )
            }
          </span>
        )

        return [userField(), MomentComponent(item.updatedAt).fromNow(), assignActions(item)]
      })

      return items
    }

    const headerPlaceholder = (
      <div className='line-holder'>
        <RectShape
          color='white'
          style={ { marginLeft: 20, marginTop: 0, width: 300, height: 20 } }
        />
      </div>
    )

    return (
      <div>
        <TopBarContainer />
        <PageContent>
          <TaskHeader>
            <Typography variant='subheading' style={ { color: '#bbb' } }>
              <ReactPlaceholder showLoadingAnimation type='text' rows={ 1 }
                ready={ task.completed }>
                <a className={ classes.white } href={ task.data.url }>
                  { task.data.metadata.company }
                </a>
              </ReactPlaceholder>
            </Typography>

            <ReactPlaceholder customPlaceholder={ headerPlaceholder } showLoadingAnimation
              ready={ task.completed }>
              <Typography variant='display1' color='primary' align='left' gutterBottom>
                <a className={ classes.white } href={ task.data.url }>
                  { task.data.title }
                </a>

                <Tags>
                  <Chip
                    style={ { marginRight: 10 } }
                    label={ Constants.STATUSES[task.data.status] }
                    className={ classes.chipStatus }
                    onDelete={ this.handleStatusDialog }
                    onClick={ this.handleStatusDialog }
                    deleteIcon={ <DoneIcon /> }
                  />

                  { task.data.paid && (
                    <Chip
                      style={ { marginRight: 10 } }
                      label='Paga'
                      className={ classes.chipStatusPaid }
                      onDelete={ this.handleTaskPaymentDialog }
                      onClick={ this.handleTaskPaymentDialog }
                      deleteIcon={ <RedeemIcon /> }
                    />
                  ) }
                </Tags>

              </Typography>
            </ReactPlaceholder>
          </TaskHeader>

          <Grid
            container
            justify='flex-start'
            direction='row'
            spacing={ 24 }
          >
            <Grid
              item
              sm={ 12 }
              style={ {
                display: 'flex',
                alignItems: 'center',
                marginTop: 12,
                position: 'relative'
              } }
            >
              <div style={ { position: 'absolute', left: 18, top: 5 } }>
                <Typography color='default'>Autor:</Typography>
              </div>
              <Tooltip
                id='tooltip-github'
                title={ `Criado por ${task.data.metadata.issue.user.login}` }
                placement='bottom'
              >
                <a
                  href={ `${task.data.metadata.issue.user.html_url}` }
                  target='_blank'
                >
                  <Avatar
                    src={ task.data.metadata.issue.user.avatar_url }
                    className={ classNames(classes.avatar) }
                  />
                </a>
              </Tooltip>
              <div className={ classes.paper }>
                <Button
                  style={ { marginRight: 10 } }
                  onClick={ this.handleAssignDialogOpen }
                  size='medium'
                  color='primary'
                  className={ classes.altButton }
                >
                  <span className={ classes.spaceRight }>
                  Tenho interesse nesta tarefa!
                  </span>{ ' ' }
                  <AddIcon />
                </Button>
                { taskOwner() && (
                  <div style={ { display: 'inline-block' } }>
                    <Button
                      style={ { marginRight: 10 } }
                      onClick={ this.handleStatusDialog }
                      size='small'
                      color='primary'
                      className={ classes.altButton }
                    >
                      <span className={ classes.spaceRight }>Mudar status</span>{ ' ' }
                      <FilterIcon />
                    </Button>
                    <Button
                      onClick={ this.handleTaskPaymentDialog }
                      size='small'
                      color='primary'
                      className={ classes.altButton }
                    >
                      <span className={ classes.spaceRight }>Pagar</span>{ ' ' }
                      <RedeemIcon />
                    </Button>
                    <StatusDialog
                      id={ task.data.id }
                      providerStatus={ task.data.metadata.issue.state }
                      onSelect={ this.props.updateTask }
                      selectedValue={ task.data.status }
                      open={ this.state.statusDialog }
                      onClose={ this.handleStatusDialogClose }
                    />
                    <TaskPayment
                      id={ task.data.id }
                      paid={ task.data.paid }
                      transferId={ task.data.transfer_id }
                      assigned={ task.data.assigned }
                      assigns={ task.data.assigns }
                      orders={ task.data.orders }
                      open={ this.state.taskPaymentDialog }
                      onClose={ this.handleTaskPaymentDialogClose }
                      onPay={ this.props.paymentTask }
                    />
                  </div>
                ) }
                <Dialog
                  open={ this.state.assignDialog }
                  onClose={ this.handleAssignDialogClose }
                  aria-labelledby='form-dialog-title'
                >
                  { !this.props.logged ? (
                    <div>
                      <DialogTitle id='form-dialog-title'>Você precisa estar logado para realizar esta tarefa</DialogTitle>
                      <DialogContent>
                        <div className={ classes.mainBlock }>
                          <LoginButton referer={ this.props.location } />
                        </div>
                      </DialogContent>
                    </div>
                  ) : (
                    <div>
                      <DialogTitle id='form-dialog-title'>Você tem interesse nesta tarefa?</DialogTitle>
                      <DialogContent>
                        <Typography type='subheading' gutterBottom>
                    Você poderá ser associado a tarefa no github para receber a recompensa quando o seu código for integrado
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={ this.handleAssignDialogClose } color='primary'>
                    Cancelar
                        </Button>
                        <Button onClick={ this.handleAssignTask } variant='raised' color='secondary' >
                    Desafio aceito, quero esta tarefa!
                        </Button>
                      </DialogActions>
                    </div>
                  ) }
                </Dialog>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 8 }>
              <div className={ classes.rootTabs }>
                <AppBar position='static' color='default'>
                  <Tabs
                    value={ task.tab }
                    onChange={ this.handleTabChange }
                    scrollable
                    scrollButtons='on'
                    indicatorColor='primary'
                    textColor='primary'
                  >
                    <Tab label='Tarefa' icon={ <RedeemIcon /> } />
                    <Tab label='Pedidos' icon={ <ShoppingBasket /> } />
                    <Tab label='Interessados' icon={ <GroupWorkIcon /> } />
                  </Tabs>
                </AppBar>
                { task.tab === 0 &&
                <TabContainer>
                  { taskOwner() &&
                  <Card className={ classes.card }>
                    <CardMedia
                      className={ classes.cover }
                      image={ paymentIcon }
                      title='Realize o pagamento pela tarefa'
                    />
                    <div className={ classes.details }>
                      <CardContent className={ classes.content }>
                        <Typography variant='headline'>Crie uma recompensa para esta tarefa</Typography>
                        <Typography variant='subheading' color='textSecondary'>
                        Realize um pagamento por esta tarefa para que alguém possa desenvolvê-la e receber o pagamento como recompensa.
                        </Typography>
                        <div className={ classes.chipContainer }>
                          <Chip
                            label=' $ 20'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(20) }
                          />
                          <Chip
                            label=' $ 50'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(50) }
                          />
                          <Chip
                            label=' $ 100'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(100) }
                          />
                          <Chip
                            label=' $ 150'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(150) }
                          />
                          <Chip
                            label=' $ 300'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskPrice(300) }
                          />
                        </div>
                        <form className={ classes.formPayment } action='POST'>
                          <FormControl fullWidth>
                            <InputLabel htmlFor='adornment-amount'>Valor</InputLabel>
                            <Input
                              id='adornment-amount'
                              startAdornment={ <InputAdornment position='start'>$</InputAdornment> }
                              placeholder='Insira um valor'
                              type='number'
                              inputProps={ { 'min': 0 } }
                              value={ this.state.current_price }
                              onChange={ this.handleInputChange }
                            />
                          </FormControl>
                          <Button style={{ marginLeft: 20 }}disabled={ !this.state.current_price } onClick={ () => this.handlePayment('PaymentDialog') } variant='raised' color='primary' className={ classes.btnPayment }>
                            { `Pagar $ ${this.state.current_price} com cartão de crédito` }
                          </Button>
                          <Button disabled={ !this.state.current_price } onClick={ () => this.handlePayment('PaypalPaymentDialog') } variant='raised' color='primary' className={ classes.btnPayment }>
                            { `Pagar $ ${this.state.current_price} com Paypal` }
                          </Button>
                        </form>
                      </CardContent>
                    </div>
                  </Card> }
                  { taskOwner() &&
                  <Card className={ classes.card }>
                    <CardMedia
                      className={ classes.cover }
                      image={ timeIcon }
                      title='Escolha uma data limite para realizacao desta tarefa'
                    />
                    <div className={ classes.details }>
                      <CardContent className={ classes.content }>
                        <Typography variant='headline'>Escolha uma data limite para realizacao desta tarefa</Typography>
                        <Typography variant='subheading' color='textSecondary'>
                        Escolha uma data em que deseja que ela precisa ser finalizada
                        </Typography>
                        <div className={ classes.chipContainer }>
                          <Chip
                            label=' daqui uma semana '
                            className={ classes.chip }
                            onClick={ () => this.pickTaskDeadline(7) }
                          />
                          <Chip
                            label=' daqui quinze dias '
                            className={ classes.chip }
                            onClick={ () => this.pickTaskDeadline(15) }
                          />
                          <Chip
                            label=' daqui vinte dias '
                            className={ classes.chip }
                            onClick={ () => this.pickTaskDeadline(20) }
                          />
                          <Chip
                            label=' daqui um mês'
                            className={ classes.chip }
                            onClick={ () => this.pickTaskDeadline(30) }
                          />
                        </div>
                        <form className={ classes.formPayment } action='POST'>
                          <FormControl fullWidth>
                            <InputLabel htmlFor='adornment-amount'>Dia</InputLabel>
                            <Input
                              id='adornment-date'
                              startAdornment={ <InputAdornment position='start'><DateIcon /></InputAdornment> }
                              placeholder='Insira uma data'
                              type='date'
                              value={ `${MomentComponent(this.state.deadline).format('YYYY-MM-DD')}` || `${MomentComponent().format('YYYY-MM-DD')}` }
                              onChange={ this.handleInputChangeCalendar }
                            />
                          </FormControl>
                          <Button disabled={ !this.state.deadline } onClick={ this.handleDeadline } variant='raised' color='primary' className={ classes.btnPayment }>
                            { this.state.deadline ? `Escolher ${MomentComponent(this.state.deadline).format('DD/MM/YYYY')} como data limite` : 'Salvar data limite' }
                          </Button>
                        </form>
                      </CardContent>
                      <div className={ classes.controls } />
                    </div>
                  </Card> }
                  <Card className={ classes.paper }>
                    <Typography variant='title' align='left' gutterBottom>
                    Descrição
                    </Typography>
                    <Typography variant='body2' align='left' gutterBottom>
                      <ReactPlaceholder showLoadingAnimation type='text' rows={ 1 } ready={ task.completed }>
                        <div className={ classes.contentBody }>
                          { renderHTML(marked(task.data.metadata.issue.body)) }
                        </div>
                      </ReactPlaceholder>
                    </Typography>
                  </Card>
                </TabContainer> }
                { task.tab === 1 &&
                <div style={ { marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20 } }>
                  <RegularCard
                    headerColor='green'
                    cardTitle='Pagamentos realizados para esta tarefa'
                    cardSubtitle='Elas serão transferidas para quem conclui-la'
                    content={
                      <Table
                        tableHeaderColor='warning'
                        tableHead={ ['Pago', 'Status', 'Valor', 'Criado em', 'Usuário', 'Pagamento'] }
                        tableData={ task.data.orders.length ? displayOrders(task.data.orders) : [] }
                      />
                    }
                  />
                </div> }
                { task.tab === 2 &&
                <div style={ { marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20 } }>
                  <RegularCard
                    headerColor='green'
                    cardTitle='Interessados em realizar esta tarefa'
                    cardSubtitle='Estes são usuários interessados em realizar esta tarefa'
                    content={
                      <Table
                        tableHeaderColor='warning'
                        tableHead={ ['Usuário', 'Quando', 'Acões'] }
                        tableData={ task.data.assigns.length ? displayAssigns(task.data.assigns) : [] }
                      />
                    }
                  />
                </div> }
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 4 }>
              <StatsCard
                icon={ TrophyIcon }
                iconColor='green'
                title='Valor da tarefa'
                description={ `$ ${task.values.available}` }
                statIcon={ CalendarIcon }
                statText={ `Aprovados: $ ${task.values.available}, Pendentes: $ ${task.values.pending}, Falhos: $ ${task.values.failed}` }
              />
              { MomentComponent(task.data.deadline).isValid() &&
              <StatsCard
                icon={ DateIcon }
                iconColor='green'
                title='data limite para realizacao da tarefa'
                description={ MomentComponent(task.data.deadline).format('DD-MM-YYYY') }
                statIcon={ DateIcon }
                statText={ `${MomentComponent(task.data.deadline).fromNow()}` }
              /> }
            </Grid>
          </Grid>

          <PaymentDialog
            open={ this.props.dialog.open && this.props.dialog.target === 'PaymentDialog'}
            onClose={ this.props.closeDialog }
            addNotification={ this.props.addNotification }
            onPayment={ this.props.updateTask }
            itemPrice={ this.state.current_price }
            price={ this.state.final_price }
            task={ this.props.match.params.id }
          />

          <PaypalPaymentDialog
            open={ this.props.dialog.open && this.props.dialog.target === 'PaypalPaymentDialog'}
            onClose={ this.props.closeDialog }
            addNotification={ this.props.addNotification }
            onPayment={ this.props.updateTask }
            itemPrice={ this.state.current_price }
            price={ this.state.final_price }
            task={ this.props.match.params.id }
            createOrder={ this.props.createOrder }
            user={this.props.user}
            order={this.props.order}
          />

        </PageContent>
        <Bottom />
      </div>
    )
  }
}

Task.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchTask: PropTypes.func,
  dialog: PropTypes.object,
  addNotification: PropTypes.func,
  location: PropTypes.string,
  paymentTask: PropTypes.func,
  assignTask: PropTypes.func,
  task: PropTypes.object,
  logged: PropTypes.bool,
  user: PropTypes.object,
  match: PropTypes.object,
  changeTab: PropTypes.func,
  openDialog: PropTypes.func,
  updateTask: PropTypes.func,
  closeDialog: PropTypes.func,
  syncTask: PropTypes.func
}

export default withStyles(styles)(Task)
