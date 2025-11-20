import { Card as BaseCard, CardMedia as BaseCardMedia } from '@mui/material'

import styled from 'styled-components'
import media from '../../../../styleguide/media'

export const Card = styled(BaseCard)`
  max-width: 280px;
  margin: 1rem 0.5rem;
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
  flex-wrap: wrap;

  ${media.phone`
    display: block;
  `}
`

export const CardMedia = styled(BaseCardMedia)`
  width: 48px;
  height: 60px;
  margin-top: 20px;
  margin-bottom: -10px;
  display: inline-block !important;
`
