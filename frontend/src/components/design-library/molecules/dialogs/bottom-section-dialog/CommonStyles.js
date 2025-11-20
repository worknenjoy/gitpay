import styled, { css } from 'styled-components'

import media from '../../../../../styleguide/media'

export const MainTitle = styled.div`
  text-align: center;
  display: block;
  padding-bottom: 10px;
  border-bottom: 5px solid black;
  width: 60%;

  margin-top: 20px;
  margin-left: auto;
  margin-bottom: 20px;
  margin-right: auto;

  ${(props) =>
    props.left &&
    `
    margin-right: 18%;
  `}

  ${(props) =>
    props.center &&
    `
    margin-right: 5%;
    width: 70%;
  `}

  ${media.phone`
    width: 60%;
    margin: 20px auto;

    ${(props) => props.left && 'margin-left: auto;'}
  `}
`

export const MainList = styled.div`
  text-align: left;

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
  margin-left: 3%;

  ${media.phone`
    margin-left: 0;
  `}
`

export const MainBanner = styled.div`
  box-sizing: border-box;
  margin-bottom: 1rem;
  background-color: black;
  background-size: cover;
  ${media.phone`
    background: none;
    background-color: black;
  `}
`

export const Section = styled.div`
  text-align: center;
  padding: 1rem;

  ${(props) =>
    props.alternative &&
    css`
      background-color: #f1f0ea;
    `}
`

export const HeroTitle = styled.div``

export const HeroSection = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

export const HeroContent = styled.div`
  margin-top: 28px;
  margin-bottom: 20px;
`

export const HeroActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
`
