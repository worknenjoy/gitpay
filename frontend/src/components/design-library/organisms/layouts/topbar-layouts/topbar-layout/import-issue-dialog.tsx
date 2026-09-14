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
  FormHelperText,
  FormControl,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import isGithubUrl from 'is-github-url'
import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

const logoKde =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="3" fill="#1D99F3"/><text x="8" y="12" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#fff">K</text></svg>'
  )
import api from '../../../../../../consts'
import {
  FullWidthFormControl,
  ProvidersWrapper,
  ProviderButton
} from './import-issue-dialog.styles'

const ImportIssueDialog = ({ user, open, onClose, onCreate }) => {
  const { data = {}, completed } = user
  const [error, setError] = useState(false)
  const [url, setUrl] = useState('')
  const [provider, setProvider] = useState('github')
  const [privateRepo, setPrivateRepo] = useState(false)
  const [notListed, setNotListed] = useState(false)

  const validURL = (url) => {
    return isGithubUrl(url) || isBitbucketUrl(url) || isKdeUrl(url)
  }

  const isBitbucketUrl = (url) => {
    return url.indexOf('bitbucket') > -1
  }

  const isKdeUrl = (url) => {
    try {
      const host = new URL(url).hostname.toLowerCase()
      return host === 'bugs.kde.org' || host === 'www.bugs.kde.org'
    } catch (e) {
      return url.indexOf('bugs.kde.org') > -1
    }
  }

  const onChange = (e: any) => {
    const nextUrl = e.target.value
    setUrl(nextUrl)
    setError(false)
    if (isKdeUrl(nextUrl)) setProvider('kde')
    else if (isBitbucketUrl(nextUrl)) setProvider('bitbucket')
    else if (isGithubUrl(nextUrl)) setProvider('github')
  }

  const handleCreateTask = async (e: any) => {
    if (validURL(url)) {
      if (privateRepo) {
        window.location.href = `${api.API_URL}/authorize/github/private/?url=${encodeURIComponent(url)}&userId=${data.id}`
        return
      }
      try {
        await onCreate({
          private: !!privateRepo,
          not_listed: !!notListed,
          url: url,
          provider: provider
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      setError(true)
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
                defaultMessage="Paste the URL of a GitHub, Bitbucket, or KDE Bugzilla issue"
              />
            </Typography>
          </DialogContentText>
          <FullWidthFormControl error={error}>
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
            <ProvidersWrapper>
              <ProviderButton
                color="primary"
                variant={provider === 'github' ? 'contained' : 'outlined'}
                id="github"
                onClick={(e) => setProvider('github')}
              >
                <img width="16" src={logoGithub} />
                <span className="provider-label">Github</span>
              </ProviderButton>

              <ProviderButton
                color="primary"
                variant={provider === 'bitbucket' ? 'contained' : 'outlined'}
                id="bitbucket"
                onClick={(e) => setProvider('bitbucket')}
              >
                <img width="16" src={logoBitbucket} />
                <span className="provider-label">Bitbucket</span>
              </ProviderButton>

              <ProviderButton
                color="primary"
                variant={provider === 'kde' ? 'contained' : 'outlined'}
                id="kde"
                onClick={(e) => setProvider('kde')}
              >
                <img width="16" src={logoKde} alt="" />
                <span className="provider-label">KDE</span>
              </ProviderButton>
            </ProvidersWrapper>

            {error && (
              <FormHelperText error={error}>
                <FormattedMessage
                  id="task.actions.insert.novalid"
                  defaultMessage="This is not a valid URL"
                />
              </FormHelperText>
            )}
          </FullWidthFormControl>
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
