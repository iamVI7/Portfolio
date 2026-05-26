import { useState, useEffect } from 'react'
import { RootLayout } from './layouts/RootLayout'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Projects } from './sections/Projects'
import { Journey } from './sections/Journey'
import { Beyond } from './sections/Beyond'
import { Contact } from './sections/Contact'
import { HelloIntro } from './components/HelloIntro'

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('intro-shown')
  })

  const handleIntroDone = () => {
    sessionStorage.setItem('intro-shown', '1')
    setShowIntro(false)
  }

  return (
    <>
      {showIntro && <HelloIntro onDone={handleIntroDone} />}
      <RootLayout>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Beyond />
        <Contact />
      </RootLayout>
    </>
  )
}
