import React, { PureComponent } from 'react'
import { PieChart, Pie, Cell } from 'recharts'

const data = [
  { name: 'Ongoing', value: 50 },
  { name: 'Completed', value: 70 },
  { name: 'Pending', value: 30 },
]

const RADIAN = Math.PI / 180
const COLORS = [
  '#FFD54F',
  '#FFCA28',
  '#FFC107',
  '#FFB300',
  '#FFA000',
  '#FF8F00',
  '#FF6F00',
  '#DD2C00',
]

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x > cx ? x + 10 : x - 10}
      y={y > cy ? y + 15 : y - 15}
      fill={COLORS[(COLORS.length - index) % COLORS.length]}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {name}
    </text>
  )
}
export default class LabelPieCharts extends PureComponent {
  render() {
    return (
      <PieChart
        width={800}
        height={400}
        style={{
          height: '100px',
          alignItems: 'center',
          margin: 'auto',
          marginLeft: '5.8em',
          display: `${this.props.display}`,
        }}
      >
        <Pie
          style={{ backgroundColor: 'blue' }}
          data={data}
          cx={150}
          cy={200}
          labelLine={false}
          dataKey="value"
          nameKey="name"
          innerRadius={65}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell fill={COLORS[(COLORS.length - index) % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
  }
}
