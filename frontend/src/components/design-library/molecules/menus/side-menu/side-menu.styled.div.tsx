import { styled } from '@mui/material/styles'
import { Button, Avatar } from '@mui/material'

export const Bar = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  padding: '10px 20px',
  backgroundColor: 'black',
  margin: 0,
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: '10px 15px'
  }
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
  margin: '10px 0'
})

export const IconHamburger = styled('span')<{ isActive: boolean }>(({ isActive }) => ({
  backgroundColor: '#009688',
  width: '25px',
  height: '3px',
  position: 'relative',
  transitionDelay: '200ms',
  transformOrigin: '50% 50%',
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
  },
  '&:hover': {
    cursor: 'pointer'
  }
}))

export const LeftSide = styled(Side)<{ isActive: boolean }>(({ isActive }) => ({
  display: 'block',
  padding: 0,
  width: '100%',
  '& a': {
    marginBottom: '0 !important'
  },
  ...(isActive && {
    zIndex: 1300,
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#2c5c46',
    padding: '10px 20px',
    boxSizing: 'border-box'
  }),
  '@media (max-width: 37.5em)': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  }
}))

export const RightSide = styled(Side)<{ isActive: boolean }>(({ isActive }) => ({
  '@media (max-width: 37.5em)': {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    right: 0,
    backgroundColor: '#2c5c46',
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

export const Logo = styled('img')<{ compact?: boolean }>(({ compact, theme }) => ({
  paddingTop: '16px',
  ...(!compact && {
    width: '96px'
  }),
  [theme.breakpoints.down('sm')]: {
    width: '100px !important',
    paddingTop: '0px'
  }
}))

export const StyledButton = styled(Button)({
  fontSize: '12px',
  cursor: 'pointer'
})

export const LogoButton = styled(StyledButton)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: '0px !important'
  }
}))

export const LinkButton = styled(StyledButton)({
  color: '#fff !important'
})

export const StyledLanguageButton = styled(StyledButton)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none !important'
  }
}))

export const StyledSlackButton = styled(StyledButton)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none !important'
  }
}))

export const LabelButton = styled('span')<{ right?: boolean }>(({ right }) => ({
  ...(right ? { marginLeft: '10px' } : { marginRight: '10px' }),
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
  [theme.breakpoints.down('sm')]: {
    marginLeft: '15px'
  }
}))

export const StyledAvatarIconOnly = styled(Avatar)(({ theme }) => ({
  marginLeft: '20px',
  cursor: 'pointer',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginLeft: '15px'
  },
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
