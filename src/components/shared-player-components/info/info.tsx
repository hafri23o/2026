import { Show, VoidComponent } from 'solid-js'
import { clx } from '~/utils' // Ensure correct import path
import { usePlayerStore } from '~/stores/stores' // Ensure correct import path for stores
import * as styles from './info.css' // Ensure the path is correct for the CSS file

interface InfoProps {
  bigTitle?: boolean
  hideFavoriteBtn?: boolean
  class?: string | false
}

export const Info: VoidComponent<InfoProps> = (props) => {
  const [playerState] = usePlayerStore()

  // Function to get the active track from the player state
  const aTrack = () => playerState.activeTrack

  return (
    <div class={clx(styles.infoContainer, props.class)}>
      {/* Only show if there's an active track */}
      <Show when={aTrack()}>
        <div class={styles.info}>
          {/* Conditionally render title based on `bigTitle` prop */}
          <div class={props.bigTitle ? styles.titleBig : styles.titleRegular}>
            {aTrack()?.name || 'Unknown'}
          </div>
          {/* Display the artists associated with the track */}
          <div class={styles.secondaryInfoText}>
            {aTrack()?.artists.join(', ')}
          </div>
        </div>
      </Show>
    </div>
  )
}
