import { Album, MusicItemType, Playlist, Track } from '~/types/types'; // Use path alias to resolve types
import { State as EntitiesState } from '~/stores/entities/create-entities-store'; // Use path alias for stores
import { FAVORITES_ID } from '~/types/constants'; // Path alias to constants
import { useModals } from '~/components/modals/modals'; // Path alias for modals component
import { MenuItem } from '~/components/menu/types'; // Path alias for menu types
import { useEntitiesStore } from '~/stores/stores'; // Path alias for stores
import * as configs from '~/base-page-configs'; // Path alias for base configs

type EntitiesActions = ReturnType<typeof useEntitiesStore>[1]; // Extract actions from store

// Define the DetailsPageConfig interface with proper typings for each field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DetailsPageConfig<T = any> extends configs.BaseConfig {
  type: Exclude<MusicItemType, typeof MusicItemType.TRACK>;
  itemSelector?: (id: string, state: EntitiesState) => T;
  label?: (item: T) => string;
  info?: (item: T) => string[];
  additionalMenuItems?: (item: T, actions: EntitiesActions) => MenuItem[];
  additionalTrackMenuItems?: (
    item: T,
    track: Track,
    actions: EntitiesActions
  ) => MenuItem[];
  showTrackIndex?: boolean;
  sortTrackByKey?: keyof Track;
}

// Playlist config with type safety
const PLAYLISTS_CONFIG: DetailsPageConfig<Playlist> = {
  ...configs.BASE_PLAYLISTS_CONFIG,
  itemSelector: (id: string, entities: EntitiesState) => {
    if (id !== FAVORITES_ID) {
      return undefined;
    }

    const item: Omit<Playlist, 'dateCreated'> = {
      id,
      type: MusicItemType.PLAYLIST,
      name: 'Favorites',
      trackIds: entities.favorites,
    };

    return item;
  },
  additionalMenuItems: (item: Playlist) => [
    {
      name: 'Rename playlist',
      action: () => {
        const modals = useModals();
        modals.createOrRenamePlaylist.show({
          playlistId: item.id,
          type: 'rename',
        });
      },
    },
  ],
};

// Base configuration for different music items, including artists, albums, and playlists
const BASE_DETAILS_PAGES_CONFIG: readonly DetailsPageConfig[] = [
  {
    ...configs.BASE_ARTISTS_CONFIG,
    sortTrackByKey: 'name', // Sorting artists by name
  },
  {
    ...configs.BASE_ALBUMS_CONFIG,
    label: (item: Album) => item.artists.join(', '), // Label for albums: artist names
    info: (item: Album) => [item.year].filter(Boolean) as string[], // Info: album year
    showTrackIndex: true, // Show track index for albums
    sortTrackByKey: 'trackNo', // Sorting albums by track number
  },
  {
    ...PLAYLISTS_CONFIG,
    additionalTrackMenuItems: (item: Playlist, track, actions) => [
      {
        name: 'Remove from playlist',
        action: () => actions.removeTracksFromPlaylist(item.id, [track.id]),
      },
    ],
  },
];

// Final config with corrected paths (singular form) for details pages
export const DETAILS_PAGES_CONFIG: readonly DetailsPageConfig[] =
  BASE_DETAILS_PAGES_CONFIG.map((page) => ({
    ...page,
    path: page.path.slice(0, -1), // Remove the last character 's' to ensure singular path
    name: page.path.slice(0, -1), // Remove the last character 's' from the name
  })) as DetailsPageConfig[];
