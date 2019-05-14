import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import TagFacesIcon from '@material-ui/icons/TagFaces'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
})

class Organizations extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object
  }

  handleDelete = data => () => {
    if (data.label === 'React') {
      console.log('Why would you want to delete React?! :)') // eslint-disable-line no-console
      return
    }

    this.setState(state => {
      const chipData = [...state.chipData]
      const chipToDelete = chipData.indexOf(data)
      chipData.splice(chipToDelete, 1)
      return { chipData }
    })
  };

  render () {
    const { classes, data } = this.props

    return (
      <div className={ classes.root }>
        { data.map(data => {
          let icon = null

          if (data.label === 'React') {
            icon = <TagFacesIcon />
          }

          return (
            <Chip
              key={ data.key }
              icon={ icon }
              label={ data.label }
              onDelete={ this.handleDelete(data) }
              className={ classes.chip }
            />
          )
        }) }
      </div>
    )
  }
}

export default withStyles(styles)(Organizations)
