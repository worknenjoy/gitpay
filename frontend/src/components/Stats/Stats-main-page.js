/* eslint-disable indent */
import React, { Component } from 'react'
import styled from 'styled-components'
import TopBarContiner from '../../containers/topbar'
import TopDashboard from './top-dashboard'
import InformationCard from './InformationCard'
import StackData from './StackData'
import CurrentMonthStats from './CurrentMonthStats'
import Barchart from './Charts/Barchart'
import media from '../../styleguide/media'

const Wrapper = styled.div`
  margin: 0;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin-top: 1em;
  ${media.phone`
    display: flex;
    flex-direction: column;
  `}
`

const ChartWrapper = styled.div`
  margin: 0;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin-top: 7em;
  ${media.phone`
    width: 400px;
  `}
`

class Stats extends Component {
    render () {
        return (
          <React.Fragment>
            <TopBarContiner />
            <TopDashboard />
            <Wrapper>
              <StackData />
              <CurrentMonthStats />
            </Wrapper>
            <InformationCard />
            <ChartWrapper>
              <Barchart style={{width: '400px'}} />
            </ChartWrapper>
          </React.Fragment>
        )
    }
}

export default Stats
