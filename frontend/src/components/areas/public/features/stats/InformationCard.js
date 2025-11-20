import React, { Component } from 'react'
import styled from 'styled-components'
import AvrageBountyPrice from './InformationCards/AvrageBountyPrice'
import Bounties from './InformationCards/Bounties'
import Earnings from './InformationCards/Earnings'
import media from '../../../../../styleguide/media'

const Wrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: center;
  justify-content: space-around;
  margin-top: 5em;
  ${media.phone`
    display: flex;
    flex-direction: column;
  `}
`

export default class InformationCard extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Wrapper>
        <Bounties />
        <Earnings />
        <AvrageBountyPrice />
      </Wrapper>
    )
  }
}
