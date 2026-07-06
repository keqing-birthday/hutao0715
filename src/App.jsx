import { lazy, Suspense, useState, useCallback } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PlumBlossoms from './components/effects/PlumBlossoms'
import Hero from './sections/Hero'
import IntroAnimation from './components/loading/IntroAnimation'
import SkeletonLoader from './components/loading/SkeletonLoader'

const Recruitment = lazy(() => import('./sections/Recruitment'))
const About = lazy(() => import('./sections/About'))
const OfflineEvents = lazy(() => import('./sections/OfflineEvents'))

function App() {
  const [introDone, setIntroDone] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-ink text-paper overflow-x-hidden">
      {!introDone && <IntroAnimation onComplete={handleIntroComplete} />}
      <PlumBlossoms />
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Suspense fallback={<SkeletonLoader />}>
          <Recruitment />
          <About />
        </Suspense>
      </main>
      <Suspense fallback={<SkeletonLoader />}>
        <OfflineEvents />
      </Suspense>
      <Footer />
    </div>
  )
}

export default App
