import React from 'react'
import { Button } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Typography from '@mui/material/Typography'
import GithubLogo from 'images/github-logo.png'
import BitbucketLogo from 'images/bitbucket-logo.png'
import api from '../../../../../consts'
import useStyles from './provider-login-buttons.styles'

type ProviderLoginButtonsProps = {
  classes?: any,
  contrast?: boolean,
  hideExtra?: boolean,
  provider?: string,
  login_strategy?: string,
  position?: string,
  textPosition?: string,
  authorizeGithub?: () => void,
  disconnectGithub?: () => void
}

const ProviderLoginButtons = ({
  classes = {},
  contrast = false,
  hideExtra = false,
  provider = undefined,
  login_strategy = undefined,
  position = 'center',
  textPosition = 'center',
  authorizeGithub,
  disconnectGithub
}:ProviderLoginButtonsProps) => {
  const classesLocal = useStyles()
  const styles = {
    textAlign: textPosition,
    marginBottom: 10
  } as React.CSSProperties;

return (
  <>
    { provider ?
      <div style={ styles }>
        <Typography variant="caption" color={ contrast ? 'inherit' : 'textSecondary' } gutterBottom>
          <FormattedMessage id="account.login.connect.provider.connected" defaultMessage="You are already connected on {value}" values={
            { value: provider }
          } />
          { (login_strategy === 'local' || login_strategy === null) &&
          <a href="#" onClick={(e) => {
            e.preventDefault();
            disconnectGithub();
          }} className={classesLocal.linkMargin}>
            <FormattedMessage id="account.login.connect.provider.disconnect" defaultMessage="disconnect" />
          </a> }
        </Typography>
      </div> : 
      <div style={ { display: hideExtra ? 'none' : 'block' } }>
        <div style={ styles }>
          <Typography variant="caption" color={ contrast ? 'inherit' : 'textSecondary' } gutterBottom>
            <FormattedMessage id="account.login.connect.provider.label" defaultMessage="You can also connect or signup with " />
          </Typography>
        </div>
      </div>
      }
    <div style={{ display: 'flex', justifyContent: position }}>
      <div>
        <Button
          className={classesLocal.buttonMargin}
          {...authorizeGithub ?
            { onClick: () => authorizeGithub() } :
            { href: `${api.API_URL}/authorize/github`}
          }
          variant="contained"
          color="secondary"
          disabled={provider === 'github'}
        >
          <img width="16" src={GithubLogo} />
          <span className={classesLocal.textMargin}>Github</span>
        </Button>
        <Button
          href={`${api.API_URL}/authorize/bitbucket`}
          variant="contained"
          color="secondary"
          disabled={provider === 'bitbucket'}
        >
          <img width="16" src={BitbucketLogo} />
          <span className={classesLocal.textMargin}>Bitbucket</span>
        </Button>
      </div>
    </div>
  </>
)}

export default ProviderLoginButtons