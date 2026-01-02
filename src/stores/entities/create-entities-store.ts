import { batch } from 'solid-js'
import { createStore, produce, SetStoreFunction } from 'solid-js/store'
import { nanoid } from 'nanoid'

import { getFilesFromDirectory } from '../../helpers/file-system'
import { tracksParser } from '../../helpers/tracks-file-parser/tracks-file-parser'

import {
  Track,
  Album,
  Artist,
  Playlist,
  MusicItemType,
  UnknownTrack,
  FileWrapper,
} from '../../types/types'

import { UNKNOWN_ITEM_ID } from '../../types/constants'
import { createPlaylistsActions } from './create-playlists-actions'
import { toast } from '~/components/toast/toast'
import { getStaticContentData } from '../../content/content-adapter'

/* =========================================================
 * State
 * ======================================================= */

export interface State {
  tracks: Record<string, Track>
  albums: Record<string, Album>
  artists: Record<string, Artist>
  playlists: Record<string, Playlist>
  favorites: string[]
}

export type SetState = SetStoreFunction<State>

/* =========================================================
 * Store
 * ======================================================= */

export const createEntitiesStore = () => {
  const [state, setState] = createStore<State>({
    tracks: {},
    albums: {},
    artists: {},
    playlists: {},
    favorites: [],
  })

  const playlistsActions = createPlaylistsActions(setState)

  /* =======================================================
   * Static content
   * ===================================================== */

  const loadStaticContent = () => {
    try {
      const staticData = getStaticContentData()

      batch(() => {
        setState('tracks', staticData.tracks)
        setState('albums', staticData.albums)
        setState('artists', staticData.artists)
        setState('playlists', staticData.playlists)
        setState('favorites', staticData.favorites)
      })
    } catch (error) {
      console.error('Error loading static content:', error)
      toast({
        message: 'Failed to load content library',
        duration: 5000,
      })
    }
  }

  loadStaticContent()

  /* =======================================================
   * Helpers
   * ===================================================== */

  const fileEquals = async (
    a: FileWrapper,
    b: FileWrapper,
  ): Promise<boolean> => {
    if (a.kind === 'fileRef' && b.kind === 'fileRef') {
      return a.file.name === b.file.name && a.file.isSameEntry(b.file)
    }

    if (a.kind === 'file' && b.kind === 'file') {
      return a.file.name === b.file.name && a.file.size === b.file.size
    }

    return false
  }

  const filterExistingTracks = async (
    newTracks: readonly UnknownTrack[],
  ): Promise<UnknownTrack[]> => {
    const existingTracks = Object.values(state.tracks)
    const unique: UnknownTrack[] = []

    for (const newTrack of newTracks) {
      let foundIndex = -1

      for (let i = 0; i < existingTracks.length; i += 1) {
        if (
          await fileEquals(
            newTrack.fileWrapper,
            existingTracks[i].fileWrapper,
          )
        ) {
          foundIndex = i
          break
        }
      }

      if (foundIndex === -1) {
        unique.push(newTrack)
      } else {
        existingTracks.splice(foundIndex, 1)
      }
    }

    return unique
  }

  /* =======================================================
   * Mutations
   * ===================================================== */

  const removeTracks = (trackIds: readonly string[]) => {
    batch(() => {
      for (const trackId of trackIds) {
        const track = state.tracks[trackId]
        if (!track) continue

        const filterIds = (ids: readonly string[]) =>
          ids.filter((id) => id !== trackId)

        setState('tracks', trackId, undefined)

        setState(
          'albums',
          track.album ?? UNKNOWN_ITEM_ID,
          'trackIds',
          filterIds,
        )

        for (const artistId of track.artists ?? [UNKNOWN_ITEM_ID]) {
          setState('artists', artistId, 'trackIds', filterIds)
        }

        setState('favorites', filterIds)
      }

      for (const playlist of Object.values(state.playlists)) {
        setState(
          'playlists',
          playlist.id,
          'trackIds',
          playlist.trackIds.filter((id) => !trackIds.includes(id)),
        )
      }
    })
  }

  const addNewTracks = async (tracks: readonly UnknownTrack[]) => {
    const uniqueTracks = await filterExistingTracks(tracks)

    setState(
      produce((s) => {
        for (const track of uniqueTracks) {
          const id = nanoid()
          s.tracks[id] = {
            ...track,
            id,
            type: MusicItemType.TRACK,
          }
        }

        for (const track of Object.values(s.tracks)) {
          const trackId = track.id
          const albumId = track.album ?? UNKNOWN_ITEM_ID

          const album =
            s.albums[albumId] ??
            (s.albums[albumId] = {
              type: MusicItemType.ALBUM,
              id: albumId,
              name: albumId,
              artists: [],
              trackIds: [],
            })

          if (albumId !== UNKNOWN_ITEM_ID) {
            album.image ??= track.image
            album.year ??= track.year
          }

          if (!album.trackIds.includes(trackId)) {
            album.trackIds.push(trackId)
          }

          for (const artist of track.artists) {
            if (!album.artists.includes(artist)) {
              album.artists.push(artist)
            }
          }

          const artistNames =
            track.artists.length > 0
              ? track.artists
              : [UNKNOWN_ITEM_ID]

          for (const artistId of artistNames) {
            const artist =
              s.artists[artistId] ??
              (s.artists[artistId] = {
                type: MusicItemType.ARTIST,
                id: artistId,
                name: artistId,
                trackIds: [],
              })

            if (!artist.trackIds.includes(trackId)) {
              artist.trackIds.push(trackId)
            }
          }
        }
      }),
    )
  }

  /* =======================================================
   * Import
   * ===================================================== */

  const importTracks = async () => {
    const files = await getFilesFromDirectory([
      'aac',
      'mp3',
      'ogg',
      'wav',
      'flac',
      'm4a',
      'opus',
    ])

    if (!files || files.length === 0) {
      toast({ message: 'Selected directory does not contain any tracks.' })
      return
    }

    const toastID = nanoid()

    toast({
      id: toastID,
      duration: false,
      message: 'Preparing to import tracks.',
      controls: false,
    })

    try {
      const newTracks = await tracksParser(files, (count) => {
        toast({
          id: toastID,
          duration: false,
          message: `Importing tracks ${count} / ${files.length}`,
          controls: 'spinner',
        })
      })

      batch(() => {
        addNewTracks(newTracks)
        toast({
          id: toastID,
          duration: 8000,
          message: `Successfully imported ${newTracks.length} tracks.`,
        })
      })
    } catch (error) {
      console.error(error)
      toast({
        id: toastID,
        message: 'An error occurred while importing tracks.',
      })
    }
  }

  const clearData = () => {
    toast({ message: 'Library cleared' })
    setState({
      tracks: {},
      albums: {},
      artists: {},
      playlists: {},
      favorites: [],
    })
  }

  const remove = (
    id: string,
    type: Exclude<MusicItemType, typeof MusicItemType.TRACK>,
  ) => {
    const pathMap = {
      [MusicItemType.ALBUM]: 'albums',
      [MusicItemType.ARTIST]: 'artists',
      [MusicItemType.PLAYLIST]: 'playlists',
    } as const

    const path = pathMap[type]
    const item = state[path][id]

    if (!item) return

    if (path !== 'playlists') {
      removeTracks(item.trackIds)
    }

    setState(path, id, undefined)
  }

  /* =======================================================
   * Public API
   * ===================================================== */

  const actions = {
    ...playlistsActions,
    removeTracks,
    remove,
    importTracks,
    clearData,
  }

  return [
    state,
    actions,
    [
      {
        key: 'data-tracks',
        selector: () => state.tracks,
        load: (tracks: State['tracks']) => setState({ tracks }),
      },
      {
        key: 'data-albums',
        selector: () => state.albums,
        load: (albums: State['albums']) => setState({ albums }),
      },
      {
        key: 'data-artists',
        selector: () => state.artists,
        load: (artists: State['artists']) => setState({ artists }),
      },
      {
        key: 'data-playlists',
        selector: () => state.playlists,
        load: (playlists: State['playlists']) => setState({ playlists }),
      },
      {
        key: 'data-favorites',
        selector: () => state.favorites,
        load: (favorites: State['favorites']) => setState({ favorites }),
      },
    ],
  ] as const
}
