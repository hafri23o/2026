import { JSX, Show, VoidComponent } from 'solid-js'
import { clx } from '~/utils'  // Using path alias '~'
import { IconButton } from '../icon-button/icon-button'
import { useMenu, MenuOptions, MenuItem } from '../menu/menu'
import * as styles from './list-item.css'  // Import styles

export interface ListItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  text: string
  secondaryText?: string
  icon?: JSX.Element
  trailing?: JSX.Element
  class?: string
  tabIndex?: number
  style?: string | JSX.CSSProperties
  onClick?: (e: MouseEvent) => void
  getMenuItems?: () => (MenuItem | undefined | false)[]
  disableMenu?: boolean
  isSelected?: boolean
}

export const ListItem: VoidComponent<ListItemProps> = (props) => {
  const menu = useMenu() // Hook to manage menu

  // Menu handler when right-click or context menu is triggered
  const onMenuHandler = (anchor: boolean, e: MouseEvent) => {
    if (props.disableMenu) {
      return
    }

    e.stopPropagation()
    e.preventDefault()

    const options: MenuOptions = anchor
      ? { anchor: true, preferredAlign: { horizontal: 'right' } }
      : { anchor: false, position: { top: e.y, left: e.x } }

    const items = props.getMenuItems?.().filter(Boolean) as
      | MenuItem[]
      | undefined

    if (!items) {
      return
    }

    menu.show(items, e.target as HTMLElement, options) // Show the menu
  }

  return (
    <div
      role='listitem'
      tabIndex={props.tabIndex}
      onClick={props.onClick}  // On click handler
      class={clx(
        styles.listItem,  // Applying the styles
        props.isSelected && styles.selected,  // If selected, add 'selected' class
        props.class,  // Additional class from props
      )}
      style={props.style}  // Inline styles from props
      onContextMenu={[onMenuHandler, false]}  // Right-click context menu handler
    >
      {props.icon && <div class={styles.icon}>{props.icon}</div>}  {/* Icon */}
      <div class={styles.textContainer}>
        <div class={styles.mainText}>{props.text}</div> {/* Main text */}
        <div class={styles.textEclipse}>{props.secondaryText}</div> {/* Secondary text */}
      </div>
      {props.trailing && <div class={styles.trailing}>{props.trailing}</div>}  {/* Trailing content */}
      <Show when={!props.disableMenu}>
        <IconButton
          title='More actions'  // Button title
          icon='moreVertical'  // Icon for the button
          tabIndex={props.tabIndex}
          onClick={[onMenuHandler, true]}  // Left-click to trigger menu with anchor
          class={styles.menu}  // Apply menu style
        />
      </Show>
    </div>
  )
}
