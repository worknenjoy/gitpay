import React from 'react'
import { Chip } from '@material-ui/core'
import ReactPlaceholder from 'react-placeholder'

import { RectShape } from 'react-placeholder/lib/placeholders'

const CustomPlaceholder = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Chip
          key={index}
          style={{ marginTop: 10, marginBottom: 10, marginRight: 10 }}
          variant="outlined"
          label={<RectShape style={{ width: 64, height: 10, backgroundColor: 'gray' }} />}
        />
      ))}
    </>
  )
}

export const IssueLabelsList = ({ labels, completed }) => {
  const taskLabels = (labels) => {
    return (
      <ReactPlaceholder customPlaceholder={<CustomPlaceholder />} ready={completed} style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }} showLoadingAnimation>
        {labels?.length ? labels?.map((label) => ( 
          <Chip
            key={label.id}
            label={label?.name}
            style={{ marginRight: 10, marginTop: 10, marginBottom: 10 }}
            variant="outlined"
          />   
        )): <></>}
      </ReactPlaceholder>
    )
  }

  return <div>{taskLabels(labels)}</div>
}

export default IssueLabelsList
