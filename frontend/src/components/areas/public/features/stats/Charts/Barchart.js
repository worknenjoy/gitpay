import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import styled from 'styled-components'

const BarChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 1px 1px 10px #dadada;
  border-radius: 0.4em;
  padding-top: 2em;
  padding-right: 2em;
  padding-left: 2em;
  margin-bottom: 1em;
`

const BarChartHeader = styled.p`
  font-size: 1.5em;
  font-family: sans-serif;
  font-weight: 400;
`

const data = [
  { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 300, pv: 2400, amt: 2400 },
  { name: 'Mar', uv: 200, pv: 2400, amt: 2400 },
  { name: 'Apr', uv: 100, pv: 2400, amt: 2400 },
  { name: 'May', uv: 150, pv: 2400, amt: 2400 },
  { name: 'Jun', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Jul', uv: 80, pv: 2400, amt: 2400 },
  { name: 'Aug', uv: 10, pv: 2400, amt: 2400 },
  { name: 'Sep', uv: 200, pv: 2400, amt: 2400 },
  { name: 'Oct', uv: 300, pv: 2400, amt: 2400 },
  { name: 'Nov', uv: 250, pv: 2400, amt: 2400 },
  { name: 'Dec', uv: 220, pv: 2400, amt: 2400 },
]
export default class Barchart extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <BarChartWrapper>
        <BarChartHeader>Bounties by month</BarChartHeader>
        <BarChart
          style={{
            margin: 'auto',
            backgroundColor: '#FFFFFF',
            paddingTop: '2em',
            paddingRight: '2em',
            paddingLeft: '2em',
            marginBottom: '1em',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
          }}
          width={window.innerWidth < 520 ? 400 : 1000}
          height={window.innerWidth < 520 ? 300 : 500}
          data={data}
        >
          <XAxis dataKey="name" stroke="darkgrey" />
          <YAxis stroke="darkgrey" axisLine={false} />
          <CartesianGrid strokeDasharray="7 7" vertical={false} />
          <Tooltip wrapperStyle={{ width: 50, backgroundColor: '#0085ff' }} />
          <Bar dataKey="uv" fill="#FFC400" barSize={30} />
        </BarChart>
      </BarChartWrapper>
    )
  }
}
