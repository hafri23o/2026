import { useNavigate } from 'solid-app-router'  // Correct import from solid-app-router
import { For } from 'solid-js'  // Correct import for For from Solid.js
import { useEntitiesStore } from '~/stores/stores'  // Updated path with alias ~
import { List } from '~/components/list/list'  // Updated path with alias ~
import { Modal } from '~/components/modal/modal'  // Updated path with alias ~
import { InternalModalProps } from '~/components/types'  // Updated path with alias ~
import * as sharedStyles from '~/styles/shared.css'  // Updated path with alias ~


export interface ViewArtistsModalProps extends InternalModalProps {
  artistsIds: readonly string[]  // Defining prop type for artist IDs
}

const ViewArtistsModal = (props: ViewArtistsModalProps) => {
  const navigate = useNavigate()  // Use navigate from solid-app-router

  const [entities] = useEntitiesStore()  // Get entities from store
  const { artists } = entities  // Destructure artists from the store

  const onItemClickHandler = (id: string) => {
    props.close()  // Close the modal when an item is clicked
    navigate(`/artist/${encodeURIComponent(id)}`)  // Navigate to artist page
  }

  return (
    <Modal
      title='View Artists'  // Modal title
      onConfirm={() => props.close()}  // Confirm handler, just close the modal
      onCancel={props.close}  // Cancel handler, close the modal
    >
      <List>
        <For each={props.artistsIds}>
          {(id) => (
            <div
              class={sharedStyles.listItem}  // Apply shared list item styles
              onClick={() => onItemClickHandler(id)}  // Attach click handler
            >
              {artists[id]?.name}  {/* Display artist name, safely handle undefined */}
            </div>
          )}
        </For>
      </List>
    </Modal>
  )
}

export default ViewArtistsModal
