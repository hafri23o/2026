import { ParentComponent, createContext } from 'solid-js';

// Define the type for storing image data
interface ImageDate {
  url: string;
  users: Set<symbol>;
}

// Define the props for the ImagesData functions (get and release)
type ImagesDataProps = {
  get(blob: Blob, userKey: symbol): string;
  release(blob: Blob, userKey: symbol): void;
};

// Create a context for music images, providing get and release functions
export const MusicImagesContext = createContext<ImagesDataProps>();

// MusicImagesProvider component: manages the context and logic for image caching and memory management
export const MusicImagesProvider: ParentComponent = (props) => {
  // A weak map to store the images associated with blobs
  const musicImagesMap = new WeakMap<Blob, ImageDate>();
  
  // A queue to manage blobs that need to be cleaned up
  const releaseQueue = new Set<Blob>();

  // Timeout ID for the release queue cleanup
  let releaseQueueTimeoutID: number | null = null;

  // Function to clean up memory by removing unused blobs from the map
  const freeUpMemory = () => {
    for (const blob of releaseQueue.keys()) {
      const data = musicImagesMap.get(blob);
      if (data && data.users.size === 0) {
        musicImagesMap.delete(blob);
      }
    }
    releaseQueue.clear();
  };

  // Function to release a blob from the users' set and add it to the cleanup queue
  const release = (blob: Blob, userKey: symbol) => {
    const data = musicImagesMap.get(blob);
    if (!data) {
      return;
    }

    data.users.delete(userKey);
    releaseQueue.add(blob);

    // If no cleanup is scheduled, set a timeout to free up memory
    if (releaseQueueTimeoutID === null) {
      releaseQueueTimeoutID = window.setTimeout(() => {
        releaseQueueTimeoutID = null;
        freeUpMemory();
      }, 4000);
    }
  };

  // Function to get the image URL from a blob, or create one if it doesn't exist
  const get = (blob: Blob, userKey: symbol) => {
    const data = musicImagesMap.get(blob);
    if (data) {
      data.users.add(userKey);
      return data.url;
    }

    // If no existing URL, create a new one and store it in the map
    const imageURL = URL.createObjectURL(blob);
    musicImagesMap.set(blob, {
      url: imageURL,
      users: new Set([userKey]),
    });
    return imageURL;
  };

  return (
    <MusicImagesContext.Provider value={{ get, release }}>
      {props.children}
    </MusicImagesContext.Provider>
  );
};
