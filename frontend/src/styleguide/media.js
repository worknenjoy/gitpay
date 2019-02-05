import { css } from 'styled-components'

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 414
}

/**
 * Helper methods to construct media queries. Iterate through the sizes and
 * create a media template. it's using firt desktop strategy (max-width).
 *
 * Usage:
 *
 * const MyComp = styled.div`
 *   width: 100px;
 *   ${media.phone`width: 200px;`}
 * `
 *
 * @see: https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md#media-templates
 * @see: https://www.styled-components.com/docs/advanced#media-templates
 */
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `

  return acc
}, {})

export default media
