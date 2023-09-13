import React from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from '@material-ui/core'

import PropTypes from 'prop-types'

function CustomTable({ ...props }) {
  const { tableHead, tableData } = props
  return (
    <div>
      <Table>
        {tableHead !== undefined ? (
          <TableHead>
            <TableRow>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    key={key}
                  >
                    {prop}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key}>
                {prop.map((prop, key) => {
                  return (
                    <TableCell key={key}>
                      {prop}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

CustomTable.defaultProps = {
  tableHeaderColor: 'gray'
}

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray'
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType(
        [
          PropTypes.string, PropTypes.object
        ]
      )
    )
  )
}

export default CustomTable
