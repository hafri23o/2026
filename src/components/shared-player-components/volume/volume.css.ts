import { style } from '@vanilla-extract/css'
import { sliderProgressColorVar } from '~/components/slider/slider.css'
import { sprinkles } from '~/styles/sprinkles.css'

// Animating style (placeholder if needed later)
export const animating = style({})

// Volume state styles
export const volumeOff = style({})
export const volumeLow = style({})

// Volume icon styling, adjusting size and pointer events
export const volumeIcon = style({
  fill: 'currentcolor',
  pointerEvents: 'none',
  height: '24px',
  width: '24px',
  flexShrink: 0,
})

// Volume icon at 45 degrees (for mute/volume state)
export const volume45 = style({
  transform: 'rotate(-45deg)',
  transformOrigin: 'center center',
})

// Cross-line effect on the volume icon
export const volumeCrossLine = style({
  transform: 'scaleY(0)',
  transformOrigin: 'top',
  transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  selectors: {
    [`${volumeOff} &`]: {
      transform: 'none',
    },
  },
})

// High volume wave animation
export const volumeWaveHigh = style({
  transformOrigin: 'center',
  transition: 'transform 100ms',
  transform: 'scale(1)',
  selectors: {
    [`${volumeLow} &`]: {
      transform: 'scale(0)',
    },
  },
})

// Slider styling, leveraging sliderProgressColorVar for dynamic color
export const volumeSlider = style({
  vars: {
    [sliderProgressColorVar]: 'currentColor',
  },
  maxWidth: '124px',
  marginLeft: 'auto!important',
})

// Overall volume control styling using sprinkles for responsive design
export const volumeControl = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  }),
  style({
    gridArea: 'volume',
  }),
])
