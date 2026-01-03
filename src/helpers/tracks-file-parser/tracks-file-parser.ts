import { FileWrapper, UnknownTrack } from '../../types/types'
import { TrackParseMessage } from './message-types'

// Define the callback type for when a track is parsed
export type TrackParsedFn = (totalParsedCount: number) => void

export const tracksParser = async (
  files: FileWrapper[],
  trackParsed: TrackParsedFn,
): Promise<UnknownTrack[]> => {
  // Dynamically import the worker module with `?worker&inline` for Vite support
  const TrackWorkerModule = await import(
    './worker/tracks-file-parser-worker?worker&inline'
  )
  const TrackWorker = TrackWorkerModule.default

  return new Promise((resolve, reject) => {
    const worker = new TrackWorker()

    // Handle any worker errors
    worker.addEventListener('error', reject)

    // Handle worker messages and progress
    worker.addEventListener(
      'message',
      ({ data }: MessageEvent<TrackParseMessage>) => {
        if (data.finished) {
          resolve(data.tracks) // Resolve with the parsed tracks when done
        } else {
          trackParsed(data.parsedCount) // Call the callback with the parsed count
        }
      },
    )

    // Post the files to the worker for processing
    worker.postMessage(files)
  })
}
