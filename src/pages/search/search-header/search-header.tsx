import { createEffect, JSXElement } from 'solid-js' // Ensure Solid.js hooks are correctly imported
import { useNavigate } from 'solid-app-router' // Solid App Router for navigation
import { IconButton } from '~/components/icon-button/icon-button' // Path alias for components
import { debounce, doesElementContainFocus } from '~/utils' // Path alias for utils
import { AppTopBar } from '~/components/app-top-bar/app-top-bar' // Path alias for components
import * as styles from './search-header.css' // Correct import for styles

export interface SearchHeaderProps {
  searchTerm: string // Define the props for search term
}

export const SearchHeader = (props: SearchHeaderProps): JSXElement => {
  const navigate = useNavigate() // Hook for navigation

  let inputEl!: HTMLInputElement // Reference for the input element

  // Function to replace the search route
  const replaceSearchRoute = (value: string) => {
    navigate(`/search/${encodeURIComponent(value)}`, {
      replace: true, // Replace the current history state
    })
  }

  // Debounced search handler
  const onSearchHandle = debounce(() => {
    const value = inputEl.value.trim()
    replaceSearchRoute(value)
  }, 200)

  // Clear search term handler
  const onClearSearchHandle = () => {
    replaceSearchRoute('')
  }

  // Effect to sync input value with props.searchTerm
  createEffect(() => {
    if (!inputEl) {
      return
    }

    const term = props.searchTerm
    // Prevent race condition by only updating the input value if it's not focused
    if (!doesElementContainFocus(inputEl) || term === '') {
      inputEl.value = term
    }
  })

  return (
    <AppTopBar hideSpacer> {/* Top bar component with spacer hidden */}
      <div class={styles.searchBox}> {/* Container for search box */}
        <input
          class={styles.searchInput} // Applying styles for input
          aria-label="Search box" // Accessibility label
          placeholder="Search..." // Placeholder text
          autocapitalize="none" // Disable autocapitalization
          onInput={onSearchHandle} // Handle input changes
          ref={inputEl} // Set reference to input
        />
        {props.searchTerm && ( // Show close icon if there is a search term
          <IconButton icon="close" onClick={onClearSearchHandle} />
        )}
      </div>
      <div class={styles.symmetrySpacer}></div> {/* Spacer for symmetry */}
    </AppTopBar>
  )
}
