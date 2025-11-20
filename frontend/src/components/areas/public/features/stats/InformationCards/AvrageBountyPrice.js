import React, { Component } from 'react'
import styled from 'styled-components'
import LocalMallIcon from '@mui/icons-material/LocalMall'

const Card = styled.div`
  margin: 0;
  width: 20em;
  height: 6em;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  border-radius: 0.4em;
  align-items: center;
  box-shadow: 1px 1px 10px #dadada;
`

const Icon = styled.div`
  margin: 0;
  width: 4em;
  display:flex
  align-items: center;
  height: 4em;
  margin: 0em 1em;
  color: #00C853;
  border-radius: 10em;
  background-color: #B9F6CA;
`

const Head = styled.p`
  margin: 0;
  cursor: pointer;
  font-size: 1em;
  color: darkgrey;
  font-family: sans-serif;
`

const Info = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  vertical-align: center;
`

const Wrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Value = styled.p`
  margin: 0;
  font-size: 1.2em;
  color: black;
  margin-top: 0em;
`

const Percent = styled.p`
  margin: 0;
  background-color: lightpink;
  color: red;
  font-size: 0.8em;
  display: flex;
  align-items: center;
  padding: 0.3em;
  border-radius: 0.4em;
  margin-top: 0em;
  margin-left: 2.5em;
`

export default class AverageBountyPrice extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Card>
        <Icon>
          <LocalMallIcon style={{ fontSize: '2em', margin: 'auto' }} />
        </Icon>
        <Info>
          <Head>Average Bounty Price</Head>
          <Wrapper>
            <Value>$1,234.89</Value>
            <Percent>-05%</Percent>
          </Wrapper>
        </Info>
      </Card>
    )
  }
}
