import { ScrollTargetContext } from '@minht11/solid-virtual-container'
import {
  createContext,
  createEffect,
  onCleanup,
  ParentComponent,
  useContext,
} from 'solid-js'
import { clx } from '../../utils'
import { useScaffoldContext } from '../scaffold/scaffold'
import * as styles from './scroll-container.css'

export const PlayerOverlayContext = createContext<() => boolean>(() => false)

export interface ScrollContainerProps {
  class?: string
  observeScrollState?: boolean
}

export const ScrollContainer: ParentComponent<ScrollContainerProps> = (
  props,
) => {
  const isPlayerOverlayVisible = useContext(PlayerOverlayContext)

  let targetEl: HTMLDivElement | undefined
  let scrollObserverEl: HTMLDivElement | undefined
  let initial = true

  // Use scaffold context if available
  const scaffoldContext = useScaffoldContext()

  createEffect(() => {
    if (!props.observeScrollState || !scaffoldContext) {
      return
    }

    const [, setState] = scaffoldContext

    const io = new IntersectionObserver(
      ([entry]) => {
        if (initial) {
          initial = false
          return
        }
        setState('isScolled', entry.intersectionRatio === 0)
      },
      { threshold: 0 },
    )

    if (scrollObserverEl) {
      io.observe(scrollObserverEl)
    }

    onCleanup(() => {
      if (scrollObserverEl) {
        io.unobserve(scrollObserverEl)
      }
    })
  })

  return (
    <div
      class={clx(
        styles.scrollContainer,
        isPlayerOverlayVisible() && styles.playerOverlay,
        props.class,
      )}
      ref={targetEl}
    >
      <ScrollTargetContext.Provider value={{ scrollTarget: targetEl }}>
        <div ref={scrollObserverEl} class={styles.scrollObserver} />
        <div class={styles.contentSizer}>{props.children}</div>
      </ScrollTargetContext.Provider>
    </div>
  )
}
