import { useNavigate } from 'solid-app-router'
import { Show, VoidComponent } from 'solid-js'
import { createMediaQuery } from '~/helpers/hooks/create-media-query' // Correct path with alias
import { Artwork } from '../shared-player-components/artwork/artwork' // Assuming components exist under this path
import { Controls } from '../shared-player-components/controls/main-controls'
import { PlayNextButton } from '../shared-player-components/controls/play-next-prev-buttons'
import { PlayPauseButton } from '../shared-player-components/controls/play-pause-button'
import { VolumePanel } from '../shared-player-components/volume/volume-panel'
import { Info } from '../shared-player-components/info/info'
import { Timeline } from '../shared-player-components/timeline/timeline'
import { clx } from '~/utils' // Ensure utility functions are also imported using alias
import { FavoriteButton } from '../shared-player-components/info/favorite-button'
import { Icon } from '../icon/icon' // Assuming this is another component
import * as styles from './mini-player.css' // Assuming CSS is written using @vanilla-extract

export interface MiniPlayerProps {
  class?: string | false
}

export const MiniPlayer: VoidComponent<MiniPlayerProps> = (props) => {
  // Create media queries based on screen size
  const areMainControlsHidden = createMediaQuery(styles.COMPACT_MEDIA) // Using compact media query defined in CSS
  const areSecondaryActionsVisible = createMediaQuery('(min-width: 421px)')
  const isPlayPauseButtonVisible = createMediaQuery('(min-width: 300px)')

  const navigate = useNavigate()

  return (
    <div class={clx(styles.container, props.class)}>
      {/* Show Timeline only when main controls are not hidden */}
      {!areMainControlsHidden() && <Timeline />}

      <div class={styles.infoSection}>
        <button
          title='Open player'
          class={styles.openFullPlayerButton}
          onClick={() => navigate('/player')} // Navigate to player page
        >
          <div class={styles.artworkContainer}>
            <Icon icon='chevronUp' class={styles.artworkArrow} /> {/* Custom Icon */}
            <Artwork /> {/* Artwork component */}
          </div>
          <Info /> {/* Info section */}
        </button>

        {/* Show FavoriteButton only when secondary actions are visible */}
        {areSecondaryActionsVisible() && <FavoriteButton />}
      </div>

      {/* Conditionally render controls and play/pause button */}
      <Show
        when={!areMainControlsHidden()} 
        fallback={
          <>
            {isPlayPauseButtonVisible() && <PlayPauseButton />} {/* Play/Pause button */}
            {areSecondaryActionsVisible() && <PlayNextButton />} {/* Next/Previous buttons */}
          </>
        }
      >
        <Controls /> {/* Main controls */}
        <VolumePanel /> {/* Volume control */}
      </Show>
    </div>
  )
}
