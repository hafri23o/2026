import { style } from '@vanilla-extract/css'
import { sharedStyles, sprinkles } from '~/styles/styles.css'

// Extracting the outlinedButton from sharedStyles for reusability
export const { outlinedButton } = sharedStyles

// Define the title style using sprinkles
export const title = sprinkles({
  typography: 'headlineSmall',
  color: 'onSurface',
})

// Define the message banner styles, combining sprinkles and custom styles
export const messageBanner = style([
  sprinkles({
    typography: 'titleMedium',
    display: 'flex',
    flexDirection: 'column',
    color: 'onSurfaceVariant',
    rowGap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  style({
    textAlign: 'center', // Center-align the text
    margin: 'auto', // Auto margin for centering the element
  }),
])
