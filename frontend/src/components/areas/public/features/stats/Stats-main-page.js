/* eslint-disable indent */
import React, { Component } from 'react'
import styled from 'styled-components'
import TopBarContiner from '../../../../../containers/topbar'
import TopDashboard from './top-dashboard'
import InformationCard from './InformationCard'
import StackData from './StackData'
import CurrentMonthStats from './CurrentMonthStats'
import Barchart from './Charts/Barchart'
import media from '../../../../../styleguide/media'
import Bottom from 'design-library/organisms/layouts/bottom-bar-layouts/bottom-bar-layout/bottom-bar-layout'

const Wrapper = styled.div`
  margin: 0;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin-top: 3em;
  ${media.phone`
    display: flex;
    flex-direction: column;
  `}
`

const ChartWrapper = styled.div`
  margin: 0;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  margin-top: 5em;
  ${media.phone`
    width: 400px;
  `}
`
const StatsPageWrapper = styled.div`
  background-color: #ffffff;
  width: 1150px;
  margin: 0 auto;
  ${media.phone`
    width: 400px;
  `}
`

class Stats extends Component {
  render() {
    return (
      <React.Fragment>
        <div style={{ background: '#FFFFFF' }}>
          <TopBarContiner />
          <StatsPageWrapper>
            <TopDashboard />
            <Wrapper>
              <StackData />
              <CurrentMonthStats />
            </Wrapper>
            <InformationCard />
            <ChartWrapper>
              <Barchart style={{ width: '400px' }} />
            </ChartWrapper>
          </StatsPageWrapper>
          <Bottom />
        </div>
      </React.Fragment>
    )
  }
}

export default Stats
