import React, { useState } from 'react'
import styled from 'styled-components'
import media from '../../../../../styleguide/media'
import LabelPieCharts from './Charts/PieCharts/LabelPieChart'
import StackPieCharts from './Charts/PieCharts/StackPieChart'
import StatusPieCharts from './Charts/PieCharts/StatusPieChart'

const StackWrapper = styled.div`
  margin: 0;
  display: flex;
  padding: 0em 1em;
  flex-direction: column;
  background: #ffffff;
  border-radius: 1em;
  width: 30em;
  height: 25em;
  align-items: center;
  vertical-align: center;
  box-shadow: 1px 1px 10px #dadada;
  ${media.phone`
    width: 380px;
    margin: auto;
    margin-bottom: 1em;
    box-shadow: 1px 1px 30px #dadada;
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
  z-index: 20;
`

const MenuItem = styled.p`
  margin: 0;
  cursor: pointer;
  color: grey;
  font-size: 1.3em;
  font-weight: bolder;
  font-family: sans-serif;
  border-bottom: 0.15em solid grey;
  margin: 0 0.53em;
  padding-bottom: 0.31em
  &:hover, :focus, :active {
    color: #FFC400;
    border-bottom: 0.15em solid #FFC400;
    font-weight: bolder;
  }
`
const PieChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  vertical-align: middle;
`
export default function StackData() {
  const [label, setLabel] = useState('flex')
  const [stack, setStack] = useState('none')
  const [status, setStatus] = useState('none')

  const ChangeChart = (event) => {
    if (event.target.id === 'label') {
      setLabel('flex')
      setStack('none')
      setStatus('none')
    } else if (event.target.id === 'stack') {
      setLabel('none')
      setStack('flex')
      setStatus('none')
    } else if (event.target.id === 'status') {
      setLabel('none')
      setStack('none')
      setStatus('flex')
    }
  }

  return (
    <StackWrapper>
      <NavMenu>
        <MenuItem onClick={ChangeChart} id="stack">
          Stacks
        </MenuItem>
        <MenuItem onClick={ChangeChart} id="label">
          Labels
        </MenuItem>
        <MenuItem onClick={ChangeChart} id="status">
          Status
        </MenuItem>
      </NavMenu>
      <PieChartWrapper>
        <LabelPieCharts display={label} />
        <StatusPieCharts display={status} />
        <StackPieCharts display={stack} />
      </PieChartWrapper>
    </StackWrapper>
  )
}
