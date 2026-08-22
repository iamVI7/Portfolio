// "Currently vibing to" widget config.
//
// - `src` currently points at a generated placeholder chime
//   (public/music/now-playing.mp3) so the play button actually works out
//   of the box. Swap in your real track by replacing that file (or point
//   `src` at a different path/filename) — an actual copyrighted song can't
//   be generated or fetched in here, so this is a stand-in.
// - `url` is where the song title links out to (Spotify/YouTube/etc). Leave
//   it as '' to render the title as plain text instead of a link.

export const NOW_PLAYING = {
  artist: 'Elissar',
  title: 'Wild Ride',
  url: 'https://youtu.be/OmncQ2CAPXs?si=bR77SQeEddTtXWvJ',
  src: '/music/Wild Ride.mp3',
}