import styled, { css } from 'styled-components'
import {
  Button,
  Avatar,
} from '@material-ui/core'

import media from '../../styleguide/media'

export const Bar = styled.div`
  box-sizing: border-box;
  padding: 10px 20px;
  background-color: black;
  margin: 0;
  position: relative;

  ${media.phone`
    padding: 10px 15px;
  `}
`

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Side = styled.div`
  display: flex;
`
export const MenuMobile = styled(Button)`
    @media (min-width: 37.5em) {
      display: none;
      visibility: hidden;
  }
`

export const IconHamburger = styled.span`
  background-color: #009688;
  width: 25px;
  height: 3px;
  position: relative;

    transition-delay: 200ms;
    transform-origin: 50% 50%;

  ${({ isActive }) => isActive && css`
    background-color: transparent;
  `}

  &::after,
  &::before {
    content: '';
    background-color: #009688;
    width: 25px;
    height: 3px;
    position: absolute;
    left: 0;
    transition: all ease 400ms;
  }

  &::after{
    top: -6px;

    ${({ isActive }) => isActive && css`
      top: 0;
      background-color: #f2f2f2;
      transform: rotate(135deg)
    `}
  }

  &::before{
    bottom: -6px;

    ${({ isActive }) => isActive && css`
      bottom: 0;
      background-color: #f2f2f2;
      transform: rotate(-135deg)
    `}
  }
`

export const LeftSide = styled(Side)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1300;
  flex: 1;

  a {
    margin-bottom: 0 !important;
  }

  ${({ isActive }) => isActive && css`
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #000;
    padding: 10px 20px;
    box-sizing: border-box;
  `}

  @media (min-width: 37.5em) {
    align-items: flex-start;
    justify-content: flex-start;

  }
`

export const RightSide = styled(Side)`
  justify-content: flex-end;

@media (max-width: 37.5em) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    background-color: #000000dd;
    height: 100vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    transform: translateY(-100%);
    transition: all  ease-in-out 400ms;
    z-index: 1200;

  ${({ isActive }) => isActive && css`
      transform: translateY(0);
      overflow: hidden;
    `}

    ${({ isActive }) => {
    if (isActive) {
      document.body.style.overflowY = 'hidden'
    }
    else {
      document.body.style.overflowY = 'auto'
    }
  }}
  }
`

export const Logo = styled.img`
  width: 140px;

  ${media.phone`width: 100px !important;`}
`

export const StyledButton = styled(Button)`
  min-width: 20px !important;
  font-size: 12px;
  cursor: pointer;
  margin-left: 10px !important;

  @media (max-width: 37.5em) {
    margin-bottom: 20px !important;
  }
`

export const LogoButton = styled(StyledButton)`
  ${media.phone`
    padding: 0px !important;
  `}
`

export const StyledLanguageButton = styled(StyledButton)`
  ${media.phone`
    display: none !important;
  `}
`

export const StyledSlackButton = styled(StyledButton)`
  ${media.phone`
    display: none !important;
  `}
`

export const LabelButton = styled.span`

  ${props => props.right
    ? css`margin-left: 10px;`
    : css`margin-right: 10px;`}

  @media (min-width: 37.5em) {
    display: none;
    margin-right: 0;
  }

  @media (min-width: 64em) {
    display: block;
    margin-right: 10px;
  }
`

export const StyledAvatar = styled(Avatar)`
  margin-left: 20px;
  cursor: pointer;
  width: 24px !important;
  height: 24px !important;

  ${media.phone`margin-left: 15px;`}
`

export const StyledAvatarIconOnly = styled(Avatar)`
  margin-left: 20px;
  cursor: pointer;
  align-items: center;
  ${media.phone`margin-left: 15px;`}

  @media(max-width: 37.5em){
    margin-bottom: 20px !important;
  }
`

export const OnlyDesktop = styled.div`
  ${media.phone`display: none;`}
`
