import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Tooltip, Avatar, CircularProgress, Menu, MenuItem, Button } from '@mui/material'
import logoLangEn from 'images/united-states-of-america.png'
import logoLangBr from 'images/brazil.png'
import { StyledAvatarIconOnly } from './language-switcher.styles'

const languagesIcons = {
  en: logoLangEn,
  br: logoLangBr
}

const logoLang = (lang) => {
  return languagesIcons[lang]
}

const LanguageSwitcher = ({ completed, onSwitchLang, userCurrentLanguage, user }) => {
  const [open, setOpen] = React.useState(false)

  const handleMenu = (event) => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <FormattedMessage id="task.actions.tooltip.language" defaultMessage="Choose your language">
        {(msg) => (
          <Tooltip id="tooltip-lang" title={msg} placement="bottom">
            <Button style={{ padding: 0 }} id="language-menu" onClick={handleMenu}>
              {completed ? (
                <StyledAvatarIconOnly
                  alt={user.username || ''}
                  src={logoLang(userCurrentLanguage)}
                />
              ) : (
                <Avatar>
                  <CircularProgress />
                </Avatar>
              )}
            </Button>
          </Tooltip>
        )}
      </FormattedMessage>
      <Menu
        id="menu-appbar"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem selected={userCurrentLanguage === 'en'} onClick={(e) => onSwitchLang('en')}>
          <StyledAvatarIconOnly alt="English" src={logoLangEn} />
          <strong style={{ display: 'inline-block', margin: 10 }}>English</strong>
        </MenuItem>
        <MenuItem selected={userCurrentLanguage === 'br'} onClick={(e) => onSwitchLang('br')}>
          <StyledAvatarIconOnly alt="Português" src={logoLangBr} />
          <strong style={{ display: 'inline-block', margin: 10 }}>Português</strong>
        </MenuItem>
      </Menu>
    </>
  )
}

export default LanguageSwitcher
