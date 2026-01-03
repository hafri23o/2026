/// <reference lib="webworker" />

import { Buffer } from 'buffer'  // Ensure Buffer is properly imported for Web Worker usage
import { parseBuffer as parseMetadata } from 'music-metadata'
import { TrackParseMessage } from '../message-types'
import type { UnknownTrack, FileWrapper } from '../../../types/types'
import { extractColorFromImage } from './color-from-image'

// Ensure globalThis.Buffer is properly set in the worker
globalThis.Buffer = Buffer

declare const self: DedicatedWorkerGlobalScope  // Ensure the worker scope is correctly typed

// This limit is a bit arbitrary, but it's a reasonable default for large media files.
const FILE_SIZE_LIMIT_500MB = 5e8

// Function to parse a single track's metadata
const parseTrack = async (
  fileWrapper: FileWrapper
): Promise<UnknownTrack | null> => {
  try {
    const file =
      fileWrapper.type === 'file'
        ? fileWrapper.file
        : await fileWrapper.file.getFile()

    // Ignore files larger than 500MB to avoid performance issues
    if (file.size > FILE_SIZE_LIMIT_500MB) {
      return null
    }

    // Read the file into an ArrayBuffer and then into a Uint8Array
    const fileBuffer = await new Response(file).arrayBuffer()
    const fileUint8 = new Uint8Array(fileBuffer)

    // Parse metadata using music-metadata
    const tags = await parseMetadata(fileUint8, {
      mimeType: file.type,
      path: file.name,
      size: file.size,
    }, {
      duration: true,
    })

    const { common } = tags

    // If there is album artwork, convert it into a Blob object
    let imageBlob: Blob | undefined
    if (common.picture?.length) {
      const [image] = common.picture
      const imageData = new Uint8ClampedArray(image.data)
      imageBlob = new Blob([imageData], { type: image.type })
    }

    // Assemble the track data
    const trackData: UnknownTrack = {
      name: common.title || file.name,
      album: common.album,
      artists: common.artists || [],
      genre: common.genre || [],
      trackNo: common.track.no || 0,
      trackOf: common.track.of || 0,
      year: common.year?.toString(),
      image: imageBlob,
      description: (common as any)?.lyrics?.join?.('\n')?.trim() || undefined,
      duration: tags.format.duration || 0,
      fileWrapper,
      primaryColor: imageBlob && (await extractColorFromImage(imageBlob)),
    }

    return trackData
  } catch (err) {
    // Log errors but don't let them stop the worker
    console.error('Error parsing track:', err)
    return null
  }
}

// Function to send messages from the worker to the main thread
const sendMsg = (options: TrackParseMessage) => {
  self.postMessage(options)
}

// Main function to parse all tracks in the provided input files
const parseAllTracks = async (inputFiles: FileWrapper[]) => {
  let parsedCount = 0
  const tracks: UnknownTrack[] = []

  // Iterate over all input files and parse each one
  for await (const file of inputFiles) {
    const metadata = await parseTrack(file)
    if (metadata) {
      parsedCount += 1
      sendMsg({ finished: false, parsedCount })
      tracks.push(metadata)
    }
  }

  // Send final message indicating that parsing is finished
  sendMsg({ finished: true, parsedCount, tracks })
  
  // Close the worker once all files are parsed
  self.close()
}

// Event listener to start parsing when the worker receives a message
self.addEventListener('message', (event: MessageEvent<FileWrapper[]>) => {
  parseAllTracks(event.data)
})
