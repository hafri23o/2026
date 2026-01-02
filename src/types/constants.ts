/* -------------------------------------------------------------------------- */
/* Application-wide constants                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Persistent ID for the Favorites collection.
 * ⚠️ Must never change once deployed.
 */
export const FAVORITES_ID = 'favorites--Z5jdHi6B-myT' as const;

/**
 * Placeholder ID used when an item cannot be resolved.
 */
export const UNKNOWN_ITEM_ID = '<unknown>' as const;

/**
 * Placeholder string used when a word cannot be resolved.
 */
export const UNKNOWN_WORD_STRING = '<unknown>' as const;

/* -------------------------------------------------------------------------- */
/* Derived types (optional but useful)                                         */
/* -------------------------------------------------------------------------- */

export type UnknownToken =
  | typeof UNKNOWN_ITEM_ID
  | typeof UNKNOWN_WORD_STRING;

/* isolatedModules safety */
export {};
