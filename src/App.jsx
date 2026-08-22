import { RootLayout } from './layouts/RootLayout'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Projects } from './sections/Projects'
import { Story } from './sections/Story'
import { Beyond } from './sections/Beyond'
import { Contact } from './sections/Contact'

export default function App() {
  return (
    <RootLayout>
      <Hero />
      <About />
      <Projects />
      <Story />
      <Beyond />
      <Contact />
    </RootLayout>
  )
}