import { JSX, ParentComponent } from 'solid-js' // Solid's JSX and ParentComponent types
import { clx } from '~/utils' // Use path alias to import utility function for class names
import { Icon, IconType } from '~/components/icon/icon' // Use path alias for Icon component
import * as styles from './icon-button.css' // Import styles using local relative path

export type { IconType } // Export the IconType for use in the component

// Define the props for the IconButton component
export interface IconButtonProps {
  icon?: IconType // Optional icon prop for displaying icons
  title?: string // Optional title for the button (displayed on hover)
  class?: string // Additional custom classes to add to the button
  disabled?: boolean // Disable the button when true
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> // Optional click handler
  tabIndex?: number // Optional tabIndex for button focus
}

// Functional component for IconButton
export const IconButton: ParentComponent<IconButtonProps> = (props) => (
  <button
    disabled={props.disabled} // Disable the button if `disabled` is passed
    title={props.title} // Set title for accessibility (displayed as tooltip)
    class={clx(styles.iconButton, props.class)} // Merge the default style with custom classes
    onClick={props.onClick} // Set the click handler
    tabIndex={props.tabIndex} // Set tabIndex for button focus
  >
    {props.icon !== undefined ? <Icon icon={props.icon} /> : props.children} {/* Render icon or children */}
  </button>
)
