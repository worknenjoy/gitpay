import styled from 'styled-components'
import media from '../../styleguide/media'

export const Container = styled.div`
  text-align: left;
  padding: 80px;
  padding-top: 40px;
  overflow: hidden;

  ${media.phone`
    text-align: center;
    padding: 25px 10px 5px 10px;

    a {
      text-align: center;
    }
  `}
`

export const BaseFooter = styled.div`
  padding-top: 20px;
`

export const SubscribeFromWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;

  ${media.phone`
    & input {
      display: block;
      margin: 0 auto 1rem auto;
      width: 90%;
      text-align: center;
    }
  `}
`
