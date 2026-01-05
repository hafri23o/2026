import { style, keyframes } from '@vanilla-extract/css'

// Spinner from https://codepen.io/mrrocks/pen/EiplA

// Spinner animation duration and stroke offset
const DURATION = '1.4s'
const OFFSET = 187

// Keyframe for rotating the spinner
const rotateAni = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(270deg)' },
})

// The spinner style
export const spinner = style({
  willChange: 'transform',
  width: '40px',
  height: '40px',
  animation: `${rotateAni} ${DURATION} linear infinite`,
  color: 'currentcolor', // Ensuring that the color is dynamic with `currentcolor`
})

// Keyframe for animating the stroke dash offset
const dashAni = keyframes({
  '0%': { strokeDashoffset: OFFSET },
  '50%': { strokeDashoffset: OFFSET / 4, transform: 'rotate(135deg)' },
  '100%': { strokeDashoffset: OFFSET, transform: 'rotate(450deg)' },
})

// Path animation style
export const path = style({
  fill: 'none',
  strokeWidth: '6px',
  strokeLinecap: 'round',
  strokeDasharray: OFFSET, // Defines the dash pattern for the stroke
  strokeDashoffset: 0, // Initial dash offset
  transformOrigin: 'center', // Makes the rotation happen around the center of the element
  stroke: 'currentcolor', // Ensures stroke color follows the `currentcolor`
  animation: `${dashAni} ${DURATION} ease-in-out infinite`, // Animation for stroke dash and rotation
})
