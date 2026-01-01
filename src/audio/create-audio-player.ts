import { createEffect, useContext, createResource, untrack, onCleanup, createComputed, batch } from 'solid-js'
import { usePlayerStore } from '~/stores/stores' // Adjusted to use ~ alias
import { RepeatState } from '~/stores/player/create-player-store' // Adjusted to use ~ alias
import { isEventMeantForTextInput } from '~/utils' // Adjusted to use ~ alias
import { KeyboardCode } from '~/utils/key-codes' // Adjusted to use ~ alias
import { MusicImagesContext } from '~/components/music-image/data-context' // Adjusted to use ~ alias
import { toast } from '~/components/toast/toast' // Adjusted to use ~ alias
import { getCachedAudio } from '~/utils/audio-cache' // Adjusted to use ~ alias

const toastPlayerError = () => {
  toast({
    message: "Something went wrong. Player wasn't able to play selected track.",
    type: 'error',
    duration: 3000,
  })
}

export const createAudioPlayer = (track: string) => {
  const [playerStore, setPlayerStore] = usePlayerStore()

  const audio = new Audio()
  audio.preload = 'auto'

  const playTrack = async (url: string) => {
    try {
      let audioBlob: Blob | null = null
      const cachedAudio = await getCachedAudio(url)

      if (cachedAudio) {
        audioBlob = cachedAudio.blob
      } else {
        // Fetch audio from network if not in cache
        const response = await fetch(url)
        audioBlob = await response.blob()
        await cacheAudio(url, audioBlob, response.headers.get('Content-Type') || 'audio/mp3')
      }

      if (audioBlob) {
        audio.src = URL.createObjectURL(audioBlob)
        audio.play()
      } else {
        toastPlayerError()
      }
    } catch (error) {
      toastPlayerError()
    }
  }

  // When track changes, play new track
  createEffect(() => {
    if (track) {
      playTrack(track)
    }
  })

  createComputed(() => {
    if (playerStore.isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  })

  onCleanup(() => {
    audio.pause()
    audio.src = ''
  })

  return {
    playTrack,
    stopTrack: () => audio.pause(),
    isPlaying: () => !audio.paused,
  }
}
