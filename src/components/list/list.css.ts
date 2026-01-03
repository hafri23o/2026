import { style } from '@vanilla-extract/css'

export const listContainer = style({
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  // Add some margin for spacing in the container, useful for layout
  margin: 0, 
})
