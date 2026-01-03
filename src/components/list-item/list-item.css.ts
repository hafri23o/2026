import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { sharedStyles, sprinkles, vars } from '~/styles/styles.css'; // Use alias ~

export const { textEclipse } = sharedStyles;

// Create a CSS variable for trailing size
export const trailingSizeVar = createVar();

// Define the 'selected' style
export const selected = style({
  backgroundColor: vars.colors.surfaceVariant,
  color: vars.colors.onSurfaceVariant,
});

// Define the list item style with grid layout and CSS variables
export const listItem = style([
  sharedStyles.listItem,
  sprinkles({
    color: 'onSurfaceVariant',
    typography: 'bodyMedium',
    radius: '12px',
    gap: '8px',
  }),
  style({
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: `auto 1.5fr ${fallbackVar(
      trailingSizeVar,
      '1fr',
    )} 44px`,
    gridTemplateAreas: `
      'icon content trailing menu'
    `,
  }),
]);

// Icon style with grid positioning
export const icon = style({
  display: 'flex',
  marginRight: '8px',
  gridArea: 'icon',
});

// Text container style for content area
export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gridArea: 'content',
  overflow: 'hidden',
});

// Main text style with typography and color
export const mainText = style([
  textEclipse,
  sprinkles({
    typography: 'bodyLarge',
    color: 'onSurface',
  }),
  style({
    selectors: {
      [`${selected} &`]: {
        color: vars.colors.primary, // Change color when selected
      },
    },
  }),
]);

// Trailing content style (e.g., buttons, icons)
export const trailing = style({
  gridArea: 'trailing',
  display: 'flex',
  overflow: 'hidden',
  justifyContent: 'space-between',
  gap: '8px',
});

// Menu style for the menu area
export const menu = style({
  gridArea: 'menu',
});
