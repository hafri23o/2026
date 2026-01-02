import { createContext, ParentComponent, useContext } from 'solid-js'

import { createEntitiesStore } from '~/stores/entities/create-entities-store'
import { createLibraryStore } from '~/stores/library/create-library-store'
import { createPlayerStore } from '~/stores/player/create-player-store'
import {
  PersistStoresProvider,
  PersistStoresProps,
} from '~/stores/persist-stores'

/**
 * Generic helper to create a strongly typed Solid context store
 * compatible with strict TypeScript settings.
 */
function createStoreCtx<T>(createStoreFn: () => T) {
  const StoreContext = createContext<T | undefined>(undefined)

  const Provider: ParentComponent = (props) => {
    const store = createStoreFn()

    return (
      <StoreContext.Provider value={store}>
        {props.children}
      </StoreContext.Provider>
    )
  }

  const useStore = (): T => {
    const ctx = useContext(StoreContext)
    if (!ctx) {
      throw new Error(
        'Store context was used outside of its corresponding Provider',
      )
    }
    return ctx
  }

  return [Provider, useStore] as const
}

/* ------------------------------------------------------------------ */
/* Stores                                                             */
/* ------------------------------------------------------------------ */

const [EntitiesProvider, useEntitiesStore] =
  createStoreCtx(createEntitiesStore)

const [LibraryProvider, useLibraryStore] =
  createStoreCtx(createLibraryStore)

const [PlayerProvider, usePlayerStore] =
  createStoreCtx(createPlayerStore)

export { useEntitiesStore, useLibraryStore, usePlayerStore }

/* ------------------------------------------------------------------ */
/* Persistence setup                                                   */
/* ------------------------------------------------------------------ */

// ⚠️ Only change when persisted data structure changes
const APP_STORAGE_VERSION = 1
const APP_STORAGE_NAME = 'APP_DATA'

export const RootStoresProvider: ParentComponent<
  Pick<PersistStoresProps, 'onLoad'>
> = (props) => {
  return (
    <EntitiesProvider>
      <LibraryProvider>
        <PlayerProvider>
          <PersistStoresProvider
            storageName={APP_STORAGE_NAME}
            version={APP_STORAGE_VERSION}
            useStores={[
              useEntitiesStore,
              useLibraryStore,
              usePlayerStore,
            ]}
            onLoad={props.onLoad}
          >
            {props.children}
          </PersistStoresProvider>
        </PlayerProvider>
      </LibraryProvider>
    </EntitiesProvider>
  )
}
