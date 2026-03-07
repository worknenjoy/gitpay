import React from 'react'
import {
  CallToActionHeroStyled,
  DotLottieReactStyled,
  BottomCTASection,
  BottomCopy,
  GutterTopButton
} from './call-to-action-hero.styles'

type CallToActionHeroProps = {
  title: React.ReactNode
  actions: {
    label: React.ReactNode
    link: string
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning'
    size?: 'small' | 'medium' | 'large'
  }[]
  withContrast?: boolean
}

const CallToActionHero = ({ title, actions, withContrast = true }: CallToActionHeroProps) => {
  return (
    <CallToActionHeroStyled $withContrast={withContrast}>
      <DotLottieReactStyled src={'/lottie/developer-team.lottie'} loop autoplay />
      <BottomCTASection>
        <BottomCopy variant="h6" gutterBottom>
          {title}
        </BottomCopy>
        {actions.map((action, index) => (
          <GutterTopButton
            key={index}
            component="a"
            href={action.link}
            size={action.size || 'large'}
            variant={action.variant || 'contained'}
            color={action.color || 'primary'}
          >
            {action.label}
          </GutterTopButton>
        ))}
      </BottomCTASection>
    </CallToActionHeroStyled>
  )
}

export default CallToActionHero
