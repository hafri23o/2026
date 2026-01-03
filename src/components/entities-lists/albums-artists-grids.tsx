import { VoidComponent } from 'solid-js'
// Use path aliases defined in tsconfig.json for cleaner imports
import {
  AlbumsArtistsGrid,
  AlbumsArtistsGridProps as AAGridProps,
} from '~/components/albums-artists-grid/albums-artists-grid' // Updated path alias

// Omit 'type' property from AAGridProps, as it will be passed explicitly
type AlbumsArtistsGridProps = Omit<AAGridProps, 'type'>

// ArtistsGrid component
export const ArtistsGrid: VoidComponent<AlbumsArtistsGridProps> = (props) => (
  <AlbumsArtistsGrid {...props} type="artist" />
)

// AlbumsGrid component
export const AlbumsGrid: VoidComponent<AlbumsArtistsGridProps> = (props) => (
  <AlbumsArtistsGrid {...props} type="album" />
)
