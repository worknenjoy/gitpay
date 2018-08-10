import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'

const Content = styled.span`
<<<<<<< Updated upstream
   margin-top: 5px;
   padding-bottom: 10px;
   color: white;
   text-align: center;
=======
  padding-bottom: 10px;
  color: white;
  text-align: center;
>>>>>>> Stashed changes
`

const Items = styled.div`
  margin-top: 5px;
`

const ItemBig = styled(Chip)`
  outline: 1px solid orange;
  margin: 10px;
  font-weight: bold;
  width: 170px;
  justify-Content: space-between !important;
`

const ItemSmall = styled(ItemBig)`
  width: 120px;
`

const Icon = styled(Avatar)`
width: 50px !important;
font-size: 0.8rem !important;
border-radius: 16px !important;
`

class Info extends React.Component {
  componentDidMount () {
    this.props.info()
  }
  render () {
    const { tasks, bounties, users } = this.props

    const stats = {
      tasks: { text: 'tarefas', value: tasks || '0' },
      bounties: { text: 'em recompensas', value: '$' + (bounties || '0') },
      users: { text: 'usuários', value: users || '0' }
    }

    return (
      <Content>
        <Typography variant='subheading' color='inherit' gutterBottom>
          Stats
        </Typography>
        <Items>
          <ItemSmall label={ stats.tasks.text } avatar={ <Icon children={ stats.tasks.value } /> } />
          <ItemBig label={ stats.bounties.text } avatar={ <Icon children={ stats.bounties.value } /> } />
          <ItemSmall label={ stats.users.text } avatar={ <Icon children={ stats.users.value } /> } />
        </Items>
      </Content>
    )
  }
}

Info.propTypes = {
  info: PropTypes.func.isRequired,
  tasks: PropTypes.any,
  bounties: PropTypes.any,
  users: PropTypes.any
}

export default Info
