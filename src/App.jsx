import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Experience from './components/Experience'
import Thinking from './components/Thinking'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AiEeDirectory from './pages/AiEeDirectory'
import { ArrowUp } from 'lucide-react'
import './styles/globals.css'

// Import GSAP and ScrollTrigger plugin
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function RedirectHandler() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const redirectPath = searchParams.get('_redirect')
    if (redirectPath) {
      const searchParam = searchParams.get('_q')
      const hashParam = searchParams.get('_h')

      let fullPath = redirectPath
      if (searchParam) {
        fullPath += searchParam
      }
      if (hashParam) {
        fullPath += hashParam
      }

      const cleanUrl = new URL(window.location.href)
      cleanUrl.search = ''

      window.history.replaceState(null, '', cleanUrl.toString())
      navigate(fullPath, { replace: true })
    }
  }, [navigate, searchParams])

  return null
}

function App() {
  const appRef = useRef(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations for all elements with .reveal class
      const revealElements = document.querySelectorAll('.reveal')

      revealElements.forEach((element) => {
        gsap.fromTo(element,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // Stagger animations for grid items
      const staggerContainers = document.querySelectorAll('.stagger')

      staggerContainers.forEach((container) => {
        gsap.fromTo(container.children,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // Bento grid staggered reveal
      const bentoGrid = document.querySelector('.bento-grid')
      if (bentoGrid) {
        gsap.fromTo(bentoGrid.children,
          {
            y: 50,
            opacity: 0,
            scale: 0.95,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.2)',
            stagger: {
              amount: 0.5,
              grid: 'auto',
            },
            scrollTrigger: {
              trigger: bentoGrid,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <BrowserRouter basename="/">
      <RedirectHandler />
      <Routes>
        <Route path="/" element={
          <div ref={appRef} className="app">
            <Navbar />
            <main id="main" tabIndex="-1">
              <Hero />
              <About />
              <Experience />
              <Blog />
              <Projects />
              <Thinking />
              <Contact />
            </main>
            <Footer />
            {/* Back to top button */}
            <button
              className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        } />
        <Route path="/thinking/ai-ee" element={<AiEeDirectory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
