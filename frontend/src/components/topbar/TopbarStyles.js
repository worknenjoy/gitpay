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

export const LeftSide = styled(Side)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`

export const RightSide = styled(Side)`
  justify-content: flex-end;
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
    ? css`margin-left: 10px`
    : css`margin-right: 10px`}

  ${media.phone`
    margin-right: 0;
    display: none;
  `}
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
  alignItems: center;
  ${media.phone`margin-left: 15px;`}
`

export const OnlyDesktop = styled.div`
  ${media.phone`display: none;`}
`
