import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { CustomCursor } from '../../components/CustomCursor'
import { TicTacToeFab } from '../../components/TicTacToeFab'

export function RootLayout({ children }) {
  return (
    <div className="relative min-h-screen transition-colors duration-300">
      <CustomCursor />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <TicTacToeFab />
    </div>
  )
}