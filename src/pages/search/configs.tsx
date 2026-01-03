import { BaseMusicItem, Track } from '~/types/types' // Use path alias for types
import * as configs from '~/base-page-configs' // Use path alias for base page configs
import { fuzzyFilterTracks, fuzzyFilterByName } from '~/helpers/fuzzy-search' // Use path alias for helpers

// Path for search with an optional search term
export const SEARCH_MAIN_PATH = '/search/:searchTerm?'

export interface SearchPageConfig extends configs.BaseConfig {
  // Filter function type for search, accepting a string and an array of items
  filter: (term: string, items: any[]) => any[]
}

// Fuzzy search for tracks: searches across name, artist, album, description, and topics
const fuzzyFilterForTracks = (term: string, tracks: Track[]): Track[] => {
  return fuzzyFilterTracks(term, tracks) // Uses helper function for fuzzy searching
}

// Fuzzy search for items (tracks, artists, albums, etc.) by name
const fuzzyFilterForName = <T extends BaseMusicItem>(term: string, items: T[]): T[] => {
  return fuzzyFilterByName(term, items) // Uses helper function for fuzzy searching
}

// Configuration for different search types
export const CONFIGS: readonly SearchPageConfig[] = [
  {
    ...configs.BASE_TRACKS_CONFIG, // Destructure the base config for tracks
    filter: fuzzyFilterForTracks, // Apply the tracks-specific filter
  },
  {
    ...configs.BASE_ARTISTS_CONFIG, // Destructure the base config for artists
    filter: fuzzyFilterForName, // Apply the name-based filter
  },
  {
    ...configs.BASE_ALBUMS_CONFIG, // Destructure the base config for albums
    filter: fuzzyFilterForName, // Apply the name-based filter
  },
  {
    ...configs.BASE_PLAYLISTS_CONFIG, // Destructure the base config for playlists
    filter: fuzzyFilterForName, // Apply the name-based filter
  },
] as const // Use `const` assertion to keep the array readonly
