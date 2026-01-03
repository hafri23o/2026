import { style } from '@vanilla-extract/css'
import { sprinkles } from '../../styles/styles.css' // Ensure the path is correct

// The section style uses the `sprinkles` utility from Vanilla Extract for utility-based styling
export const section = style([
  sprinkles({
    typography: 'bodyLarge',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    tonalElevation: 1,
  }),
  style({
    borderRadius: '12px',
    width: '100%',
    maxWidth: '460px',
    margin: '48px auto',
    textAlign: 'center',
    padding: `48px 16px`,
  }),
])

// Logo styling
export const logo = style({
  height: '96px',
  width: '96px',
})

// Title styling using `sprinkles` utility for consistent theme and typography
export const title = sprinkles({
  typography: 'headlineMedium',
  color: 'onSurface',
})
