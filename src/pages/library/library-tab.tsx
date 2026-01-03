import { createMemo, VoidComponent } from 'solid-js'  // Import Solid.js hooks
import { Dynamic } from 'solid-js/web'  // Dynamic component for conditional rendering
import { ScrollContainer } from '~/components/scroll-container/scroll-container'  // Using the '~' alias
import {
  useEntitiesStore,
  useLibraryStore
} from '~/stores/stores'  // Using the '~' alias for stores
import { BaseMusicItem, MusicItemType, Track } from '~/types/types'  // Using the '~' alias for types
import { sortByKey } from '~/utils'  // Using the '~' alias for utils
import { LibraryPageConfig } from './config'  // Correct path for configuration
import * as styles from './library.css'  // Using local styles for CSS Modules

export const LibraryPage: VoidComponent<LibraryPageConfig> = (props) => {
  // Access store states
  const [dataState] = useEntitiesStore()
  const [libraryState] = useLibraryStore()

  // Function to select items based on type
  const itemsSelector = () => {
    switch (props.type) {
      case MusicItemType.ALBUM:
        return dataState.albums
      case MusicItemType.TRACK:
        return dataState.tracks
      case MusicItemType.ARTIST:
        return dataState.artists
      case MusicItemType.PLAYLIST:
        return dataState.playlists
      default:
        throw new Error('Wrong item type')  // Handle invalid item type
    }
  }

  // Memoized item IDs sorted by the selected key
  const itemIds = createMemo(() => {
    const itemsArray = sortByKey(
      [...Object.values<Track>(itemsSelector() as { [key: string]: Track })], 
      libraryState.sortKeys[props.type] as keyof Track  // Sorting by key from state
    ) as unknown as BaseMusicItem[]  // Casting to the correct type

    return itemsArray.map((item) => item.id)  // Return sorted item IDs
  })

  // Return JSX structure for the library page
  return (
    <ScrollContainer class={styles.libraryPageContainer} observeScrollState>
      {props.actions && <div class={styles.actions}>{props.actions}</div>}  // Display actions if provided
      <Dynamic component={props.component} items={itemIds()} />  // Dynamically render the component with item IDs
    </ScrollContainer>
  )
}
