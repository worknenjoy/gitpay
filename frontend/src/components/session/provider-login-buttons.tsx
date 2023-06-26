
import React from 'react'
import { Button } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import GithubLogo from '../../images/github-logo.png'
import BitbucketLogo from '../../images/bitbucket-logo.png'
import api from '../../consts'

const ProviderLoginButtons = ({ 
  classes = {},
  contrast = false,
  hideExtra = false,
  provider = undefined,
  position = 'center',
  textPosition = 'center'
}) => {
  const styles = { 
    textAlign: textPosition,
    marginBottom: 10 
  } as React.CSSProperties;

return (
  <>
    { provider ?
      <div style={ styles }>
        <Typography variant='caption' color={ contrast ? 'inherit' : 'textSecondary' } gutterBottom>
          <FormattedMessage id='account.login.connect.provider.connected' defaultMessage='You are already connected on {value}' values={
            { value: provider }
          } />
        </Typography>
      </div> : 
      <div style={ { display: hideExtra ? 'none' : 'block' } }>
        <div style={ styles }>
          <Typography variant='caption' color={ contrast ? 'inherit' : 'textSecondary' } gutterBottom>
            <FormattedMessage id='account.login.connect.provider.label' defaultMessage='You can also connect or signup with ' />
          </Typography>
        </div>
      </div>
      }
    <div style={{ display: 'flex', justifyContent: position }}>
      <div>
        <Button
          style={{ marginRight: 10 }}
          href={`${api.API_URL}/authorize/github`}
          variant='contained'
          color='secondary'
          disabled={provider === 'github'}
        >
          <img width='16' src={GithubLogo} />
          <span style={{marginLeft: 10}}>Github</span>
        </Button>
        <Button
          href={`${api.API_URL}/authorize/bitbucket`}
          variant='contained'
          color='secondary'
          disabled={provider === 'bitbucket'}
        >
          <img width='16' src={BitbucketLogo} />
          <span style={{marginLeft: 10}}>Bitbucket</span>
        </Button>
      </div>
    </div>
  </>
)}

export default ProviderLoginButtons