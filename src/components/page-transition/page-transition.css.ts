import { style } from '@vanilla-extract/css'
import { createFromToKeyframes } from '~/styles/css-helpers' // Use path alias for styles
import {
  EASING_INCOMING_80,
  EASING_INCOMING_80_OUTGOING_40,
  EASING_OUTGOING_40,
  fadeInAni,
  fadeOutAni,
} from '~/styles/shared.css' // Correct path alias for shared.css

// Create keyframes for transition animations
const [enterForwardsAni, exitBackwardsAni] = createFromToKeyframes({
  transform: 'scale(.8, .8)', // Animate scaling in
})

const [enterBackwardsAni, exitForwardsAni] = createFromToKeyframes({
  transform: 'scale(1.1, 1.1)', // Animate scaling out
})

// Function to create the 'enter' transition style
const createEnterStyle = (aniName: string) =>
  style({
    pointerEvents: 'none',
    animation: `
      ${fadeInAni} 210ms 90ms backwards ${EASING_INCOMING_80},
      ${aniName} 300ms ${EASING_INCOMING_80_OUTGOING_40}
    `,
  })

// Function to create the 'exit' transition style
const createExitStyle = (aniName: string) =>
  style({
    pointerEvents: 'none',
    animation: `
      ${fadeOutAni} 90ms forwards ${EASING_OUTGOING_40},
      ${aniName} 300ms ${EASING_INCOMING_80_OUTGOING_40}
    `,
  })

// Exported constants for the animations
export const enterForwards = createEnterStyle(enterForwardsAni)
export const enterBackwards = createEnterStyle(enterBackwardsAni)

export const exitBackwards = createExitStyle(exitBackwardsAni)
export const exitForwards = createExitStyle(exitForwardsAni)
