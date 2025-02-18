import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { updateIntl } from 'react-intl-redux'
import { store } from '../../../../main/app'
import { useHistory } from 'react-router-dom'

import {
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
  Button
} from '@material-ui/core'
import {
  LibraryBooks,
  Tune,
  Home,
  Web,
  Person,
  ExitToApp,
  Settings,
  Business,
  AccountBox as AccountIcon,
  AccountBalance,
  Payment as PaymentIcon
} from '@material-ui/icons'

import nameInitials from 'name-initials'

import {
  Bar,
  Container,
  LeftSide,
  RightSide,
  Logo,
  StyledButton,
  LinkButton,
  LabelButton,
  StyledAvatar,
  StyledAvatarIconOnly,
  OnlyDesktop,
  OnlyMobile,
  MenuMobile,
  IconHamburger
} from './TopbarStyles'

import LoginButton from '../../../areas/profile/components/session/login-button'
import ImportIssueButton from './import-issue'

import logo from 'images/gitpay-logo.png'

import logoLangEn from 'images/united-states-of-america.png'
import logoLangBr from 'images/brazil.png'
import ImportIssueDialog from './import-issue-dialog'
import TopbarMenu from './topbar-menu'

const languagesIcons = {
  en: logoLangEn,
  br: logoLangBr
}

const messages = {
  'br': process.env.NODE_ENV === 'production' ? messagesBr : messagesBrLocal,
  'en': process.env.NODE_ENV === 'production' ? messagesEn : messagesEnLocal
}

const browserLanguage = () => {
  const browserLang = navigator.language.split(/[-_]/)[0]
  if (browserLang === 'pt') {
    return 'br'
  }
  return browserLang
}

const localStorageLang = () => {
  return localStorage.getItem('userLanguage')
}

const logoLang = (lang) => {
  return languagesIcons[lang]
}

import messagesBr from '../../../../translations/result/br.json'
import messagesEn from '../../../../translations/result/en.json'

import messagesBrLocal from '../../../../translations/generated/br.json'
import messagesEnLocal from '../../../../translations/generated/en.json'

const currentUserLanguage = (preferences) => {
  const prefLang = preferences.language
  if (prefLang) {
    localStorage.setItem('userLanguage', prefLang)
  }
  return preferences.language || localStorageLang() || browserLanguage()
}

const Topbar = ({
  
   
}) => {
  const [isActive, setIsActive] = useState(false)

  const handleClickMenuMobile = () => {
    setIsActive(!isActive)
  }

  return (
    <Bar>
      <Container>
        <LeftSide isActive={ isActive }>
         <div>
            <StyledButton href='/'>
              <Logo src={ logo } />
            </StyledButton>
          </div>
          <OnlyDesktop style={ { marginTop: 12, marginLeft: 20 } }>
            <TopbarMenu />
          </OnlyDesktop>
           <MenuMobile
              onClick={ handleClickMenuMobile }
              variant='text'
              size='small'
            >
              <IconHamburger isActive={ isActive } />
            </MenuMobile>
        </LeftSide>
        <RightSide>
          <OnlyMobile>
            <MenuMobile>
              <TopbarMenu />
            </MenuMobile>
          </OnlyMobile>
        </RightSide>
      </Container>
    </Bar>
  )
};

export default Topbar;