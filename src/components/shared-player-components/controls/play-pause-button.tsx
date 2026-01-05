import { JSXElement } from 'solid-js'
import { useEntitiesStore, usePlayerStore } from '../../../stores/stores'
import { clx } from '../../../utils'
import * as styles from './controls.css'

export const PlayPauseButton = (): JSXElement => {
  const [playerState, playerActions] = usePlayerStore()
  const [entities] = useEntitiesStore()

  const onPlayPauseClick = () => {
    if (!playerState.activeTrack) {
      // If no active track, play a random one
      playerActions.playRandomTrack()
    } else {
      // Otherwise toggle play/pause
      playerActions.playPause()
    }
  }

  return (
    <button
      title={playerState.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      disabled={!Object.values(entities.tracks).length}
      onClick={onPlayPauseClick}
      class={styles.playPauseButton}
    >
      <div
        class={clx(
          styles.playPauseIcon,
          playerState.isPlaying && styles.playing,
        )}
      >
        <div class={styles.playPauseIconBar} />
        <div class={clx(styles.playPauseIconBar, styles.flippedY)} />
      </div>
    </button>
  )
}
