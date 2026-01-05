import { VoidComponent, createSignal } from 'solid-js'
import { usePlayerStore } from '~/stores/stores'  // Using the correct path alias from tsconfig.json
import { formatTime } from '~/utils'  // Correctly resolved path from tsconfig.json
import { KeyboardCode } from '~/utils/key-codes'  // Correct path for keyboard codes
import { Slider } from '~/components/slider/slider'  // Correct path for Slider component
import * as styles from './timeline.css'  // Assuming the styles are still being imported correctly

export const Timeline: VoidComponent = () => {
  const [playerState, playerActions] = usePlayerStore()

  const [isSeeking, setIsSeeking] = createSignal(false)
  const [localCurrentTime, setLocalCurrentTime] = createSignal(0)

  // Function to change the current time of the player
  const changeCurrentTime = (time: number) => {
    if (Number.isFinite(time)) {
      playerActions.changeCurrentTime(time)
    }
  }

  // Duration and current time are derived from the player state
  const duration = () => playerState.duration
  const currentTime = () => playerState.currentTime

  // Handlers for user interactions (seeking)
  const onPointerDownHandle = () => setIsSeeking(true)

  const onPointerUpHandle = () => {
    changeCurrentTime(localCurrentTime())
    setIsSeeking(false)
  }

  const onInputHandle = (e: InputEvent) => {
    const timelineEl = e.composedPath()[0] as HTMLInputElement

    const value = parseInt(timelineEl.value, 10) || 0
    const newTime = (value / 1000) * duration()
    setLocalCurrentTime(newTime)
  }

  const onKeyDownHandle = (e: KeyboardEvent) => {
    const { code } = e
    const isLeftArrow = code === KeyboardCode.ARROW_LEFT
    if (isLeftArrow || code === KeyboardCode.ARROW_RIGHT) {
      const time = currentTime() + (isLeftArrow ? -10 : 10)
      const adjustedTime = Math.max(Math.min(time, duration()), 0)
      changeCurrentTime(adjustedTime)
      e.preventDefault()
    }
  }

  // Determine which time to display (local or player state)
  const actualCurrentTime = () =>
    isSeeking() ? localCurrentTime() : currentTime()

  // Input value for the slider
  const inputValue = () => {
    const time = actualCurrentTime()

    return time ? (time * 1000) / duration() : 0
  }

  return (
    <div class={styles.timelineContainer}>
      <div class={styles.time}>{formatTime(actualCurrentTime())}</div>
      <Slider
        disabled={!playerState.activeTrack}
        aria-label="Audio timeline"
        max={1000}
        onPointerDown={onPointerDownHandle}
        onPointerUp={onPointerUpHandle}
        onInput={onInputHandle}
        onKeyDown={onKeyDownHandle}
        value={inputValue()}
      />
      <div class={styles.time}>{formatTime(duration())}</div>
    </div>
  )
}
