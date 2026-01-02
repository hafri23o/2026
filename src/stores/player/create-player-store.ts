import { batch, createEffect, createMemo, untrack } from 'solid-js'
import { produce, createStore } from 'solid-js/store'
import { shuffleArray } from '~/utils/utils'  // Updated path for compatibility
import { Track } from '~/types/types'  // Updated path for compatibility
import { useEntitiesStore } from '~/stores'  // Updated path for compatibility
import { toast } from '~/components/toast/toast'  // Updated path for compatibility

export const RepeatState = {
  OFF: 0,
  ALL: 1,
  ONCE: 2,
} as const
export type RepeatState = typeof RepeatState[keyof typeof RepeatState]

interface ActiveMinute {
  activeminute_timestamp_ms: number
  track_id: string
  track_timestamp_ms: number
}

interface State {
  isPlaying: boolean
  trackIds: readonly string[]
  originalTrackIds: readonly string[]
  activeTrackIndex: number
  repeat: RepeatState
  shuffle: boolean
  currentTime: number
  currentTimeChanged: boolean
  duration: number
  isMuted: boolean
  volume: number
  activeMinutes: ActiveMinute[]
  currentActiveMinute: ActiveMinute | null
  isSwitchingTracks: boolean
  readonly activeTrackId: string
  readonly activeTrack?: Track
}

type TrackIds = readonly string[]

export const createPlayerStore = () => {
  const [entities] = useEntitiesStore()

  const [state, setState] = createStore<State>({
    isPlaying: false,
    trackIds: [],
    originalTrackIds: [],
    activeTrackIndex: -1,
    repeat: RepeatState.OFF,
    shuffle: false,
    currentTime: 0,
    currentTimeChanged: false,
    duration: 0,
    isMuted: false,
    volume: 100,
    activeMinutes: [],
    currentActiveMinute: null,
    isSwitchingTracks: false,
    get activeTrackId(): string {
      return activeTrackIdMemo()
    },
    get activeTrack(): Track | undefined {
      return activeTrackMemo()
    },
  })

  const activeTrackIdSelector = () => state.trackIds[state.activeTrackIndex]
  const activeTrackSelector = () =>
    entities.tracks[activeTrackIdSelector()] as Track | undefined

  const activeTrackIdMemo = createMemo(activeTrackIdSelector)
  const activeTrackMemo = createMemo(activeTrackSelector)

  const doesActiveTrackExist = () => !!state.activeTrack

  const play = () => {
    setState({
      isPlaying: doesActiveTrackExist(),
    })
  }

  const pause = () => {
    setState({ isPlaying: false })
  }

  const playPause = () => {
    setState({
      isPlaying: !state.isPlaying && doesActiveTrackExist(),
    })
  }

  const setShuffleEnabledTracksState = (index: number, tracks: TrackIds) => {
    setState({
      originalTrackIds: tracks,
      trackIds: shuffleArray(tracks, index),
      activeTrackIndex: 0,
    })
  }

  const playTrack = (index: number, tracks?: TrackIds) => {
    let trackId: string
    if (tracks) {
      trackId = tracks[index]
    } else {
      trackId = state.trackIds[index]
    }

    const savedTimestamp = getSavedTrackTimestamp(trackId)
    console.log(`[Player] Playing track ${trackId}, saved timestamp: ${savedTimestamp}s`)

    batch(() => {
      setState({
        isSwitchingTracks: true,
      })

      if (tracks) {
        setState({
          trackIds: [...tracks],
        })

        if (state.shuffle) {
          setShuffleEnabledTracksState(index, tracks)
        } else {
          setState({
            activeTrackIndex: index,
          })
        }
      } else {
        setState({
          activeTrackIndex: index,
        })
      }

      setState({
        currentTime: savedTimestamp,
        currentTimeChanged: true,
      })
    })

    setState('isPlaying', !!state.activeTrack)

    setTimeout(() => {
      setState({ isSwitchingTracks: false })
    }, 100)
  }

  const playNextTrack = (playUnlessLastTrack = false) => {
    const { trackIds, activeTrackIndex } = state
    const len = trackIds.length

    if (!len) {
      return
    }

    if (activeTrackIndex === -1) {
      playTrack(0)
      return
    }

    const isTheLastTrack = len === activeTrackIndex + 1
    if (isTheLastTrack && playUnlessLastTrack) {
      setState({ isPlaying: false })
      return
    }

    const newIndex = isTheLastTrack ? 0 : activeTrackIndex + 1
    playTrack(newIndex)
  }

  const playPreveousTrack = () => {
    const { trackIds, activeTrackIndex } = state
    const len = trackIds.length

    if (!len) {
      return
    }

    let { currentTime } = state

    let newIndex = activeTrackIndex
    if (newIndex === -1) {
      newIndex = 0
    } else if (currentTime < 4) {
      newIndex = activeTrackIndex === 0 ? len - 1 : activeTrackIndex - 1
      currentTime = 0
    }

    playTrack(newIndex)
  }

  const addTracksToQueue = (trackIds: TrackIds) => {
    setState(
      produce((s) => {
        let newTrackIds = trackIds

        if (s.shuffle) {
          newTrackIds = shuffleArray(trackIds)
          s.originalTrackIds = s.originalTrackIds.concat(trackIds)
        }

        s.trackIds = s.trackIds.concat(newTrackIds)
      }),
    )
  }

  const removeFromQueue = (trackIdsToBeRemoved: TrackIds) => {
    let { trackIds, originalTrackIds, activeTrackIndex: activeIndex } = state

    trackIds = trackIds.filter((id) => !trackIdsToBeRemoved.includes(id))
    if (state.shuffle) {
      originalTrackIds = originalTrackIds.filter(
        (id) => !trackIdsToBeRemoved.includes(id),
      )
    }

    activeIndex = originalTrackIds.indexOf(state.activeTrackId)

    let stateIfTrackGotRemoved = {}
    if (activeIndex === -1) {
      stateIfTrackGotRemoved = {
        isPlaying: false,
        currentTime: 0,
        duration: NaN,
      }
    }

    setState({
      ...stateIfTrackGotRemoved,
      trackIds,
      originalTrackIds,
      activeTrackIndex: activeIndex,
    })
  }

  const clearQueue = () => {
    setState({
      trackIds: [],
      originalTrackIds: [],
      isPlaying: false,
      currentTime: 0,
      duration: NaN,
    })
  }

  const toggleShuffle = () => {
    let { shuffle } = state
    shuffle = !shuffle

    batch(() => {
      if (shuffle) {
        setShuffleEnabledTracksState(state.activeTrackIndex, state.trackIds)
      } else {
        const { originalTrackIds } = state
        setState({
          activeTrackIndex: originalTrackIds.indexOf(state.activeTrackId),
          trackIds: originalTrackIds,
          originalTrackIds: [],
        })
      }
      setState('shuffle', shuffle)
    })
  }

  const toggleRepeat = () => {
    const repeatMap = {
      [RepeatState.OFF]: RepeatState.ALL,
      [RepeatState.ALL]: RepeatState.ONCE,
      [RepeatState.ONCE]: RepeatState.OFF,
    }

    setState({ repeat: repeatMap[state.repeat] })
  }

  const setCurrentTime = (payload: number) => {
    const shouldPreserve
