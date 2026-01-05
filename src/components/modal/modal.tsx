import { For, onCleanup, ParentComponent, Show } from 'solid-js' // Solid.js hooks and components
import '@a11y/focus-trap' // Importing the focus trap package for accessibility
import { ScrollContainer } from '~/components/scroll-container/scroll-container' // Updated path using alias '~'
import { KeyboardCode } from '~/utils/key-codes' // Updated path using alias '~'
import * as styles from './modal.css' // Importing modal styles (compatible with @vanilla-extract)

export interface ModalButton {
  type: 'confirm' | 'cancel'
  title: string
  disabled?: boolean
}

export interface ModalProps {
  title: string
  onConfirm?: () => void
  onCancel?: () => void
  buttons?: ModalButton[]
}

export const Modal: ParentComponent<ModalProps> = (props) => {
  const cancel = () => {
    props.onCancel?.() // Calls onCancel prop if defined
  }

  const confirm = () => {
    props.onConfirm?.() // Calls onConfirm prop if defined
  }

  const onKeyDownHandler = (e: KeyboardEvent) => {
    if (e.code === KeyboardCode.ESC) {
      cancel() // Calls cancel if the ESC key is pressed
    }
  }

  // Set up event listener for keydown (ESC key to cancel)
  window.addEventListener('keydown', onKeyDownHandler)
  onCleanup(() => {
    window.removeEventListener('keydown', onKeyDownHandler) // Clean up listener on component unmount
  })

  return (
    <focus-trap class={styles.modal}>
      <div class={styles.header}>
        <h1 class={styles.title}>{props.title}</h1>
      </div>
      <ScrollContainer class={styles.content}>{props.children}</ScrollContainer>
      <Show when={props.buttons}>
        <div class={styles.bottomButtons}>
          <For each={props.buttons || []}>
            {(button) => (
              <button
                class={styles.flatButton}
                disabled={button.disabled}
                onClick={() => {
                  if (button.type === 'cancel') {
                    cancel() // Trigger cancel on click
                  }
                  if (button.type === 'confirm') {
                    confirm() // Trigger confirm on click
                  }
                }}
              >
                {button.title} {/* Button title based on the button object */}
              </button>
            )}
          </For>
        </div>
      </Show>
    </focus-trap>
  )
}
