import { FileWrapper, UnknownTrack } from '../../types/types'
import { TrackParseMessage } from './message-types'

export type TrackParsedFn = (totalParsedCount: number) => void

export const tracksParser = async (
  files: FileWrapper[],
  trackParsed: TrackParsedFn,
): Promise<UnknownTrack[]> => {
  // Dynamically import the worker and ensure it is treated as a module
  const TrackWorkerModule = await import(
    './worker/tracks-file-parser-worker?worker&module' // Ensure module format
  )
  const TrackWorker = TrackWorkerModule.default

  return new Promise((resolve, reject) => {
    const worker = new TrackWorker()

    worker.addEventListener('error', reject)

    worker.addEventListener(
      'message',
      ({ data }: MessageEvent<TrackParseMessage>) => {
        if (data.finished) {
          resolve(data.tracks)
        } else {
          trackParsed(data.parsedCount)
        }
      },
    )

    // Send files to the worker
    worker.postMessage(files)
  })
}
