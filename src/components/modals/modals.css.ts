import { style } from '@vanilla-extract/css';  // Correct import from vanilla-extract/css

// Styles for the modal container
export const modalsContainer = style({
  display: 'grid',
  gridTemplateAreas: '"modal"', // Define grid areas
  width: '100%',
  height: '100%',
  position: 'absolute',  // Position the container absolutely
  gridTemplateRows: '1fr',  // Grid rows
  gridTemplateColumns: '1fr',  // Grid columns
  alignItems: 'center',  // Center items vertically
  justifyItems: 'center',  // Center items horizontally
  pointerEvents: 'none',  // Disable interaction with background elements
});

// Styles for the scrim (the overlay background)
export const scrim = style({
  width: '100%',
  height: '100%',
  position: 'absolute',  // Position it over the modal container
  background: 'rgba(0 0 0 / 20%)',  // Semi-transparent black background
  pointerEvents: 'all',  // Allow interaction with the scrim
  zIndex: 3,  // Ensure the scrim is above other content
});
