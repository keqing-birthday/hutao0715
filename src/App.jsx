import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PlumBlossoms from './components/effects/PlumBlossoms'
import Ghosts from './components/effects/Ghosts'
import Hero from './sections/Hero'
import Recruitment from './sections/Recruitment'
import About from './sections/About'

function App() {
  return (
    <div className="relative min-h-screen bg-ink text-paper overflow-x-hidden">
      <PlumBlossoms />
      <Ghosts />
      <Navbar />
      <main>
        <Hero />
        <Recruitment />
        <About />
      </main>
      <Footer />
    </div>
  )
}

export default App
