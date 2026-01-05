import { onCleanup, Show, JSX, useContext, createMemo } from 'solid-js'
import { ImageType, MusicItemType } from '~/types/types' // Use correct alias for types
import { FAVORITES_ID } from '~/types/constants' // Use correct alias for constants
import { ICON_PATHS } from '~/icon/icon-paths' // Correct import path for icons
import { MusicImagesContext } from '~/components/data-context' // Correct import path for context
import { clx } from '~/utils' // Ensure correct alias for utility functions
import * as styles from './music-image.css' // Correct path for CSS styles

export interface MusicImageProps {
  class?: string
  item?: {
    id: string
    type: MusicItemType
    image?: ImageType
  }
}

// Function to get the icon type based on the music item type
const getIconType = (item?: MusicImageProps['item']) => {
  switch (item?.type) {
    case MusicItemType.ARTIST:
      return 'person'
    case MusicItemType.PLAYLIST: {
      if (item.id === FAVORITES_ID) {
        return 'favorite'
      }
      return 'playlist'
    }
    default:
      return 'album'
  }
}

// Main component for displaying the music image
export const MusicImage = (props: MusicImageProps): JSX.Element => {
  const context = useContext(MusicImagesContext)

  // Use a unique symbol to track the user for cleanup
  const userKey = Symbol('key')

  // Memoize the item object for performance
  const item = () => props.item

  // Create a memoized value for the image URL
  const imageURL = createMemo(() => {
    const itm = item()
    const image = itm && itm.type !== MusicItemType.PLAYLIST && itm.image

    // Cleanup when the component is unmounted or when the image is no longer needed
    onCleanup(() => {
      if (image && typeof image !== 'string') {
        context?.release(image, userKey)
      }
    })

    // If the image is a string URL, use it directly
    if (typeof image === 'string') {
      return image
    }

    // If the image is a Blob, use the context to get an object URL
    return (image && context?.get(image, userKey)) || null
  })

  // Create a style object with the background image for the music image
  const style = () => {
    const url = imageURL()
    return {
      'background-image': url ? `url(${url})` : '', // Set the background image if URL exists
    }
  }

  // Get the path for the icon based on the music item
  const path = () => {
    const itm = item()
    if (!itm) {
      return ''
    }
    return ICON_PATHS[getIconType(itm)] // Return the correct path for the icon
  }

  return (
    // Use SVG to maintain the aspect ratio for the image
    <svg
      style={style()}
      class={clx(
        styles.musicImage,
        props.class,
        item()?.type === MusicItemType.ARTIST && styles.round // Apply round style for artists
      )}
      viewBox='-2 -2 28 28'
      aria-label='Artwork'
    >
      {/* Show the icon if no image is available */}
      <Show when={imageURL() === null}>
        <path d={path()} />
      </Show>
    </svg>
  )
}
