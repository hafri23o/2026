import { MenuAlign } from '../types'

interface Position {
  top: number;
  left: number;
  originY: number;
  originX: number;
}

/**
 * Function to calculate the position of the menu relative to the anchor element.
 * @param menuRect - The DOMRect of the menu.
 * @param anchor - The anchor element.
 * @param align - The alignment for horizontal and vertical positioning (optional).
 * @returns The calculated position object containing top, left, originY, and originX.
 */
export const getMeasurementsFromAnchor = (
  menuRect: DOMRect,
  anchor: HTMLElement,
  align?: MenuAlign,
): Position => {
  const {
    horizontal: horizontalAlign = 'left',
    vertical: verticalAlign = 'top',
  } = align || {}

  const anchorRect = anchor.getBoundingClientRect()
  const { top: aTop, left: aLeft } = anchorRect

  const top =
    verticalAlign === 'top' ? aTop : anchorRect.bottom - menuRect.height
  const left =
    horizontalAlign === 'left' ? aLeft : anchorRect.right - menuRect.width

  const originY = Math.abs(aTop - top + anchorRect.height / 2)
  const originX = Math.abs(aLeft - left + anchorRect.width / 2)

  const position: Position = {
    top,
    left,
    originY,
    originX,
  }

  return position
}
