import { FileWrapper } from '../types/types'
import { IS_DEVICE_A_MOBILE, wait } from '../utils/utils'

// Feature detection for Native File System API
export const isNativeFileSystemSupported = 'showDirectoryPicker' in globalThis

// Recursively get files from a directory using the File System API
export const getFileRefsRecursively = async (
  directory: FileSystemDirectoryHandle,
  extensions: string[]
): Promise<FileSystemFileHandle[]> => {
  let files: FileSystemFileHandle[] = []

  // Iterate over the directory contents recursively
  for await (const fileRef of directory.values()) {
    if (fileRef.kind === 'file') {
      // Check if the file extension matches
      const isValidFile = extensions.some((ext) =>
        fileRef.name.endsWith(`.${ext}`)
      )
      if (isValidFile) {
        files.push(fileRef)
      }
    } else if (fileRef.kind === 'directory') {
      // Recursively get files from subdirectories
      files = [...files, ...(await getFileRefsRecursively(fileRef, extensions))]
    }
  }

  return files
}

// Get files from a legacy input event (file input element)
export const getFilesFromLegacyInputEvent = (
  e: Event,
  extensions: string[]
): FileWrapper[] => {
  const { files } = e.target as HTMLInputElement
  if (!files) {
    return []
  }

  // Filter files based on extension and wrap them in a FileWrapper
  return Array.from(files)
    .filter((file) => extensions.some((ext) => file.name.endsWith(`.${ext}`)))
    .map(
      (file): FileWrapper => ({
        type: 'file',
        file,
      })
    )
}

// Get files from directory picker (using Native File System or legacy input)
export const getFilesFromDirectory = async (
  extensions: string[]
): Promise<FileWrapper[] | null> => {
  if (isNativeFileSystemSupported) {
    try {
      // Show directory picker if supported by the browser
      const directory = await showDirectoryPicker()

      // Get files recursively from the directory
      const filesRefs = await getFileRefsRecursively(directory, extensions)
      return filesRefs.map((ref) => ({ type: 'fileRef', file: ref }))
    } catch {
      return null
    }
  }

  // Fallback for mobile devices and unsupported browsers
  const directoryElement = document.createElement('input')
  directoryElement.type = 'file'

  // Mobile devices cannot pick directories, so allow picking multiple files
  if (IS_DEVICE_A_MOBILE) {
    directoryElement.accept = extensions.map((ext) => `.${ext}`).join(', ')
    directoryElement.multiple = true
  } else {
    directoryElement.setAttribute('webkitdirectory', '')
    directoryElement.setAttribute('directory', '')
  }

  // Wait for the user to select files, then handle the file input event
  return new Promise((resolve) => {
    directoryElement.addEventListener('change', (e) => {
      resolve(getFilesFromLegacyInputEvent(e, extensions))
    })

    // In some cases, the event listener might not be registered immediately,
    // so we trigger the click after a short delay.
    wait(100).then(() => {
      directoryElement.click()
    })
  })
}
