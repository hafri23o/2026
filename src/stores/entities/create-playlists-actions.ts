import { nanoid } from 'nanoid'
import { Playlist, MusicItemType } from '../../types/types'
import { SetState } from './create-entities-store'

/* =========================================================
 * Helpers
 * ======================================================= */

const mergeToUniqueArray = <T>(
  a: readonly T[],
  b: readonly T[],
): T[] => {
  return Array.from(new Set<T>([...a, ...b]))
}

/* =========================================================
 * Playlist actions
 * ======================================================= */

export const createPlaylistsActions = (setState: SetState) => {
  const createNewPlaylist = (
    name: string,
    trackIds: readonly string[] = [],
  ) => {
    const id = nanoid()

    const newPlaylist: Playlist = {
      type: MusicItemType.PLAYLIST,
      id,
      name,
      dateCreated: Date.now(),
      trackIds: [...trackIds],
    }

    setState('playlists', id, newPlaylist)
  }

  const renamePlaylist = (id: string, name: string) => {
    setState('playlists', id, 'name', name)
  }

  const addTracksToPlaylist = (
    playlistId: string,
    trackIds: readonly string[],
  ) => {
    setState('playlists', playlistId, 'trackIds', (existing) =>
      mergeToUniqueArray(existing, trackIds),
    )
  }

  const removeTracksFromPlaylist = (
    playlistId: string,
    trackIds: readonly string[],
  ) => {
    setState('playlists', playlistId, 'trackIds', (existing) =>
      existing.filter((id) => !trackIds.includes(id)),
    )
  }

  const favoriteTrack = (trackId: string) => {
    setState('favorites', (existing) =>
      mergeToUniqueArray(existing, [trackId]),
    )
  }

  const unfavoriteTrack = (trackId: string) => {
    setState('favorites', (existing) =>
      existing.filter((id) => id !== trackId),
    )
  }

  return {
    createNewPlaylist,
    renamePlaylist,
    addTracksToPlaylist,
    removeTracksFromPlaylist,
    favoriteTrack,
    unfavoriteTrack,
  }
}
