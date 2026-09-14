import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  FormHelperText,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'
import logoGitlab from 'images/gitlab-logo.png'

type ImportIssueDialogProps = {
  open: boolean
  onClose: () => void
  onImport?: (data: any) => void
}

const ImportIssueDialog = ({ open, onClose, onImport }: ImportIssueDialogProps) => {
  const [error, setError] = useState(false)
  const [url, setUrl] = useState('')
  const [provider, setProvider] = useState('github')
  const [privateRepo, setPrivateRepo] = useState(false)
  const [notListed, setNotListed] = useState(false)

  const onChange = (e: any) => {
    const nextUrl = e.target.value
    setUrl(nextUrl)
    setError(false)
    try {
      const host = new URL(nextUrl).hostname.toLowerCase()
      if (host === 'gitlab.com' || host === 'www.gitlab.com') setProvider('gitlab')
      else if (host === 'bitbucket.org' || host === 'www.bitbucket.org') setProvider('bitbucket')
      else if (host === 'github.com' || host === 'www.github.com') setProvider('github')
    } catch (err) {
      // keep the currently selected provider until the URL is valid
    }
  }

  const handleCreateTask = async (e: any) => {
    try {
      await onImport({ url, privateRepo, notListed, provider })
    } catch (e) {
      setError(true)
      console.log(e)
    }
  }

  return (
    <form onSubmit={handleCreateTask} action="POST">
      <Dialog open={open} onClose={onClose} aria-label="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <FormattedMessage id="task.actions.insert.new" defaultMessage="Insert a new task" />
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <Typography variant="subtitle1" gutterBottom>
              <FormattedMessage
                id="task.actions.insert.subheading"
                defaultMessage="Paste the URL of a GitHub, Bitbucket, or GitLab issue"
              />
            </Typography>
          </DialogContentText>
          <FormControl style={{ width: '100%' }} error={error}>
            <TextField
              error={error}
              onChange={onChange}
              autoFocus
              margin="dense"
              id="url"
              name="url"
              label="URL"
              type="url"
              fullWidth
            />
            {provider === 'github' && (
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    value="private"
                    control={<Checkbox color="primary" />}
                    label="private"
                    labelPlacement="end"
                    onChange={(e) => setPrivateRepo(!privateRepo)}
                  />
                  <FormControlLabel
                    value="not_listed"
                    control={<Checkbox color="primary" />}
                    label="not listed"
                    labelPlacement="end"
                    onChange={(e) => setNotListed(!notListed)}
                  />
                </FormGroup>
              </FormControl>
            )}
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              <Button
                style={{ marginRight: 10 }}
                color="primary"
                variant={provider === 'github' ? 'contained' : 'outlined'}
                id="github"
                onClick={(e) => setProvider('github')}
              >
                <img width="16" src={logoGithub} />
                <span style={{ marginLeft: 10 }}>Github</span>
              </Button>

              <Button
                style={{ marginRight: 10 }}
                color="primary"
                variant={provider === 'bitbucket' ? 'contained' : 'outlined'}
                id="bitbucket"
                onClick={(e) => setProvider('bitbucket')}
              >
                <img width="16" src={logoBitbucket} />
                <span style={{ marginLeft: 10 }}>Bitbucket</span>
              </Button>

              <Button
                color="primary"
                variant={provider === 'gitlab' ? 'contained' : 'outlined'}
                id="gitlab"
                onClick={(e) => setProvider('gitlab')}
              >
                <img width="16" src={logoGitlab} alt="" />
                <span style={{ marginLeft: 10 }}>Gitlab</span>
              </Button>
            </div>

            {error && (
              <FormHelperText error={error}>
                <FormattedMessage
                  id="task.actions.insert.novalid"
                  defaultMessage="This is not a valid URL"
                />
              </FormHelperText>
            )}
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            <FormattedMessage id="task.actions.cancel" defaultMessage="Cancel" />
          </Button>
          <Button disabled={!url} onClick={handleCreateTask} variant="contained" color="secondary">
            <FormattedMessage id="task.actions.insert.label" defaultMessage="Insert" />
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default ImportIssueDialog
