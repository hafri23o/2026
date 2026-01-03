import { JSXElement } from 'solid-js'
import { usePlayerStore } from '~/stores/stores' // Correct path alias
import { TracksList } from '~/components/entities-lists/tracks-list/tracks-list' // Correct path alias
import { MessageBanner } from '~/components/message-banner/message-banner' // Correct path alias
import { ScrollContainer } from '~/components/scroll-container/scroll-container' // Correct path alias

export const QueueList = (): JSXElement => {
  const [playerState, playerActions] = usePlayerStore()

  return (
    <ScrollContainer observeScrollState>
      <TracksList
        showIndex
        items={playerState.trackIds}
        isPlayingItem={(_, index) => index === playerState.activeTrackIndex}
        onItemClick={(_, index) => playerActions.playTrack(index)}
        fallback={
          <MessageBanner
            message='Your queue is empty.'
            button={{
              title: 'Play something from the library',
              href: '/',
            }}
          />
        }
      />
    </ScrollContainer>
  )
}
