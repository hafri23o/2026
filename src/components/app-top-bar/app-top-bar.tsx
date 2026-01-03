import { useLocation, useNavigate } from 'solid-app-router'
import { ParentComponent, JSX, Match, Switch } from 'solid-js'
import { clx, wait } from '~/utils'
import { IconButton } from '../icon-button/icon-button'
import { useScaffoldContext } from '../scaffold/scaffold'
import * as styles from './app-top-bar.css'

// BackButton component to handle browser back navigation
const BackButton = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const pathname = () => location.pathname

  const onClickHandler = () => {
    const path = pathname()
    window.history.back()
    // If there are no entries inside history, back button won't work and user will be stuck.
    // Check if URL changed after a short delay and redirect if necessary.
    wait(50).then(() => {
      if (path === pathname()) {
        navigate('/')  // Navigate to the homepage if back button doesn't work
      }
    })
  }

  return (
    <IconButton icon="backArrow" title="Back button" onClick={onClickHandler} />
  )
}

// TypeScript interface for the props of AppTopBar
export interface AppTopBarProps {
  mainButton?: JSX.Element | false
  title?: string
  class?: string
  hideSpacer?: boolean
  belowContent?: JSX.Element
  scrollAware?: boolean
}

// Main AppTopBar component
export const AppTopBar: ParentComponent<AppTopBarProps> = (props) => {
  const [state] = useScaffoldContext() || [{}]  // Get scaffold context state

  // Determine if scroll-aware functionality is enabled
  const scrollAware = () => (props.scrollAware === undefined ? true : props.scrollAware)

  return (
    <header
      class={clx(
        styles.appTopBar,  // Apply main top bar styles
        scrollAware() && state.isScrolled && styles.elavated,  // Apply elevated style if scroll-aware and scrolled
        props.class,  // Allow external classes to be passed via props
      )}
    >
      <div class={styles.content}>
        <Switch>
          {/* Show BackButton when no mainButton is provided */}
          <Match when={props.mainButton === undefined}>
            <BackButton />
          </Match>
          {/* Show mainButton if provided */}
          <Match when={props.mainButton}>{props.mainButton}</Match>
        </Switch>

        {/* Display title if provided */}
        {props.title && <h1 class={styles.title}>{props.title}</h1>}

        {/* Display spacer unless explicitly hidden */}
        {!props.hideSpacer && <div class={styles.spacer} />}

        {/* Render children passed to the component */}
        {props.children}
      </div>
      {props.belowContent}  {/* Render content below the main content */}
    </header>
  )
}
