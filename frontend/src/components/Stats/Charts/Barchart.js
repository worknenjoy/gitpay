import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const data = [{ name: 'Jan', uv: 400, pv: 2400, amt: 2400 }, { name: 'Feb', uv: 300, pv: 2400, amt: 2400 }, { name: 'Mar', uv: 200, pv: 2400, amt: 2400 }, { name: 'Apr', uv: 100, pv: 2400, amt: 2400 }, { name: 'May', uv: 150, pv: 2400, amt: 2400 }, { name: 'Jun', uv: 400, pv: 2400, amt: 2400 }, { name: 'Jul', uv: 80, pv: 2400, amt: 2400 }, { name: 'Aug', uv: 10, pv: 2400, amt: 2400 }, { name: 'Sep', uv: 200, pv: 2400, amt: 2400 }, { name: 'Oct', uv: 300, pv: 2400, amt: 2400 }, { name: 'Nov', uv: 250, pv: 2400, amt: 2400 }, { name: 'Dec', uv: 220, pv: 2400, amt: 2400 }]
export default class Barchart extends Component {
  constructor (props) {
    super(props)

    this.state = {

    }
  }

  render () {
    return (
      <BarChart style={ { margin: 'auto' } } width={ window.innerWidth < 520 ? 400 : 1000 } height={ window.innerWidth < 520 ? 300 : 500 } data={ data }>
        <XAxis dataKey='name' stroke='#8884d8' />
        <YAxis />
        <Tooltip wrapperStyle={ { width: 100, backgroundColor: '#ccc' } } />
        <Legend width={ 100 } wrapperStyle={ { top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' } } />
        <Bar dataKey='uv' fill='#f1f118' barSize={ 30 } />
      </BarChart>
    )
  }
}
