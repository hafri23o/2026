import type { UnknownTrack } from '../../types/types'

// Message when parsing is not finished, includes the count of parsed tracks
export interface TrackParseMessageNotFinished {
  finished: false
  parsedCount: number
}

// Message when parsing is finished, includes the list of parsed tracks
export interface TrackParseMessageFinished {
  finished: true
  parsedCount: number
  tracks: UnknownTrack[]
}

// Union type to represent both parsing states: not finished and finished
export type TrackParseMessage =
  | TrackParseMessageNotFinished
  | TrackParseMessageFinished
