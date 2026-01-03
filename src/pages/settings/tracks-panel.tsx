import { VoidComponent, createMemo } from 'solid-js'
import { pluralize } from '~/utils'  // Path alias used correctly
import { useEntitiesStore } from '~/stores/stores'  // Path alias used correctly
import * as styles from './settings.css'  // Ensure styles are imported with correct path

export const TracksPanel: VoidComponent = () => {
  const [entities] = useEntitiesStore()

  // Memoize tracks count for better performance
  const tracksCount = createMemo(() => Object.keys(entities.tracks).length)

  return (
    <div class={styles.tracksInfoPanel}>
      <div class={styles.tracksInfoText}>
        <div>
          Currently there are{' '}
          <strong class={styles.countText}>{tracksCount()}</strong>{' '}
          {pluralize(tracksCount(), 'talk')} in the Osho Digital Library
        </div>
        <div class={styles.tracksInfoCaption}>
          Content is curated from Osho's teachings and discourses
        </div>
      </div>
      <div class={styles.tracksInfoCaption}>
        <div>
          This library contains philosophical talks and meditation guidance
          from Osho, organized by series and standalone discourses.
        </div>
      </div>
    </div>
  )
}
