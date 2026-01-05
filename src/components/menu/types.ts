import { JSX } from 'solid-js'

// Define the structure for a single menu item
export interface MenuItem {
  name: string // Name of the menu item
  action: () => void // Action to be executed when the item is clicked
  disabled?: boolean // Optional: Whether the item is disabled
  selected?: boolean // Optional: Whether the item is selected
}

// Define the position of the menu (top and left offsets)
export type MenuPosition = {
  top: number // Vertical position
  left: number // Horizontal position
}

// Define the alignment options for the menu
export interface MenuAlign {
  horizontal?: 'left' | 'right' // Horizontal alignment options
  vertical?: 'top' | 'bottom' // Vertical alignment options
}

// Define the options when the menu is anchored to an element
interface MenuAnchorOptions {
  anchor: true // Indicates that the menu is anchored to an element
  preferredAlign?: MenuAlign // Optional: Preferred alignment
}

// Define the options for positioning the menu manually
interface MenuPositionOptions {
  anchor: false // Indicates that the menu is not anchored to an element
  position: MenuPosition // The position of the menu on the screen
}

// Define the size options for the menu
interface MenuSize {
  width?: number // Optional: Width of the menu
  height?: number // Optional: Height of the menu
}

// Combine the different menu options into one type
export type MenuOptions = (MenuAnchorOptions | MenuPositionOptions) & MenuSize

// Define the state of the menu (whether it's open, the items in the menu, and the optional component)
export interface MenuState {
  isOpen: boolean // Whether the menu is currently open
  items: MenuItem[] // List of items in the menu
  component?: JSX.Element // Optional: A custom component for the menu
}

// Define the context props for managing the menu state
export interface MenuContextProps {
  // Method to show the menu
  show(
    items: MenuState['items'] | { component: JSX.Element }, // Items or a custom component
    targetElement: HTMLElement, // The element to which the menu should be anchored
    options: MenuOptions, // The options that define the position and size of the menu
  ): void
}
