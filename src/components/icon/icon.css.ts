import { style } from '@vanilla-extract/css';

// Define a basic icon style that is reusable across components
export const icon = style({
  height: '24px',
  width: '24px',
  contain: 'strict',
  pointerEvents: 'none',
  fill: 'currentColor',
  flexShrink: 0,
  display: 'inline-block', // Ensuring it behaves as an inline element if used in text/content
});
