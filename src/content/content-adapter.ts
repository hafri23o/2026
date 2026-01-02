import { load as yamlLoad } from 'js-yaml'

import {
  Track,
  Album,
  Artist,
  MusicItemType,
} from '~/types/types'
import { UNKNOWN_ITEM_ID } from '~/types/constants'

import oshoContentYaml from './osho-content.yaml?raw'

/* ------------------------------------------------------------------ */
/* Content structure definitions (YAML → runtime-safe TS types)       */
/* ------------------------------------------------------------------ */

interface ContentTrack {
  id: string
  name: string
  duration: number
  trackNo: number
  audioUrl: string
  description: string
  topics: string[]
}

interface ContentSeries {
  id: string
  name: string
  description: string
  year: string
  image: string
  tracks: ContentTrack[]
}

interface StandaloneTrack extends ContentTrack {
  year: string
}

interface ContentMetadata {
  appName: string
  description: string
  version: string
  lastUpdated: string
  totalTracks: number
  totalSeries: number
  defaultTheme: string
}

interface ContentStructure {
  series: ContentSeries[]
  standalone_talks?: StandaloneTrack[]
  topics?: Array<{
    id: string
    name: string
    description: string
  }>
  metadata: ContentMetadata
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Safe YAML parsing for Vite + strict TS
 */
const parseYAML = (yamlContent: string): ContentStructure => {
  const parsed = yamlLoad(yamlContent)

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid YAML content structure')
  }

  return parsed as ContentStructure
}

/**
 * File wrapper used by the player (URL-based audio)
 * Matches your app’s expected runtime shape
 */
const createUrlFileWrapper = (audioUrl: string) => ({
  type: 'url' as const,
  url: audioUrl,
})

/* ------------------------------------------------------------------ */
/* Transformation                                                     */
/* ------------------------------------------------------------------ */

export const transformContentToAppData = () => {
  const content = parseYAML(oshoContentYaml)

  const tracks: Record<string, Track> = {}
  const albums: Record<string, Album> = {}
  const artists: Record<string, Artist> = {}

  /* ----------------------------- */
  /* Main Artist                   */
  /* ----------------------------- */

  const oshoArtist: Artist = {
    id: 'osho',
    type: MusicItemType.ARTIST,
    name: 'Osho',
    trackIds: [],
  }

  /* ----------------------------- */
  /* Series → Albums               */
  /* ----------------------------- */

  for (const series of content.series) {
    const albumTrackIds: string[] = []

    for (const track of series.tracks) {
      const trackData: Track = {
        id: track.id,
        type: MusicItemType.TRACK,
        name: track.name,
        album: series.name,
        artists: ['Osho'],
        year: series.year,
        duration: track.duration,
        genre: track.topics,
        trackNo: track.trackNo,
        fileWrapper: createUrlFileWrapper(track.audioUrl),
        description: track.description,
        topics: track.topics,
        image: series.image,
      }

      tracks[track.id] = trackData
      albumTrackIds.push(track.id)
      oshoArtist.trackIds.push(track.id)
    }

    albums[series.id] = {
      id: series.id,
      type: MusicItemType.ALBUM,
      name: series.name,
      artists: ['Osho'],
      year: series.year,
      trackIds: albumTrackIds,
      description: series.description,
      image: series.image,
    }
  }

  /* ----------------------------- */
  /* Standalone Talks              */
  /* ----------------------------- */

  if (content.standalone_talks?.length) {
    const standaloneTrackIds: string[] = []

    for (const talk of content.standalone_talks) {
      const trackData: Track = {
        id: talk.id,
        type: MusicItemType.TRACK,
        name: talk.name,
        album: 'Standalone Talks',
        artists: ['Osho'],
        year: talk.year,
        duration: talk.duration,
        genre: talk.topics,
        trackNo: 1,
        fileWrapper: createUrlFileWrapper(talk.audioUrl),
        description: talk.description,
        topics: talk.topics,
      }

      tracks[talk.id] = trackData
      standaloneTrackIds.push(talk.id)
      oshoArtist.trackIds.push(talk.id)
    }

    albums.standalone_talks = {
      id: 'standalone_talks',
      type: MusicItemType.ALBUM,
      name: 'Standalone Talks',
      artists: ['Osho'],
      trackIds: standaloneTrackIds,
      description: 'Individual talks and discourses',
    }
  }

  /* ----------------------------- */
  /* Final Assembly                */
  /* ----------------------------- */

  artists.osho = oshoArtist

  return {
    tracks,
    albums,
    artists,
    playlists: {},
    favorites: [],
    metadata: content.metadata,
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

export const getStaticContentData = () => transformContentToAppData()
