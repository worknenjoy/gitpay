import styled from 'styled-components'

import media from 'app/styleguide/media'
import backgroundPicture from 'app/images/main-background01.jpg'

export const MainTitle = styled.div`
  text-align: center;
  display: block;
  font-size: 18px;
  padding-bottom: 10px;
  border-bottom: 5px solid black;
  width: 30%;

  margin-top: 40px;
  margin-left: auto;
  margin-bottom: 40px;
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
  background: url(${backgroundPicture});
  background-size: cover;
`
