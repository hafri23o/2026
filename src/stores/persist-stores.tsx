import { trackStore } from '@solid-primitives/deep'
import {
  createEffect,
  createSignal,
  on,
  Show,
  ParentComponent,
  untrack,
} from 'solid-js'
import { unwrap } from 'solid-js/store'
import {
  createStore as createStoreIDB,
  getMany as getManyIDB,
  set as setIDB,
} from 'idb-keyval'
import { deleteIDBDatabases } from '../helpers/delete-idb-databases'

// Interface for a persisted item with a generic value type
interface PersistedItem<V = unknown> {
  key: string
  selector: () => V
  load: (value: V) => void
}

type UseStore = () => readonly [unknown, unknown, readonly PersistedItem[]]

export interface PersistStoresProps {
  onLoad?: () => void
  storageName: string
  version: number
  useStores: readonly UseStore[]
}

export const PersistStoresProvider: ParentComponent<PersistStoresProps> = (
  props,
) => {
  const persistedItems: readonly PersistedItem[] = props.useStores
    .map((stateFn) => stateFn()[2])
    .filter(Boolean)
    .flat(1)

  const { storageName, version } = props
  const [isLoaded, setIsLoaded] = createSignal(false)

  const fullName = `${storageName}-${version}`
  const storeIDB = createStoreIDB(fullName, fullName)

  // Delete previous IDB versions for cleanup
  deleteIDBDatabases(storageName, version)

  const persistedKeys = persistedItems.map((t) => t.key)

  // Load persisted items from IndexedDB initially
  const setInitiallyLoadedState = (values: unknown[]) => {
    values.forEach((value, index) => {
      if (value !== undefined) {
        persistedItems[index].load(value)
      }
    })
  }

  // Asynchronously load persisted values from IndexedDB
  getManyIDB(persistedKeys, storeIDB)
    .then(setInitiallyLoadedState)
    .finally(() => setIsLoaded(true))

  createEffect(
    on(isLoaded, (loaded) => {
      if (!loaded) return

      let skippedSetup = false

      // Listen for changes in persisted items and save them to IDB
      persistedItems.forEach((item) => {
        createEffect(() => {
          const value: unknown = item.selector()

          // Track changes for complex objects to ensure reactivity
          if (typeof value === 'object' && value !== null) {
            trackStore(item.selector())
          }

          // Save changes to IndexedDB after initial setup
          if (skippedSetup) {
            setIDB(item.key, unwrap(value), storeIDB)
          }
        })
      })

      // Ensure setup is skipped on the first render
      createEffect(() => {
        skippedSetup = true
      })

      // Callback after loading the persisted data
      props.onLoad?.()
    }),
  )

  // Only render children when data is fully loaded from IndexedDB
  return <Show when={isLoaded()}>{props.children}</Show>
}
