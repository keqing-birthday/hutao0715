import { lazy, Suspense, useState, useCallback, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PlumBlossoms from './components/effects/PlumBlossoms'
import Hero from './sections/Hero'
import IntroAnimation from './components/loading/IntroAnimation'
import SkeletonLoader from './components/loading/SkeletonLoader'
import AlbumPage from './pages/AlbumPage'

const Recruitment = lazy(() => import('./sections/Recruitment'))
const About = lazy(() => import('./sections/About'))
const Credits = lazy(() => import('./sections/Credits'))
const OfflineEvents = lazy(() => import('./sections/OfflineEvents'))

function ScrollToSection() {
  const location = useLocation()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const section = params.get('section')
    if (section) {
      const el = document.getElementById(section)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location])
  return null
}

function HomePage() {
  const [introDone, setIntroDone] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-ink text-paper overflow-x-hidden">
      {!introDone && <IntroAnimation onComplete={handleIntroComplete} />}
      <PlumBlossoms />
      <Navbar />
      <ScrollToSection />
      <main className="pt-20">
        <Hero />
        <Suspense fallback={<SkeletonLoader />}>
          <Recruitment />
          <About />
          <Credits />
        </Suspense>
      </main>
      <Suspense fallback={<SkeletonLoader />}>
        <OfflineEvents />
      </Suspense>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/album" element={<AlbumPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
