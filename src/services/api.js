const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const apiConfig = Object.freeze({
  baseURL: API_BASE_URL,
  isConfigured: Boolean(API_BASE_URL),
})

export function backendPending() {
  return 'Backend integration pending. Nothing has been saved or sent.'
}
