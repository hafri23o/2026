import { ParentComponent, createMemo, VoidComponent } from 'solid-js'
import { VirtualContainer, VirtualItemProps } from '@minht11/solid-virtual-container'
import { FAVORITES_ID } from '~/types/constants' // Use path alias
import { Icon } from '~/components/icon/icon' // Use path alias
import { useEntitiesStore } from '~/stores/stores' // Use path alias
import { useModals } from '~/components/modals/modals' // Use path alias
import { MusicItemType } from '~/types/types' // Use path alias
import { ListItem } from '~/components/list-item/list-item' // Fixed typo in import path

interface PlaylistItem extends VirtualItemProps<string> {
  onClick: () => void
  onContextMenu?: (e: MouseEvent) => void
  isSelected?: boolean
  disableMenu?: boolean
}

const PlaylistListItem: VoidComponent<PlaylistItem> = (props) => {
  const [entities, entitiesActions] = useEntitiesStore()
  const modals = useModals()

  const isFavorites = () => props.item === FAVORITES_ID

  const getMenuItems = () => [
    {
      name: 'Rename',
      action: () =>
        modals.createOrRenamePlaylist.show({
          type: 'rename',
          playlistId: props.item,
        }),
    },
    {
      name: 'Remove',
      action: () => entitiesActions.remove(props.item, MusicItemType.PLAYLIST),
    },
  ]

  const item = createMemo(() => {
    if (isFavorites()) {
      return {
        icon: 'favorite',
        name: 'Favorites',
      } as const
    }

    return {
      icon: 'playlist',
      name: entities.playlists[props.item]?.name,
    } as const
  })

  return (
    <ListItem
      onClick={props.onClick}
      getMenuItems={getMenuItems}
      disableMenu={props.disableMenu || isFavorites()}
      style={props.style}
      tabIndex={props.tabIndex}
      icon={<Icon icon={item().icon} />}
      text={item().name}
    />
  )
}

export interface PlaylistListProps {
  hideFavorites?: boolean
  disableMenu?: boolean
  selectedId?: string
  onItemClick?: (id: string, index: number) => void
  items: readonly string[]
}

export const PlaylistList: ParentComponent<PlaylistListProps> = (props) => {
  const playlistsIds = createMemo(() => {
    const { items } = props

    if (props.hideFavorites) {
      return items
    }

    return [FAVORITES_ID, ...items]
  })

  return (
    <VirtualContainer itemSize={{ height: 56 }} items={playlistsIds()}>
      {(itemProps) => (
        <PlaylistListItem
          {...itemProps}
          disableMenu={props.disableMenu}
          isSelected={props.selectedId === itemProps.item}
          onClick={() => props.onItemClick?.(itemProps.item, itemProps.index)}
        />
      )}
    </VirtualContainer>
  )
}
