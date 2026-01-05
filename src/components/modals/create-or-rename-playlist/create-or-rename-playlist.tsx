import { createSignal } from 'solid-js'
import { useEntitiesStore } from '~/stores/stores'  // Updated import with alias
import { Modal } from '~/components/modal/modal'  // Updated import with alias
import { InternalModalProps } from '~/components/types'  // Updated import with alias
import * as styles from '~/styles/shared.css'  // Updated import with alias

// Define interfaces for the props (Create and Rename)
interface RenamePlaylistProps {
  type: 'rename'
  playlistId: string
}

interface CreatePlaylistProps {
  type: 'create'
  playlistId?: undefined
}

// Union type for both create and rename modals
export type CreateRenamePlaylistProps = InternalModalProps &
  (RenamePlaylistProps | CreatePlaylistProps)

const CreateOrRenamePlaylistModal = (props: CreateRenamePlaylistProps) => {
  // Using Solid.js store
  const [entities, entitiesActions] = useEntitiesStore()
  const [name, setName] = createSignal('')

  // Helper function to determine whether the modal is for creating a new playlist
  const isCreateType = () => props.type === 'create'

  // Handler for confirming the modal action
  const onConfirmHandler = () => {
    if (isCreateType()) {
      entitiesActions.createNewPlaylist(name())
    } else {
      const { playlistId } = props as RenamePlaylistProps // Narrow the type for rename action
      entitiesActions.renamePlaylist(playlistId, name())
    }
    props.close()
  }

  return (
    <Modal
      title={`${isCreateType() ? 'Create new' : 'Rename'} playlist`}
      onConfirm={onConfirmHandler}
      onCancel={props.close}
      buttons={[
        { type: 'cancel', title: 'Cancel' },
        {
          type: 'confirm',
          title: isCreateType() ? 'Create' : 'Save',
          disabled: !name(),
        },
      ]}
    >
      <input
        value={
          !isCreateType()
            ? entities.playlists[(props as RenamePlaylistProps).playlistId].name
            : ''
        }
        type='text'
        placeholder='Enter new playlist name'
        class={styles.textField}  // Ensure styles are applied correctly
        onInput={(e: InputEvent) =>
          setName((e.target as HTMLInputElement).value)
        }
      />
    </Modal>
  )
}

export default CreateOrRenamePlaylistModal
