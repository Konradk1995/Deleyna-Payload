/**
 * Check if we can use DOM APIs
 * Returns true only in browser environment
 */
const canUseDOM: boolean =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'

export default canUseDOM
