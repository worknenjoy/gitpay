import BaseCard, { CardMedia as BaseCardMedia } from 'material-ui/Card'
import styled from 'styled-components'
import media from 'app/styleguide/media'

export const Card = styled(BaseCard)`
  max-width: 280px;
  margin: 1rem 5px;
  text-align: center;

  ${media.phone`
    max-width: 100%;
  `}
`

export const CardList = styled.div`
  box-sizing: border-box;
  margin-top: 40px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.phone`
    display: block;
  `}
`

export const CardMedia = styled(BaseCardMedia)`
  width: 128px;
  height: 128px;
  margin-top: 20px;
  display: inline-block;

  ${media.phone`
  `}
`
