import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import FolderIcon from 'material-ui-icons/Folder'
import { Checkbox, Avatar } from 'material-ui'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'

class Skill extends Component {
  render () {
    const { classes, title } = this.props

    return (
      <Grid container direction='row' alignItems='center' xs={ 6 }>
        <Grid item xs={ 2 }>
          <Avatar className={ classNames(classes.avatar, classes.bigAvatar) }>
            <FolderIcon />
          </Avatar>
        </Grid>
        <Grid item xs={ 6 }>
          <Typography variant='body1' color='default'>
            { title }
          </Typography>
        </Grid>
        <Grid item xs={ 4 } alignItems='flex-end'>
          <Checkbox onClick={ this.props.onClick } checked={ this.props.isSelected ? 'checked' : '' } />
        </Grid>
      </Grid>
    )
  }
}

Skill.PropTypes = {
  classes: PropTypes.object.isRequired,
  preferences: PropTypes.string,
  language: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
}

export default injectIntl(withRouter(Skill))
