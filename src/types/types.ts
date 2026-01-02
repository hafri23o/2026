/* =========================================================
 * File wrappers
 * ======================================================= */

export interface FileLegacy {
  readonly kind: 'file'
  readonly file: File
}

export interface FileHandle {
  readonly kind: 'fileRef'
  readonly file: FileSystemFileHandle
}

export interface FileUrl {
  readonly kind: 'url'
  readonly url: string
}

export type FileWrapper = FileLegacy | FileHandle | FileUrl

/* =========================================================
 * Media / image helpers
 * ======================================================= */

export type ImageType = Blob | string | undefined

/* =========================================================
 * Music item enums (const-safe for ESNext + strict)
 * ======================================================= */

export const MusicItemType = {
  TRACK: 0,
  ALBUM: 1,
  ARTIST: 2,
  PLAYLIST: 3,
  HISTORY: 4,
} as const

export type MusicItemType =
  (typeof MusicItemType)[keyof typeof MusicItemType]

export const MusicItemKey = {
  NAME: 'name',
  ARTISTS: 'artists',
  ALBUM: 'album',
  YEAR: 'year',
  DURATION: 'duration',
  DATE_CREATED: 'dateCreated',
} as const

export type MusicItemKey =
  (typeof MusicItemKey)[keyof typeof MusicItemKey]

/* =========================================================
 * Base models
 * ======================================================= */

export interface BaseMusicItem {
  readonly id: string
  readonly type: MusicItemType
  readonly name: string
}

export interface BaseMusicItemWithTrackIds extends BaseMusicItem {
  readonly trackIds: readonly string[]
}

/* =========================================================
 * Track models
 * ======================================================= */

export interface UnknownTrack {
  readonly name: string
  readonly album?: string
  readonly artists: readonly string[]
  readonly year?: string
  readonly duration: number
  readonly genre: readonly string[]
  readonly trackNo?: number
  readonly trackOf?: number
  readonly image?: ImageType
  readonly fileWrapper: FileWrapper
  readonly primaryColor?: number
  readonly description?: string
  readonly topics?: readonly string[]
}

export interface Track extends BaseMusicItem, UnknownTrack {
  readonly type: typeof MusicItemType.TRACK
}

/* =========================================================
 * Collection models
 * ======================================================= */

export interface Album extends BaseMusicItemWithTrackIds {
  readonly type: typeof MusicItemType.ALBUM
  readonly artists: readonly string[]
  readonly year?: string
  readonly image?: ImageType
  readonly description?: string
}

export interface Artist extends BaseMusicItemWithTrackIds {
  readonly type: typeof MusicItemType.ARTIST
}

export interface Playlist extends BaseMusicItemWithTrackIds {
  readonly type: typeof MusicItemType.PLAYLIST
  readonly dateCreated: number
}

/* =========================================================
 * Union helpers
 * ======================================================= */

export type MusicItem =
  | Track
  | Album
  | Artist
  | Playlist
