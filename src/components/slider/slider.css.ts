import { style, createVar, fallbackVar } from '@vanilla-extract/css'
import { getVarName } from '../../styles/css-helpers'
import { vars } from '../../styles/styles.css'

// Create the CSS variables for dynamic slider values and colors
export const sliderValueVar = createVar()
export const sliderValueVarName = getVarName(sliderValueVar)

const appearance = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
} as const

// Define CSS variables for slider colors
export const sliderTrackColorVar = createVar()
export const sliderProgressColorVar = createVar()

// Styling for the slider thumb (the draggable part of the slider)
const sliderThumb = {
  ...appearance,
  background: 'currentcolor',
  border: 'none',
  borderRadius: '50%',
  width: '16px',
  height: '16px',
  boxShadow: 'none',
}

// Disabled state for the slider (to hide the thumb when disabled)
const disabled = {
  display: 'none',
  // Firefox-specific handling
  width: 0,
  height: 0,
}

// Main slider track style
export const slider = style({
  ...appearance,
  cursor: 'pointer',
  width: '100%',
  border: 'none',
  height: '4px',
  outline: 'none',
  margin: 0,
  borderRadius: '4px',
  background: fallbackVar(sliderTrackColorVar, vars.colors.outline),
  color: fallbackVar(sliderProgressColorVar, vars.colors.primary),
  selectors: {
    // Styling for the slider progress in Firefox
    '&::-moz-range-progress': {
      ...appearance,
      background: 'currentColor',
    },
    // Styling for the slider in Webkit browsers (Chrome, Safari, etc.)
    '&::-webkit-slider-container': {
      ...appearance,
      borderRadius: 'inherit',
      background: `linear-gradient(
        to right,
        currentColor ${sliderValueVar},
        transparent 0%
      )`,
    },
    // Styling for the slider thumb (the draggable part)
    '&::-webkit-slider-thumb': sliderThumb,
    '&::-moz-range-thumb': sliderThumb,
    // Disabled state for the slider thumb in Webkit browsers
    '&:disabled::-webkit-slider-thumb': disabled,
    '&:disabled::-moz-range-thumb': disabled,
    // Focus state for the slider (to improve accessibility)
    '&:focus-visible': {
      outline: '2px solid currentColor',
      outlineOffset: '6px',
    },
  },
})
