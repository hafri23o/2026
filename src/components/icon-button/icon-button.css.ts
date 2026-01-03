import { style } from '@vanilla-extract/css'
// Using path alias `~` to import styles
import { sharedStyles, sprinkles } from '~/styles/styles.css' // Updated import path using alias

export const iconButton = style([
  sharedStyles.flatButtonBase, // Using shared styles for consistency
  sprinkles({
    overflow: 'hidden',
    flexShrink: 0,
  }),
  style({
    borderRadius: '50%',
    height: '44px',
    width: '44px',
    transition: 'border-radius .2s linear',
    color: 'inherit',
    selectors: {
      '&:active': {
        borderRadius: '12px', // Visual effect on active state
      },
    },
  }),
])
