// Tiny global bridge: lets any modal/overlay in the app announce that it's
// open, so unrelated floating UI (like TicTacToeFab) can get out of the way
// while something else has the user's attention. Deliberately dependency-free
// (a plain window CustomEvent) so it doesn't require wrapping the app in a
// new context provider just for this.

const EVENT_NAME = 'app:modal-visibility'

export function announceModalOpen(isOpen) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { open: !!isOpen } }))
}

export function subscribeModalVisibility(callback) {
  const handler = (e) => callback(e.detail.open)
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}