import { createStore } from 'solid-js/store'
import { nanoid } from 'nanoid'

export interface ToastButton {
  title: string
  action?: () => void
}

export interface ToastOptions {
  id?: string
  message: string
  duration?: false | number
  controls?: false | 'spinner' | ToastButton[]
}

// Create the store for holding toasts
const [toasts, setToasts] = createStore<ToastOptions[]>([])

// Export the store so it can be used in other parts of the application
export { toasts }

// Create toast creator function
const createToastCreator = () => {
  const create = (options: ToastOptions): string => {
    let { id } = options

    // Find existing toast if ID is provided
    const toastIndex = id !== undefined ? toasts.findIndex((t) => t.id === id) : -1
    
    if (toastIndex === -1) {
      // If no toast exists, create a new one
      id = id || nanoid()

      const newToast: ToastOptions = {
        ...options,
        id,
      }

      // Add the new toast to the store
      setToasts((t) => [...t, newToast])
    } else {
      // If the toast exists, update it
      setToasts(toastIndex, options)
    }

    return id as string
  }

  // Function to dismiss a toast by ID
  const dismiss = (id: string) => {
    setToasts((t) => t.filter((item) => item.id !== id))
  }

  // Attach the dismiss function to the create function
  create.dismiss = dismiss

  return create
}

// Export the toast creator
export const toast = createToastCreator()
