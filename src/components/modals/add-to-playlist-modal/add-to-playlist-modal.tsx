import { createMemo, createSignal, Show } from 'solid-js'
import { useEntitiesStore } from '~/stores/stores'  // Adjusted path using alias
import { Modal } from '~/components/modal/modal'  // Adjusted path using alias
import { PlaylistList } from '~/components/entities-lists/playlists-list/playlists-list'  // Adjusted path using alias
import { InternalModalProps } from '~/components/types'  // Adjusted path using alias
import { MessageBanner } from '~/components/message-banner/message-banner'  // Adjusted path using alias

export interface AddToPlaylistModalProps extends InternalModalProps {
  trackIds: readonly string[]
}

const AddToPlaylistModal = (props: AddToPlaylistModalProps) => {
  const [entities, entitiesActions] = useEntitiesStore()
  const [selected, setSelected] = createSignal<string>()

  const onConfirm = () => {
    const id = selected()
    if (id) {
      entitiesActions.addTracksToPlaylist(id, props.trackIds)
      props.close()
    }
  }

  const onItemClick = (id: string) => {
    setSelected(id)
  }

  // The `entities.playlists` should be an object with string keys, making sure that the typing matches
  const items = createMemo(() => Object.keys(entities.playlists))

  return (
    <Modal
      title='Add to playlist'
      onCancel={props.close}
      onConfirm={onConfirm}
      buttons={[
        { type: 'cancel', title: 'Cancel' },
        { type: 'confirm', title: 'Add', disabled: !selected() },
      ]}
    >
      <Show
        when={items().length}
        fallback={<MessageBanner message='No Playlists' />}
      >
        <PlaylistList
          hideFavorites
          disableMenu
          items={items()}  // Ensure we pass the array of playlist IDs
          selectedId={selected()}
          onItemClick={onItemClick}
        />
      </Show>
    </Modal>
  )
}

export default AddToPlaylistModal
