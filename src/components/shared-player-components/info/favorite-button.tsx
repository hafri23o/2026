import { createMemo, JSXElement } from 'solid-js'
import { IconButton } from '~/components/icon-button/icon-button'
import { useEntitiesStore, usePlayerStore } from '~/stores/stores'
import * as styles from './info.css'

export const FavoriteButton = (): JSXElement => {
  // Accessing store states
  const [dataState, dataActions] = useEntitiesStore()
  const [playerState] = usePlayerStore()

  // Memoized value to get the active track
  const aTrack = () => playerState.activeTrack

  // Memoized computation to check if the track is favorited
  const isFavorited = createMemo(() => 
    dataState.favorites.includes(playerState.activeTrackId)
  )

  // Handler for the favorite button click
  const onFavoriteBtnClickHandler = () => {
    const trackId = aTrack()?.id
    if (!trackId) return

    // If the track is already favorited, unfavorite it; otherwise, favorite it
    if (isFavorited()) {
      dataActions.unfavoriteTrack(trackId)
    } else {
      dataActions.favoriteTrack(trackId)
    }
  }

  return (
    <IconButton
      class={styles.infoFavoriteBtn} // applying styles via vanilla-extract
      title={isFavorited() ? 'Remove from Favorites' : 'Add to Favorites'}
      icon={isFavorited() ? 'favorite' : 'favoriteOutline'}
      onClick={onFavoriteBtnClickHandler}
      disabled={!aTrack()} // Disable if no active track
    />
  )
}
