// ─────────────────────────────────────────────────────────────────────────────
// story.js  —  Single source of truth for the Story section
// ─────────────────────────────────────────────────────────────────────────────

export const journey = [
  {
    id: 1,
    year: '2022',
    tag: 'education',
    title: 'Enrolled in B.Tech CSE, Prayagraj',
    description:
      'Came in curious about how technology meets real systems. Took a while to find my footing with code — but once it clicked, I didn\'t stop.',
    meta: [],
  },
  {
    id: 2,
    year: '2023',
    tag: 'building',
    title: 'Got Serious About Full Stack',
    description:
      'Went deep on the MERN stack. Stopped following tutorials and started building from scratch — breaking things, fixing them, figuring out why they work.',
    meta: [],
  },
  {
    id: 3,
    year: '2024',
    tag: 'pivot',
    title: 'Shipped Real Products',
    description:
      'Built HelpLink, UniCare+, and a university attendance system — not for grades, just to see if I could make things people could actually use.',
    meta: [],
  },
  {
    id: 4,
    year: '2025',
    tag: 'work',
    title: 'IBM Hackathon, Bengaluru',
    description:
      'Competed at the IBM Expert Labs National Hackathon at S-Vyasa University. Built under pressure, outside college, against teams from across the country.',
    meta: [],
  },
  {
    id: 5,
    year: '2026',
    tag: 'now',
    isNow: true,
    title: 'Looking for the Right First Role',
    description:
      'Seeking a full-stack or product role where I can contribute from day one. Not chasing titles — just want to build things that matter.',
    meta: [],
  },
]

export const certificates = [
  {
    name: 'Employability Enhancement Program',
    issuer: 'Infosys',
    date: 'March 2026',
    description:
      'Industry-level training in software engineering, problem-solving, and professional practices at Infosys.',
    image: 'Centum_Infosys.jpg',
    // Real pixel dimensions of the (now web-optimized) file — lets the
    // lightbox reserve the correct aspect ratio before the image has even
    // started loading, so the panel doesn't jump or crop once it arrives.
    width: 1400,
    height: 990,
  },
  {
    name: 'Expert Labs National Hackathon 2025',
    issuer: 'IBM Expert Labs',
    date: 'Aug 2025',
    description:
      'Built an AI-powered solution at a national hackathon, S-Vyasa University, Bengaluru.',
    image: 'Vishal Yadav_Team46(IBM Hacakthon).jpg',
    width: 1400,
    height: 788,
  },
  {
    name: 'Full Stack Web Development',
    issuer: 'United University',
    date: 'June 2024',
    description:
      'Structured program covering React, Node.js, MongoDB, and the MERN stack end-to-end.',
    image: 'MERN_Stack.jpg',
    width: 1400,
    height: 994,
  },
]