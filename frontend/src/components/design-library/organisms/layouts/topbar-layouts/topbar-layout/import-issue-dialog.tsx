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
import logoGitlab from 'images/gitlab-logo.png'
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
    return isGithubUrl(url) || isBitbucketUrl(url) || isGitlabUrl(url)
  }

  const isBitbucketUrl = (url) => {
    return url.indexOf('bitbucket') > -1
  }

  const isGitlabUrl = (url) => {
    try {
      const host = new URL(url).hostname.toLowerCase()
      return host === 'gitlab.com' || host === 'www.gitlab.com'
    } catch (e) {
      return url.indexOf('gitlab.com') > -1
    }
  }

  const onChange = (e: any) => {
    const nextUrl = e.target.value
    setUrl(nextUrl)
    setError(false)
    if (isGitlabUrl(nextUrl)) setProvider('gitlab')
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
                defaultMessage="Paste the URL of a GitHub, Bitbucket, or GitLab issue"
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
                variant={provider === 'gitlab' ? 'contained' : 'outlined'}
                id="gitlab"
                onClick={(e) => setProvider('gitlab')}
              >
                <img width="16" src={logoGitlab} alt="" />
                <span className="provider-label">Gitlab</span>
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
