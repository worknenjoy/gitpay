import { styled } from '@mui/material/styles'
import { Button, Avatar } from '@mui/material'

import media from '../../../../../../styleguide/media'

export const Bar = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  padding: '10px 20px',
  backgroundColor: 'black',
  margin: 0,
  position: 'relative',
  ...media.phone({
    padding: '10px 15px'
  })
}))

export const Container = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export const Side = styled('div')({
  display: 'flex'
})

export const MenuMobile = styled(Button)({
  margin: '10px 0',
  '@media (min-width: 37.5em)': {
    display: 'none',
    visibility: 'hidden'
  }
})

export const IconHamburger = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isActive'
})<{ isActive?: boolean }>(({ isActive }) => ({
  backgroundColor: '#009688',
  width: '25px',
  height: '3px',
  position: 'relative',
  top: '5px',
  transitionDelay: '200ms',
  transformOrigin: '50% 50%',
  cursor: 'pointer',
  ...(isActive && {
    backgroundColor: 'transparent'
  }),
  '&::after, &::before': {
    content: '""',
    backgroundColor: '#009688',
    width: '25px',
    height: '3px',
    position: 'absolute',
    left: 0,
    transition: 'all ease 400ms'
  },
  '&::after': {
    top: '-6px',
    ...(isActive && {
      top: 0,
      backgroundColor: '#f2f2f2',
      transform: 'rotate(135deg)'
    })
  },
  '&::before': {
    bottom: '-6px',
    ...(isActive && {
      bottom: 0,
      backgroundColor: '#f2f2f2',
      transform: 'rotate(-135deg)'
    })
  }
}))

export const LeftSide = styled(Side, {
  shouldForwardProp: (prop) => prop !== 'isActive'
})<{ isActive?: boolean }>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  zIndex: 1300,
  flex: 1,
  '& a': {
    marginBottom: '0 !important'
  },
  ...(isActive && {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#000',
    padding: '10px 20px',
    boxSizing: 'border-box'
  }),
  '@media (min-width: 37.5em)': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  }
}))

export const RightSide = styled(Side, {
  shouldForwardProp: (prop) => prop !== 'isActive'
})<{ isActive?: boolean }>(({ isActive }) => ({
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  '@media (max-width: 37.5em)': {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    right: 0,
    backgroundColor: '#000000dd',
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translateY(-100%)',
    transition: 'all ease-in-out 400ms',
    zIndex: 1200,
    ...(isActive && {
      transform: 'translateY(0)',
      overflow: 'hidden'
    })
  }
}))

export const Logo = styled('img')(({ theme }) => ({
  width: '96px',
  ...media.phone({
    width: '100px !important'
  })
}))

export const StyledButton = styled(Button)({
  minWidth: '20px !important',
  fontSize: '12px',
  cursor: 'pointer',
  marginLeft: '10px !important'
})

export const LogoButton = styled(StyledButton)(({ theme }) => ({
  ...media.phone({
    padding: '0px !important'
  })
}))

export const LinkButtonsListStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row'
  }
}))

export const LinkButton = styled(StyledButton)(({ theme }) => ({
  color: '#fff !important',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '28px',
    fontSize: '21px'
  }
}))

export const StyledLanguageButton = styled(StyledButton)(({ theme }) => ({
  ...media.phone({
    display: 'none !important'
  })
}))

export const StyledSlackButton = styled(StyledButton)(({ theme }) => ({
  ...media.phone({
    display: 'none !important'
  })
}))

export const LabelButton = styled('span', {
  shouldForwardProp: (prop) => prop !== 'right'
})<{ right?: boolean }>(({ right }) => ({
  ...(right
    ? {
        marginLeft: '10px'
      }
    : {
        marginRight: '10px'
      }),
  '@media (min-width: 37.5em)': {
    display: 'none',
    marginRight: 0
  },
  '@media (min-width: 64em)': {
    display: 'block',
    marginRight: '10px'
  }
}))

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginLeft: '20px',
  cursor: 'pointer',
  ...media.phone({
    marginLeft: '15px'
  })
}))

export const StyledAvatarIconOnly = styled(Avatar)(({ theme }) => ({
  marginLeft: '20px',
  cursor: 'pointer',
  alignItems: 'center',
  ...media.phone({
    marginLeft: '15px'
  }),
  '@media(max-width: 37.5em)': {
    marginBottom: '20px !important'
  }
}))

export const OnlyDesktop = styled('div')({
  '@media (max-width: 37.5em)': {
    display: 'none'
  }
})

export const OnlyMobile = styled('div')({
  display: 'none',
  justifyContent: 'space-around',
  flexDirection: 'column',
  '@media (max-width: 37.5em)': {
    display: 'flex'
  }
})
