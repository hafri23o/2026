import { style } from '@vanilla-extract/css'; // Vanilla Extract's CSS-in-TypeScript API
import { sprinkles } from '~/styles/styles.css'; // Assuming you have a sprinkles utility for styling
import { vars } from '~/styles/vars.css'; // Assuming you have global CSS variables

export const container = style([
  sprinkles({
    paddingY: '16px',
  }),
  style({
    marginTop: '8px',
    borderTop: `1px solid ${vars.colors.outlineVariant}`,
  }),
]);

export const title = sprinkles({
  typography: 'headlineSmall', // Example typography style from your sprinkles
  color: 'secondary', // Color from your sprinkles (ensure 'secondary' is defined in your vars.css)
});

export const text = style([
  sprinkles({
    typography: 'bodyLarge', // Example typography style from your sprinkles
    color: 'onSurfaceVariant', // Color from your sprinkles (ensure 'onSurfaceVariant' is defined in your vars.css)
  }),
  style({
    whiteSpace: 'pre-wrap', // This allows for proper text formatting (e.g., preserving newlines)
  }),
]);
