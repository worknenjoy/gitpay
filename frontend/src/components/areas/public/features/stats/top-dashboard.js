import React, { Component } from 'react'
import styled from 'styled-components'
import media from '../../../../../styleguide/media'

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 20px;
  background-color: #eeeeee;
  margin: 0.3em;
  position: relative;
  display: flex;
  font-family: sans-serif;
  border-radius: 0.4em;

  ${media.phone`
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `}
`

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: no-wrap;
  width: 100%;
  justify-content: flex-end;
  margin: 0;
  ${media.phone`
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
  `}
`

const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  margin: 0 4em;
`

const Head = styled.p`
  color: darkgrey;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
`

const Body = styled.p`
  color: black;
  font-size: 1.3em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
`

class TopDashboard extends Component {
  render() {
    return (
      <Wrapper>
        <ListItem left>
          <Head>Dashboard</Head>
          <Body>Performance</Body>
        </ListItem>
        <List>
          <ListItem>
            <Head>Issues Completed</Head>
            <Body>250</Body>
          </ListItem>
          <ListItem>
            <Head>Users</Head>
            <Body>1200</Body>
          </ListItem>
          <ListItem>
            <Head>Projects</Head>
            <Body>15</Body>
          </ListItem>
        </List>
      </Wrapper>
    )
  }
}

export default TopDashboard
