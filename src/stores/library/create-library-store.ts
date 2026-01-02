import { createStore } from 'solid-js/store'
import {
  Track,
  Album,
  Artist,
  Playlist,
  MusicItemType,
  MusicItemKey,
} from '../../types/types'

/* =========================================================
 * Sort-key mapping per entity type
 * ======================================================= */

type LibraryItemSortState = {
  [MusicItemType.ALBUM]: keyof Album
  [MusicItemType.ARTIST]: keyof Artist
  [MusicItemType.PLAYLIST]: keyof Playlist
  [MusicItemType.HISTORY]: keyof Track
}

type LibrarySortableType =
  | typeof MusicItemType.ALBUM
  | typeof MusicItemType.ARTIST
  | typeof MusicItemType.PLAYLIST
  | typeof MusicItemType.HISTORY

interface State {
  sortKeys: LibraryItemSortState
}

interface SortOptions<T extends LibrarySortableType> {
  type: T
  key: LibraryItemSortState[T]
}

/* =========================================================
 * Store
 * ======================================================= */

export const createLibraryStore = () => {
  const [state, setState] = createStore<State>({
    sortKeys: {
      [MusicItemType.ALBUM]: MusicItemKey.NAME,
      [MusicItemType.ARTIST]: MusicItemKey.NAME,
      [MusicItemType.PLAYLIST]: MusicItemKey.NAME,
      [MusicItemType.HISTORY]: MusicItemKey.NAME,
    },
  })

  /* =======================================================
   * Actions
   * ===================================================== */

  const sort = <T extends LibrarySortableType>({
    type,
    key,
  }: SortOptions<T>) => {
    setState('sortKeys', type, key)
  }

  const actions = {
    sort,
  }

  /* =======================================================
   * Persistence descriptors
   * ===================================================== */

  const persistedItems = [
    {
      key: 'library-sort',
      selector: () => state.sortKeys,
      load: (sortKeys: LibraryItemSortState) =>
        setState({ sortKeys }),
    },
  ]

  return [state, actions, persistedItems] as const
}
