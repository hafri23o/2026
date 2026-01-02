// IndexedDB-based audio cache for persistent storage

const DB_NAME = 'AudioCache'
const DB_VERSION = 1
const STORE_NAME = 'audio'

interface AudioCacheEntry {
  url: string
  blob: Blob
  timestamp: number
  contentType: string
}

let dbPromise: Promise<IDBDatabase> | null = null

// Open the IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' })
      store.createIndex('timestamp', 'timestamp', { unique: false })
    }
  })

  return dbPromise
}

// Add or update an audio entry in the cache
const cacheAudio = async (url: string, blob: Blob, contentType: string): Promise<void> => {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  const entry: AudioCacheEntry = {
    url,
    blob,
    timestamp: Date.now(),
    contentType,
  }

  store.put(entry)

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

// Retrieve audio from the cache by URL
const getCachedAudio = async (url: string): Promise<AudioCacheEntry | undefined> => {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readonly')
  const store = transaction.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const request = store.get(url)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Delete audio from the cache by URL
const deleteCachedAudio = async (url: string): Promise<void> => {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  store.delete(url)

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

// Clear the entire audio cache
const clearCache = async (): Promise<void> => {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  store.clear()

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export { cacheAudio, getCachedAudio, deleteCachedAudio, clearCache }
