import styled from 'styled-components'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'

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
  width: 32%;
`

export const LeftSide = styled(Side)``

export const RightSide = styled(Side)`
  justify-content: flex-end;
`

export const Logo = styled.img`
  width: 140px;

  ${media.phone`width: 100px;`}
`

export const StyledButton = styled(Button)`
  min-width: 40px !important;
  font-size: 12px;
  cursor: pointer;

  ${props => props.paddingLeft && `
    margin-left: 10px !important;
  `}
`

export const LabelButton = styled.span`
  margin-right: 10px;

  ${media.phone`
    margin-right: 0;
    display: none;
  `}
`

export const StyledAvatar = styled(Avatar)`
  margin-left: 20px;
  cursor: pointer;

  ${media.phone`margin-left: 15px;`}
`

export const HiddenMobile = styled.div`
  ${media.phone`display: none;`}
`
