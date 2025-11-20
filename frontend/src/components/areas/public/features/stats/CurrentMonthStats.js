import React, { Component } from 'react'
import styled from 'styled-components'
import media from '../../../../../styleguide/media'
const Wrapper = styled.div`
  background-color: #0085ff;
  width: 30em;
  height: 25em;
  display: flex;
  flex-direction: column;
  border-radius: 0.4em;
  box-shadow: 1px 1px 10px #dadada;
  ${media.phone`
    width: 400px;
    margin: auto;
  `}
`
const Head = styled.h2`
  font-family: sans-serif;
  color: white;
  text-align: center;
  font-size: 2em;
`

const Percent = styled.p`
  margin: 0;
  background-color: lightpink;
  color: red;
  font-size: 0.8em;
  display: flex;
  width: min-content;
  float: left;
  align-items: center;
  padding: 0.3em;
  font-family: sans-serif;
  border-radius: 0.4em;
  margin-top: 0em;
`

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  vertical-align: center;
  margin-top: 4em;
`

const InfoPart = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
`

const Money = styled.h2`
  color: white;
  font-family: sans-serif;
`

export default class CurrentMonthStats extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Wrapper>
        <Head>August 2020</Head>
        <Body>
          <InfoPart>
            <Percent>-05%</Percent>
            <Money>$213,314.52</Money>
          </InfoPart>
          <img src={require('./Asstes/graph.png').default} alt="graph" width="120px" />
        </Body>
      </Wrapper>
    )
  }
}
