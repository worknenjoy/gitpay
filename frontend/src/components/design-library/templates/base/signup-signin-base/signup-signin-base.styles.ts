import { styled, keyframes } from '@mui/material/styles';

const driftSlow = keyframes`
  0%   { transform: translateX(-20vw); }
  100% { transform: translateX(120vw); }
`;
const driftMed = keyframes`
  0%   { transform: translateX(-30vw); }
  100% { transform: translateX(130vw); }
`;
const driftFast = keyframes`
  0%   { transform: translateX(-40vw); }
  100% { transform: translateX(140vw); }
`;

export const GradientBackground = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '100vh',
  backgroundImage: [
    'radial-gradient(120% 120% at 30% 0%, #eaf3ff 0%, #edf5f2 30%, #e9f1ed 55%, #e3eee8 75%, #d9e7df 100%)',
    'radial-gradient(140% 140% at 90% -10%, rgba(176,209,238,0.25), rgba(176,209,238,0) 70%)'
  ].join(', '),
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundAttachment: 'fixed, fixed',
  backgroundSize: '160% 160%, 140% 140%',
  backgroundPosition: '35% 0%, 60% 20%',
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none'
  }
}));

export const CloudsLayer = styled('div')({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 2,
});

export const Cloud = styled('div')<
  { $duration?: string; $delay?: string; $blur?: number; $scale?: number; $y?: string; $variant?: 'slow' | 'med' | 'fast' }
>(({ $duration = '60s', $delay = '0s', $blur = 0, $scale = 1, $y = '0vh', $variant = 'slow' }) => {
  const animation = $variant === 'fast' ? driftFast : $variant === 'med' ? driftMed : driftSlow;
  return {
    position: 'absolute',
    top: $y,
    left: '-30vw',
    transform: `translateX(-30vw) scale(${$scale})`,
    filter: $blur ? `blur(${$blur}px)` : 'none',
    animation: `${animation} ${$duration} linear infinite`,
    animationDelay: $delay,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
      transform: `translateX(0) scale(${$scale})`
    }
  };
});
