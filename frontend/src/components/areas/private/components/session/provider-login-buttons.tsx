import React from 'react'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Typography from '@mui/material/Typography'
import GithubLogo from 'images/github-logo.png'
import BitbucketLogo from 'images/bitbucket-logo.png'
import api from '../../../../../consts'

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
}) => {
  const styles = {
    textAlign: textPosition,
    marginBottom: 10
  } as React.CSSProperties

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <>
      {provider ? (
        <div style={styles}>
          <Typography variant="caption" color={contrast ? 'inherit' : 'textSecondary'} gutterBottom>
            <FormattedMessage
              id="account.login.connect.provider.connected"
              defaultMessage="You are already connected on {value}"
              values={{ value: provider }}
            />
            {(login_strategy === 'local' || login_strategy === null) && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  disconnectGithub()
                }}
                style={{ display: 'inline-box', marginLeft: 5 }}
              >
                <FormattedMessage
                  id="account.login.connect.provider.disconnect"
                  defaultMessage="disconnect"
                />
              </a>
            )}
          </Typography>
        </div>
      ) : (
        <div style={{ display: hideExtra ? 'none' : 'block' }}>
          <div style={styles}>
            <Typography
              variant="caption"
              color={contrast ? 'inherit' : 'textSecondary'}
              gutterBottom
            >
              <FormattedMessage
                id="account.login.connect.provider.label"
                defaultMessage="You can also connect or signup with "
              />
            </Typography>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: position }}>
        <div>
          <Button
            {...(isDesktop
              ? { style: { marginRight: 10 } }
              : { fullWidth: true, style: { marginBottom: 10 } })}
            {...(authorizeGithub
              ? { onClick: () => authorizeGithub() }
              : { href: `${api.API_URL}/authorize/github` })}
            variant="contained"
            color="secondary"
            disabled={provider === 'github'}
          >
            <img width="16" src={GithubLogo} />
            <span style={{ marginLeft: 10 }}>Github</span>
          </Button>
          <Button
            {...(isDesktop ? {} : { fullWidth: true })}
            href={`${api.API_URL}/authorize/bitbucket`}
            variant="contained"
            color="secondary"
            disabled={provider === 'bitbucket'}
          >
            <img width="16" src={BitbucketLogo} />
            <span style={{ marginLeft: 10 }}>Bitbucket</span>
          </Button>
        </div>
      </div>
    </>
  )
}

export default ProviderLoginButtons
