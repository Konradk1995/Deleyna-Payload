// Central block catalog exports
export * from './core'
export * from './extended'

import { coreBlocks } from './core'
import { extendedBlocks } from './extended'

/**
 * Block array used by Payload collections/globals.
 * Kept stable by composing core + extended catalogs.
 */
export const allBlocks = [...coreBlocks, ...extendedBlocks]
