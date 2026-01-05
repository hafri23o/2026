import { style } from '@vanilla-extract/css'
import { sprinkles } from '~/styles/styles.css'  // Use the alias defined in tsconfig.json

// Container style for the main scaffold layout
export const container = style([
  sprinkles({
    surface: 'surface',
    overflow: 'hidden',
  }),
  style({
    contain: 'strict',  // Ensures that no layout or paint is affected by outside elements
    gridArea: '1 / 1',  // Full coverage of the grid
    height: '100%',
    width: '100%',
    transformOrigin: 'center center',  // Transformation will occur from the center
    display: 'grid',  // Use grid layout for the scaffold
    gridTemplateColumns: 'auto 1fr',  // 2 columns: one for the nav and one for content
    gridTemplateRows: 'auto 1fr auto',  // 3 rows: top, content, bottom
    gridTemplateAreas: `
      'top-bar top-bar'
      'nav-rail content'
      'bottom-bar bottom-bar'
    `,
  }),
])

// Style for the top bar section
export const topBar = style({
  gridArea: 'top-bar',
  display: 'flex',
  flexDirection: 'column',  // Ensure vertical alignment
})

// Style for the navigation rail section
export const navRail = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',  // Center align the content
  gridArea: 'nav-rail',
})

// Style for the bottom bar section
export const bottomBar = style({
  gridArea: 'bottom-bar',
})

// Style for the content section
export const content = style({
  gridArea: 'content',
  height: '100%',
  overflow: 'hidden',  // Prevent any content from overflowing
  display: 'flex',
})
