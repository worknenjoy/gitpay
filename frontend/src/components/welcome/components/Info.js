import React from 'react'
import styled from 'styled-components'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'

const data = {
    tasks: {text: 'Total of Tasks', value: '--'},
    orders: {text: 'Bounties Paid', value: '--'},
    users: {text: 'Total of Users', value: '--'}    
}

const Content = styled.span`
   padding-bottom: 10px;
   color: white;
   text-align: center;
`

const Items = styled.div`
  margin-top: 20px;
`

const Item = styled(Chip)`
display:
  outline: 1px solid orange;
  margin: 10px;
  font-weight: bold;
  width: 140px;
  justify-Content: space-between !important;
`

const Icon = styled(Avatar)`
width: 90px !important;
font-size: 0.8rem !important;
border-radius: 16px !important;
`
class Info extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      data
    }
    
  }

  componentDidMount () {    
    this.props.info();
  }
  render() {    
    data.tasks.value = this.props.tasks
    data.orders.value = '$' + this.props.bounties
    data.users.value = this.props.users
    
return (
  <Content>
    <Typography variant='subheading' color='inherit' gutterBottom>
        Stats
      <Items>
      <Item label={data.tasks.value} avatar={<Icon children={data.tasks.text}/>} />
      <Item label={data.orders.value} avatar={<Icon children={data.orders.text}/>}/>
      <Item label={data.users.value} avatar={<Icon children={data.users.text}/>} />
      </Items>
    </Typography>
  </Content>
  );
  }
}

export default Info
