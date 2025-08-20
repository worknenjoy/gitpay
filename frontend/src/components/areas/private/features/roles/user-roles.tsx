import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import funder from 'images/bounty.png'
import contributor from 'images/sharing.png'
import maintainer from 'images/notifications.png'

import {
  Paper,
  Grid,
  Typography,
  Checkbox,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import ReactPlaceholder from 'react-placeholder'

const useStyles = makeStyles((theme) => ({
  row: {
    width: '100%',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
      margin: 'auto'
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      width: '100%',
      padding: '3% 0 3% 0',
      margin: '0 0 0 0',
      alignItems: 'center'
    }
  },
  bigRow: {
    margin: '2% 5% 0 0',
    padding: '0 0 0 0',
    '& h1': {
      fontWeight: '500'
    },
    '& p': {
      color: 'gray',
      fontSize: '18px'
    }
  },
  rowList: {
    [theme.breakpoints.down('lg')]: {
      margin: '0 0% 10% 0'
    },
    [theme.breakpoints.up('lg')]: {
      margin: '0 5% 0% 0'
    }
  },
  rowContent: {
    borderRadius: 0,
    height: '100%',
    '& div': {
      height: '100%'
    },
    '& img': {
      backgroundColor: '#263238',
      objectFit: 'cover',
      width: '100%',
      height: '100%'
    }
  },
  media: {
    height: '100%'
  },
  rootLabel: {
    padding: '5px 16px 0px',
    backgroundColor: '#455a64',
    '& h5': {
      color: 'white'
    }
  },
  action: {
    alignItems: 'flex-start',
    paddingTop: '0 ',
    backgroundColor: '#455a64',
    '& p': {
      padding: '0 10px 0 15px',
      float: 'left',
      width: '90%',
      alignItems: 'center',
      color: '#c7ced1',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      fontSize: '0.78rem'
    },
    '& span': {
      paddingTop: 0,
      paddingLeft: 0,
      '& svg': {
        backgroundColor: 'white'
      }
    }
  },
  infoItem: {
    paddingLeft: '10px',
    backgroundColor: '#455a64',
    display: 'flex',
    flexDirection: 'row',
    '& Checkbox': {
      marginRight: '0px',
      backgroundColor: 'white'
    }
  },
  menuItem: {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '0 0 2px',
    '& h4': {
      paddingTop: '10px',
      paddingBottom: '5px',
      margin: 0,
      fontSize: '18px'
    },
    '& p': {
      width: '100%',
      marginTop: '0px',
      marginBottom: '0px'
    }
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  cButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#00b58e',
    fontWeight: 'bold',
    fontFamily: 'arial',
    '& button:focus': {
      outline: 'none'
    }
  },
  sButton: {
    border: 0,
    margin: '0 4% 0 4%',
    padding: '10px 60px 10px',
    backgroundColor: '#00b58e',
    fontSize: '14px',
    height: '20%',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
}))

const messages = defineMessages({
  saveSuccess: {
    id: 'user.role.update.success',
    defaultMessage: 'Role updated successfully'
  },
  saveError: {
    id: 'user.role.update.error',
    defaultMessage: 'We couldnt update your information properly'
  }
})

const imageMap = {
  'funding': funder,
  'contributor': contributor,
  'maintainer': maintainer
}

const Roles = ({
  roles,
  user,
  fetchRoles,
  updateUser,
  onClose,
  addNotification
}) => {
  const { data, completed } = roles
  const classes = useStyles()
  const intl = useIntl()
  const [selectedRoles, setSelectedRoles] = useState([])

  useEffect(() => { 
   fetchRoles().catch(console.log)   
  }, [])

  useEffect(() => {
    setSelectedRoles(user.Types || [])
  }, [user.Types])

  const handleRoleClick = useCallback((event, item) => {
    setSelectedRoles(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) {
        return prev.filter(i => i.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }, [])

  const shouldBeChecked = useCallback((item) => {
    return selectedRoles.some(s => s.name === item.name)
  }, [selectedRoles])

  const handleCancelClick = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const handleSaveClick = async (e) => {
    e.preventDefault()
    try {
      await updateUser({ Types: selectedRoles })
      addNotification(intl.formatMessage(messages.saveSuccess))
      onClose && onClose()
    } catch (e) {
      console.log(e)
      addNotification(intl.formatMessage(messages.saveError))
    }
  }

  const placeholders = Array(3).fill(null); // Define placeholders array

  const CardListPlaceholder = (
    <>
      {placeholders.map((_, index: number) => (
        <Grid key={index} item xs={12} md={3} spacing={2} className={classes.rowList}>
          <Paper>
            <Card className={classes.rowContent} variant="outlined">
                <CardMedia>
                  <div style={{ width: '100%', height: 270, backgroundColor: 'lightgray' }} />
                </CardMedia>
              <CardContent className={classes.rootLabel}>
                <Typography variant="h5">
                  <div style={{ width: '100%', height: '20px', backgroundColor: 'lightgray' }} />
                </Typography>
              </CardContent>
              <CardActions className={classes.action}>
                <Typography variant="body2" color="textSecondary" component="p">
                  <div style={{ width: '100%', height: '20px', backgroundColor: 'lightgray' }} />
                </Typography>
              </CardActions>
            </Card>
          </Paper>
        </Grid>
      ))}
    </>
  );

  return (
    <Paper elevation={2} style={{ padding: '10px 20px 20px 20px' }}>
      <div className={classes.bigRow}>
        <Typography variant="h4" noWrap>
          <FormattedMessage id="user.type.title" defaultMessage="What type of user are you?" />
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" noWrap>
          <FormattedMessage id="user.type.description" defaultMessage="Define how you will use Gitpay. You can choose multiple types of user roles you want." />
        </Typography>
      </div>
      <Grid container className={classes.row} direction="row" alignItems="stretch">
        <ReactPlaceholder customPlaceholder={CardListPlaceholder} ready={completed} showLoadingAnimation={true} style={{ padding: 5, marginBottom: 10, marginTop: 10 }}>
          {data.map(r => (
            <Grid key={r.id} item xs={12} md={3} spacing={2} className={classes.rowList}>
              <Paper>
                <Card className={classes.rowContent} variant="outlined">
                  <CardMedia>
                    <img src={imageMap[r.name]} alt={r.name} width={250} height={270} />
                  </CardMedia>
                  <CardContent className={classes.rootLabel}>
                    <Typography variant="h5">
                      {r.label}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.action}>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {r.description}
                    </Typography>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="large" style={{ color: 'transparent' }} />}
                      checkedIcon={<CheckBoxIcon fontSize="large" />}
                      color="primary"
                      inputProps={{ 'aria-label': r.name }}
                      checked={shouldBeChecked(r)}
                      onChange={(e) => handleRoleClick(e, r)}
                    />
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))}
        </ReactPlaceholder>
      </Grid>
      <div className={classes.buttons}>
        <button onClick={handleCancelClick} className={classes.cButton}>CANCEL</button>
        <button onClick={handleSaveClick} className={classes.sButton}>SAVE</button>
      </div>
    </Paper>
  )
}

Roles.propTypes = {
  classes: PropTypes.object.isRequired,
  updateUser: PropTypes.func,
  createRoles: PropTypes.func,
  deleteRoles: PropTypes.func,
  fetchRoles: PropTypes.func,
  roles: PropTypes.object,
  user: PropTypes.object,
  onClose: PropTypes.func,
  addNotification: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
}

export default Roles
