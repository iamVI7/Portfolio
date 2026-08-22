import { useMediaQuery } from './useMediaQuery'

// One shared definition of the widget-resize motion — used by both
// MusicFab (container resize) and TicTacToeFab (play-pill resize) so the
// two widgets stay in step, and so tuning this later means editing one
// file instead of finding every place it got copy-pasted.
//
// This used to be a spring (`type: 'spring'`). Springs settle by
// oscillating toward rest, and even "critically damped" ones spend their
// last ~15% moving slowly enough that a fast click-to-open reads as a
// beat of lag before the pill actually finishes growing. A tween with an
// expo-out curve front-loads the motion instead — it moves fast and
// visibly *immediately* on click, then eases off — which reads as snappier
// even though the total duration is similar.
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]
const DESKTOP_TRANSITION = { type: 'tween', duration: 0.32, ease: EASE_OUT_EXPO }
const MOBILE_TRANSITION = { type: 'tween', duration: 0.26, ease: EASE_OUT_EXPO }

export function useResponsiveSpring() {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  return isDesktop ? DESKTOP_TRANSITION : MOBILE_TRANSITION
}