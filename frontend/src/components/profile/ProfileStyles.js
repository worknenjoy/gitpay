import {
  Card as BaseCard,
  CardMedia as BaseCardMedia
} from '@material-ui/core'

import styled from 'styled-components'
import media from 'app/styleguide/media'

export const Card = styled(BaseCard)`
  max-width: 280px;
  margin: 1rem .5rem;
  text-align: center;

  ${media.phone`
    max-width: 100%;
    margin: 1.5rem 0;
  `}
`

export const CardList = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  margin-top: 40px;
  justify-content: center;

  ${media.phone`
    display: block;
  `}
`

export const CardMedia = styled(BaseCardMedia)`
  width: 128px;
  height: 128px;
  margin-top: 20px;
  display: inline-block !important;
`
