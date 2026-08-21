// Tiny global bridge (same pattern as modalBus/musicBus): lets the
// tic-tac-toe game panel announce that it has opened, so the music widget
// can collapse back to a circle instead of the two competing for attention.

const EVENT_NAME = 'app:game-visibility'

export function announceGameOpen(isOpen) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { open: !!isOpen } }))
}

export function subscribeGameVisibility(callback) {
  const handler = (e) => callback(e.detail.open)
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}