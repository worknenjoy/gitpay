import React, { useEffect, useState } from 'react'
import { getCountryFlagSrc, countryFlagPlaceholderSrc } from './country-flag'

type CountryFlagImageProps = {
  image?: string | null
  alt?: string
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}

/**
 * Country flag <img> with placeholder when the asset is missing or fails to load.
 */
const CountryFlagImage: React.FC<CountryFlagImageProps> = ({
  image,
  alt = '',
  width = 48,
  height,
  className,
  style
}) => {
  const [src, setSrc] = useState(() => getCountryFlagSrc(image))

  useEffect(() => {
    setSrc(getCountryFlagSrc(image))
  }, [image])

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => {
        if (src !== countryFlagPlaceholderSrc && countryFlagPlaceholderSrc) {
          setSrc(countryFlagPlaceholderSrc)
        }
      }}
    />
  )
}

export default CountryFlagImage
