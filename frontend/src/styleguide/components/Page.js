import styled from 'styled-components'
import media from 'app/styleguide/media'

export const PageContent = styled.div`
  padding: 2rem;

  ${media.phone`
    padding: 1rem;
  `}
`

export const Page = styled.div`
  outline: 1px solid red;
  overflow-x: hidden;
`
