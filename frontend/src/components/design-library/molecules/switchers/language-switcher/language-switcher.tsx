import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Avatar, Box, Button, CircularProgress, Menu, MenuItem, Tooltip } from '@mui/material'
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

type LanguageSwitcherProps = {
  completed?: boolean
  onSwitchLang: (lang: 'en' | 'br') => void
  userCurrentLanguage: 'en' | 'br'
  user?: any
  variant?: 'text' | 'outlined' | 'contained'
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  showTooltip?: boolean
  buttonId?: string
  menuId?: string
}

const LanguageSwitcher = ({
  completed = true,
  onSwitchLang,
  userCurrentLanguage,
  user,
  variant = 'text',
  size = 'medium',
  showLabel = false,
  showTooltip = true,
  buttonId = 'language-menu',
  menuId = 'menu-appbar'
}: LanguageSwitcherProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (lang: 'en' | 'br') => {
    onSwitchLang(lang)
    handleClose()
  }

  const currentLabel = userCurrentLanguage === 'en' ? 'English' : 'Português'

  return (
    <>
      <FormattedMessage id="task.actions.tooltip.language" defaultMessage="Choose your language">
        {(msg) => {
          const buttonContent = completed ? (
            showLabel ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  alt={currentLabel}
                  src={logoLang(userCurrentLanguage)}
                  sx={{ width: 20, height: 20, mr: 1 }}
                />
                <strong>{currentLabel}</strong>
              </Box>
            ) : (
              <StyledAvatarIconOnly
                alt={user?.username || ''}
                src={logoLang(userCurrentLanguage)}
              />
            )
          ) : (
            <Avatar>
              <CircularProgress size={18} />
            </Avatar>
          )

          const button = (
            <Button
              id={buttonId}
              onClick={handleMenu}
              variant={variant}
              size={size}
              color="primary"
              sx={showLabel ? undefined : { padding: 0, minWidth: 0 }}
            >
              {buttonContent}
            </Button>
          )

          return showTooltip ? (
            <Tooltip id="tooltip-lang" title={msg} placement="bottom">
              {button}
            </Tooltip>
          ) : (
            button
          )
        }}
      </FormattedMessage>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem selected={userCurrentLanguage === 'en'} onClick={() => handleSelect('en')}>
          <StyledAvatarIconOnly alt="English" src={logoLangEn} />
          <strong style={{ display: 'inline-block', margin: 10 }}>English</strong>
        </MenuItem>
        <MenuItem selected={userCurrentLanguage === 'br'} onClick={() => handleSelect('br')}>
          <StyledAvatarIconOnly alt="Português" src={logoLangBr} />
          <strong style={{ display: 'inline-block', margin: 10 }}>Português</strong>
        </MenuItem>
      </Menu>
    </>
  )
}

export default LanguageSwitcher
