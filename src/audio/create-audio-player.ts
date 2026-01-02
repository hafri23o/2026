import { createEffect, createComputed, onCleanup } from 'solid-js'
import { usePlayerStore } from '~/stores/stores' // Path alias correctly used
import { toast } from '~/components/toast/toast' // Path alias correctly used
import { getCachedAudio, cacheAudio } from '~/utils/audio-cache' // Added cacheAudio import
import { MusicImagesContext } from '~/components/music-image/data-context' // Path alias correctly used

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
        // Fetch audio from the network if not cached
        const response = await fetch(url)
        audioBlob = await response.blob()

        // Cache the audio after fetching it from the network
        await cacheAudio(url, audioBlob, response.headers.get('Content-Type') || 'audio/mp3')
      }

      if (audioBlob) {
        audio.src = URL.createObjectURL(audioBlob)
        audio.play()
      } else {
        toastPlayerError()
      }
    } catch (error) {
      console.error(error) // Optionally log error
      toastPlayerError()
    }
  }

  // Whenever the track changes, play the new track
  createEffect(() => {
    if (track) {
      playTrack(track)
    }
  })

  // Sync audio player with store state (whether it's playing or paused)
  createComputed(() => {
    if (playerStore.isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  })

  // Cleanup the audio when done
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
