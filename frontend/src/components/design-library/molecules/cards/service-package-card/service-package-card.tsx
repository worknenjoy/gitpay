import React from 'react'
import CheckIcon from '@mui/icons-material/Check'
import Button from 'design-library/atoms/buttons/button/button'
import { Root, Tier, Price, FeatureList, FeatureItem } from './service-package-card.styles'

type ServicePackageCardProps = {
  tier: React.ReactNode
  price: React.ReactNode
  priceSuffix?: React.ReactNode
  features: string[]
  featured?: boolean
  ctaLabel: React.ReactNode
  onSelect?: () => void
}

const ServicePackageCard = ({
  tier,
  price,
  priceSuffix,
  features,
  featured = false,
  ctaLabel,
  onSelect
}: ServicePackageCardProps) => (
  <Root $featured={featured} elevation={0}>
    <Tier variant="subtitle1">{tier}</Tier>
    <Price>
      {price}
      {priceSuffix && <small>{priceSuffix}</small>}
    </Price>
    <FeatureList>
      {features.map((feature, i) => (
        <FeatureItem key={i}>
          <CheckIcon fontSize="small" color={featured ? 'secondary' : 'action'} />
          <span>{feature}</span>
        </FeatureItem>
      ))}
    </FeatureList>
    <Button
      fullWidth
      variant={featured ? 'contained' : 'outlined'}
      color="secondary"
      onClick={onSelect}
    >
      {ctaLabel}
    </Button>
  </Root>
)

export default ServicePackageCard
