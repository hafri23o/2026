import { setStyles } from '../../../utils'; // Assuming this path is correct based on your directory structure
import { MenuPosition } from '../types';

interface MenuPositioning extends MenuPosition {
  originY?: number;
  originX?: number;
  width: number;
  height: number;
}

/**
 * Function to position the menu on the screen, ensuring it doesn't overflow outside the window.
 * @param menuEl - The menu element to position.
 * @param pos - The position details for the menu, including width, height, and optional origin for the transform.
 */
export const positionMenu = (menuEl: HTMLElement, pos: MenuPositioning): void => {
  // Ensure the menu is not positioned outside of the window bounds.
  const top = Math.min(pos.top, window.innerHeight - pos.height);
  const left = Math.min(pos.left, window.innerWidth - pos.width);

  // Apply styles to the menu element using setStyles utility.
  setStyles(menuEl, {
    width: `${pos.width}px`,
    height: `${pos.height}px`,
    top: `${top}px`,
    left: `${left}px`,
    'transform-origin': `${pos.originX || 0}px ${pos.originY || 0}px`,
  });
};
