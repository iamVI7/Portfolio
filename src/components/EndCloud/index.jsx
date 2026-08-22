// Decorative sky/cloud image pinned to the very bottom of the page.
// Sits behind all content (negative z-index) so it never affects readability.
// The mask fades the top edge to transparent so the clouds seem to
// emerge gradually rather than showing a hard image edge, and the
// blend-mode + opacity pair is tuned separately for light/dark so the
// same source image reads correctly in both themes.
export function EndCloud() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-x-0 bottom-0 -z-10 h-[65vh] sm:h-[75vh] max-h-[760px] overflow-hidden"
    >
      <img
        src="/end-cloud.webp"
        alt=""
        draggable={false}
        className="
          h-full w-full object-cover object-bottom
          opacity-[0.42] dark:opacity-[0.22]
          mix-blend-multiply dark:mix-blend-screen
        "
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.4) 58%, rgba(0,0,0,0.7) 75%, black 92%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.4) 58%, rgba(0,0,0,0.7) 75%, black 92%)',
        }}
      />
    </div>
  )
}