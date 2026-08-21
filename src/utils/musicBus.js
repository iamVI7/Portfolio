// Tiny global bridge (same pattern as modalBus): lets the music widget
// announce that it has expanded, so the tic-tac-toe pill can shrink down to
// a plain circle and get out of the way instead of the two fighting for
// space in the bottom dock.

const EVENT_NAME = 'app:music-visibility'

export function announceMusicOpen(isOpen) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { open: !!isOpen } }))
}

export function subscribeMusicVisibility(callback) {
  const handler = (e) => callback(e.detail.open)
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}