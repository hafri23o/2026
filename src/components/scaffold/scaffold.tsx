import {
  createContext,
  createEffect,
  JSXElement,
  ParentComponent,
  Show,
  useContext,
} from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'
import { clx } from '~/utils'  // Path alias ~ is used to import utils
import { AppTopBar } from '../app-top-bar/app-top-bar'
import { ScrollContainer } from '../scroll-container/scroll-container'
import * as styles from './scaffold.css'  // Path alias ~ used for the styles import

// Define the props that the Scaffold component will receive
export interface ScaffoldProps {
  title?: string
  topBar?: string | JSXElement
  bottomBar?: JSXElement
  navRail?: JSXElement
  class?: string | false
  scrollable?: boolean
}

// State structure for the Scaffold context
export interface ScaffoldContextState {
  isScolled: boolean
}

// Type for the value the context will provide
export type ScaffoldContextValue = [
  ScaffoldContextState,
  SetStoreFunction<ScaffoldContextState>,
]

// Helper function to determine the top bar content based on props
const getTopBar = (topBar: ScaffoldProps['topBar'], title?: string) => {
  if (topBar === false) {
    return null
  }

  if (
    typeof topBar === 'string' ||
    (title !== undefined && topBar === undefined)
  ) {
    return <AppTopBar title={topBar || title} />
  }

  return topBar
}

// Create the context for Scaffold state
export const ScaffoldContext = createContext<ScaffoldContextValue>()
export const useScaffoldContext = () =>
  useContext(ScaffoldContext) as ScaffoldContextValue

// Scaffold component implementation
export const Scaffold: ParentComponent<ScaffoldProps> = (props) => {
  // Create state for tracking scroll state
  const [state, setState] = createStore<ScaffoldContextState>({
    isScolled: false,
  })

  // Effect to update the document title when the page title changes
  createEffect(() => {
    const pageTitle = props.title && `${props.title} • Osho Digital Library`
    if (pageTitle) {
      document.title = pageTitle
    }
  })

  return (
    // Provide the Scaffold context to children
    <ScaffoldContext.Provider value={[state, setState]}>
      <div class={clx(styles.container, props.class)}>
        {/* Top Bar */}
        <div class={styles.topBar}>
          {getTopBar(props.topBar, props.title)}
        </div>

        {/* Navigation Rail */}
        <div class={styles.navRail}>{props.navRail}</div>

        {/* Content Area */}
        <div class={styles.content}>
          <Show when={props.scrollable} fallback={props.children}>
            <ScrollContainer observeScrollState>
              {props.children}
            </ScrollContainer>
          </Show>
        </div>

        {/* Bottom Bar */}
        <div class={styles.bottomBar}>{props.bottomBar}</div>
      </div>
    </ScaffoldContext.Provider>
  )
}
