import styled, { css } from 'styled-components'
import fallbackBackgroundPicture from 'app/images/Fallback.png'

import media from 'app/styleguide/media'

export const MainTitle = styled.div`
  text-align: center;
  display: block;
  padding-bottom: 10px;
  border-bottom: 5px solid black;
  width: 30%;

  margin-top: 20px;
  margin-left: auto;
  margin-bottom: 20px;
  margin-right: auto;

  ${props => props.left && `
    margin-right: 18%;
  `}

  ${media.phone`
    width: 60%;
    margin: 20px auto;

    ${props => props.left && 'margin-left: auto;'}
  `}
`

export const MainList = styled.div`
  text-align: left;
  margin-left: 20%;

  ${media.phone`
    margin-left: 0;
  `}
`

export const ResponsiveImage = styled.img`
  ${media.phone`
    width: 100%;
  `}
`

export const ShadowImage = styled.img`
    box-shadow: 1px 1px 3px 2px #ccc;

    ${media.phone`
      max-width: 100%;
    `}
`

export const InfoList = styled.div`
  text-align: left;
  margin-left: 10%;

  ${media.phone`
    margin-left: 0;
  `}
`

export const MainBanner = styled.div`
  box-sizing: border-box;
  padding: 3rem 1rem 4rem 1rem;
  background: url(${fallbackBackgroundPicture}), url('https://source.unsplash.com/1433x680/?developers');
  background-size: cover;
`

export const Section = styled.div`
  text-align: center;
  padding: 1rem;

  ${props => props.alternative && css`
    background-color: #f1f0ea;
  `}
`
