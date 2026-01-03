import { useMatch } from 'solid-app-router'
import { createMemo, JSXElement, ParentComponent, Show } from 'solid-js'
import { createMediaQuery } from '~/helpers/hooks/create-media-query'  // Correct path alias
import { ControlsPane } from './controls-pane/controls-pane'  // Correct path alias
import { QueueList } from './queue-list'  // Correct path alias
import { Scaffold } from '~/components/scaffold/scaffold'  // Correct path alias

// A parent component for the "Now Playing" screen
const NowPlaying: ParentComponent = (props) => (
  <Scaffold title='Now Playing' topBar={false}>
    <ControlsPane pinned={Boolean(props.children)} />
    {props.children}
  </Scaffold>
)

// Component to handle the separate pages (full player and queue list)
const FullPlayerSeparatePages = () => {
  const mainPlayerMatch = useMatch(() => '/player')
  const isMainPlayer = createMemo(() => Boolean(mainPlayerMatch()))

  return (
    <Show when={!isMainPlayer()} fallback={<NowPlaying />}>
      <Scaffold title='Up next'>
        <QueueList />
      </Scaffold>
    </Show>
  )
}

// Main Full Player component, using media query for responsive design
const FullPlayer = (): JSXElement => {
  const isCompact = createMediaQuery('(max-width: 700px), (max-height: 640px)')

  return (
    <Show when={!isCompact()} fallback={<FullPlayerSeparatePages />}>
      <NowPlaying>
        <QueueList />
      </NowPlaying>
    </Show>
  )
}

export default FullPlayer
