import { style } from '@vanilla-extract/css';
import { sharedStyles, sprinkles, vars } from '~/styles/styles.css'; // Using the correct path alias

// Styles for the overlay that will cover the screen, typically used for modals or menus.
export const overlay = style({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 5, // Ensure overlay is above other content
});

// Menu container styles, with integration for shared styles and sprinkles (from Vanilla Extract).
export const menu = style([
  sprinkles({
    padding: '4px', // Customizable padding from the sprinkles
    display: 'flex', // Flexbox for layout
    flexDirection: 'column', // Stack menu items vertically
    tonalElevation: 4, // Shadow or elevation from sprinkles
    surface: 'surface', // Background surface style from sprinkles
  }),
  style({
    borderRadius: '12px', // Rounded corners for the menu
    padding: '12px 0', // Vertical padding for the menu
    width: '200px', // Fixed width for the menu
    position: 'fixed', // Menu should be positioned relative to the viewport
    willChange: 'transform, opacity', // Optimizing performance for transform and opacity changes
    zIndex: 5, // Ensure menu is above other UI elements
    boxShadow: `
      0px 1px 3px 0px #0000004D, 
      0px 4px 8px 3px #00000026
    `, // Soft shadow effect around the menu
  }),
]);

// Reusing shared styles for list items, assumed from another file
export const menuItem = sharedStyles.listItem;

// Styling for selected menu items, using the primary color from the theme variables
export const selected = style({
  color: vars.colors.primary, // Apply the primary color from your vars
});
