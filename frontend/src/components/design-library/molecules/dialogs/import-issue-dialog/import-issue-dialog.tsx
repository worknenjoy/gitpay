import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, FormControl, FormHelperText, Typography, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'
import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

type ImportIssueDialogProps = {
  open: boolean,
  onClose: () => void,
  onImport?: (data: any) => void,
}

const ImportIssueDialog = ({ 
  open,
  onClose,
  onImport
}:ImportIssueDialogProps) => {
  const [ error, setError ] = useState(false)
  const [ url, setUrl ] = useState('')
  const [ provider, setProvider ] = useState('github')
  const [ privateRepo, setPrivateRepo ] = useState(false)
  const [ notListed, setNotListed ] = useState(false)


  const onChange = (e:any) => {
    setUrl(e.target.value)
    setError(false)
  }

  const handleCreateTask = async (e:any) => {
    try { 
      await onImport({ url, privateRepo, notListed, provider })
    } catch (e) {
      setError(true)
      console.log(e)
    }
  }
  
  return (
    <form onSubmit={handleCreateTask} action='POST'>
      <Dialog
        open={ open }
        onClose={onClose}
        aria-label='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          <FormattedMessage id='task.actions.insert.new' defaultMessage='Insert a new task' />
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <Typography variant='subtitle1' gutterBottom>
              <FormattedMessage
                id='task.actions.insert.subheading'
                defaultMessage='Paste the url of an incident of Github or Bitbucket' />
            </Typography>
          </DialogContentText>
          <FormControl style={{width: '100%'}} error={error}>
            <TextField error={error}
              onChange={onChange}
              autoFocus
              margin='dense'
              id='url'
              name='url'
              label='URL'
              type='url'
              fullWidth
            />
            {provider === 'github' &&
              <FormControl component='fieldset'>
                <FormGroup aria-label='position' row>
                  <FormControlLabel
                    value='private'
                    control={<Checkbox color='primary' />}
                    label='private'
                    labelPlacement='end'
                    onChange={(e) => setPrivateRepo(!privateRepo)}
                  />
                  <FormControlLabel
                    value='not_listed'
                    control={<Checkbox color='primary' />}
                    label='not listed'
                    labelPlacement='end'
                    onChange={(e) => setNotListed(!notListed)}
                  />
                </FormGroup>
              </FormControl>
            }
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              <Button
                style={{ marginRight: 10 }}
                color='primary'
                variant={provider === 'github' ? 'contained' : 'outlined'}
                id='github'
                onClick={(e) => setProvider('github')}
              >
                <img width='16' src={logoGithub} />
                <span style={{ marginLeft: 10 }}>Github</span>
              </Button>

              <Button
                color='primary'
                variant={provider === 'bitbucket' ? 'contained' : 'outlined'}
                id='bitbucket'
                onClick={(e) => setProvider('bitbucket')}
              >
                <img width='16' src={logoBitbucket} />
                <span style={{ marginLeft: 10 }}>Bitbucket</span>
              </Button>
            </div>

            {error &&
              <FormHelperText error={error}>
                <FormattedMessage id='task.actions.insert.novalid' defaultMessage='This is not a valid URL' />
              </FormHelperText>
            }
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color='primary'>
            <FormattedMessage id='task.actions.cancel' defaultMessage='Cancel' />
          </Button>
          <Button disabled={!url} onClick={handleCreateTask} variant='contained' color='secondary' >
            <FormattedMessage id='task.actions.insert.label' defaultMessage='Insert' />
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default ImportIssueDialog;