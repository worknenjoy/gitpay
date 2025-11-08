import React from 'react';
import { GradientBackground, CloudsLayer, Cloud } from './signup-signin-base.styles';

const CloudSvg = ({ colorA = '#eaf3ff', colorB = '#cfe2fb', colorC = '#a8c9ee', opacity = 1, style = {} }) => (
  <svg
    width="260" height="140" viewBox="0 0 260 140" style={{ opacity, ...style }}
    xmlns="http://www.w3.org/2000/svg" aria-hidden
  >
    <defs>
      <linearGradient id="cL" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={colorA}/>
        <stop offset="100%" stopColor={colorB}/>
      </linearGradient>
      <linearGradient id="cM" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={colorB}/>
        <stop offset="100%" stopColor={colorC}/>
      </linearGradient>
    </defs>
    <g filter="url(#shadow)">
      <ellipse cx="95" cy="70" rx="90" ry="55" fill="url(#cL)"/>
      <ellipse cx="150" cy="60" rx="70" ry="45" fill="url(#cM)"/>
      <ellipse cx="55" cy="80" rx="55" ry="35" fill="url(#cL)"/>
    </g>
  </svg>
);

export default function SignupSigninBase({ children }) {
  return (
    <GradientBackground>
      <CloudsLayer>
        <Cloud $variant="slow" $duration="95s" $delay="-15s" $blur={2} $scale={1.3} $y="8vh">
          <CloudSvg opacity={0.55}/>
        </Cloud>
        <Cloud $variant="slow" $duration="110s" $delay="-40s" $blur={3} $scale={1.6} $y="18vh">
          <CloudSvg opacity={0.45}/>
        </Cloud>
        <Cloud $variant="med" $duration="70s" $delay="-10s" $blur={1} $scale={1.1} $y="12vh">
          <CloudSvg opacity={0.7}/>
        </Cloud>
        <Cloud $variant="med" $duration="65s" $delay="-25s" $blur={1} $scale={1.2} $y="24vh">
          <CloudSvg opacity={0.7}/>
        </Cloud>
        <Cloud $variant="fast" $duration="45s" $delay="-5s" $scale={0.9} $y="16vh">
          <CloudSvg opacity={0.8}/>
        </Cloud>
        <Cloud $variant="fast" $duration="40s" $delay="-30s" $scale={0.8} $y="28vh">
          <CloudSvg opacity={0.85}/>
        </Cloud>
      </CloudsLayer>
      <div style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>
    </GradientBackground>
  );
}
