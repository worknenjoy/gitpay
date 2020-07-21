import React, { Component } from 'react'
import PieChart from './Charts/PieChart'
import styled from 'styled-components'
import media from '../../styleguide/media'

const StackWrapper = styled.div`
  margin: 0;
  display: flex;
  padding: 0em 1em;
  flex-direction: column;
  background: linear-gradient(346deg, rgba(255,255,255,1) 54%, rgba(222,222,222,1) 100%);
  box-shadow: 0.3em 0.3em 0.3em grey;
  width: 30em;
  height: 25em;
  align-items: center;
  vertical-align: center; 
  ${media.phone`
    width: 380px;
    margin: auto;
    margin-bottom: 1em;
  `} 
`
const NavMenu = styled.div`
  margin: 0;
  box-sizing: border-box;
  display: grid;
  text-align: center;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 1em;
  width: 101%;
  justify-content: space-around;
`

const MenuItem = styled.p`
  margin: 0;
  cursor: pointer;
  color: darkgrey;
  font-size: 1.3em;
  font-weight: bolder;
  font-family: sans-serif;
  border-bottom: 0.15em solid grey;
  padding-bottom: 1em
  &:hover,:focus, :active {
    color: #f1f118;
    border-bottom: 0.15em solid #f1f118;
    font-weight: bolder;
  }
`

export default class StackData extends Component {
  constructor (props) {
    super(props)

    this.state = {

    }
  }

  render () {
    return (
      <StackWrapper>
        <NavMenu>
          <MenuItem>Stacks</MenuItem>
          <MenuItem>Labels</MenuItem>
          <MenuItem>Status</MenuItem>
        </NavMenu>
        <PieChart />
      </StackWrapper>
    )
  }
}
