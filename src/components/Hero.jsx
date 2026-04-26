import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Github, Mail } from 'lucide-react'
import { content } from '../data/content'
import * as THREE from 'three'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

// Register GSAP TextPlugin
gsap.registerPlugin(TextPlugin)

export default function Hero() {
  const heroRef = useRef(null)
  const ctaRef = useRef(null)
  const particlesRef = useRef(null)
  const typingRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  // IntersectionObserver 用于检测 Hero 区域是否可见
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Three.js setup
    if (!particlesRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    particlesRef.current.innerHTML = ''
    particlesRef.current.appendChild(renderer.domElement)

    // Create particles - larger pixel dots 2-4px
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 100
      positions[i + 1] = (Math.random() - 0.5) * 100
      positions[i + 2] = (Math.random() - 0.5) * 50
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // White particles with glow
    const material = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    camera.position.z = 50

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.0175 // Reduced from 0.035 to 0.0175 (-50%)
      mouseY = (event.clientY - window.innerHeight / 2) * 0.0175 // Reduced from 0.035 to 0.0175 (-50%)
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      // 当 Hero 区域不可见时暂停渲染
      if (!isVisible) return

      const elapsedTime = clock.getElapsedTime()

      targetX = mouseX * 0.5
      targetY = mouseY * 0.5

      // Slow rotation
      particles.rotation.y += 0.001
      particles.rotation.x += 0.0005

      // Mouse interaction - reduced sensitivity by additional 50%
      particles.rotation.y += 0.0175 * (targetX - particles.rotation.y) // Reduced from 0.035
      particles.rotation.x += 0.0175 * (targetY - particles.rotation.x) // Reduced from 0.035

      // Wave motion
      const positions = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(elapsedTime * 0.5 + positions[i3] * 0.1) * 0.02
      }
      geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [isVisible])

  useEffect(() => {
    const hero = heroRef.current

    if (!hero) return

    // Parallax effect on scroll
    gsap.to(hero, {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Cleanup
    return () => {
      gsap.killTweensOf(hero)
    }
  }, [])

  // Typing effect for "Hi, I'm LUKAWI."
  useEffect(() => {
    if (!typingRef.current) return

    const element = typingRef.current
    const fullText = "Hi, I'm LUKAWI."

    // Clear initial text
    element.textContent = ''

    // Create GSAP timeline - type once and keep the text
    const tl = gsap.timeline()

    // Type out effect
    tl.to(element, {
      text: fullText,
      duration: fullText.length * 0.15, // 150ms per character
      ease: 'none',
      textPlugin: { delimiter: '' }, // character by character
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section id="hero" ref={heroRef} className="hero">
      {/* Three.js Particle Background */}
      <div ref={particlesRef} style={{ 
        position: 'absolute', 
        inset: 0, 
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <div className="hero-content">
        {/* Typing Effect */}
        <div className="hero-typing">
          <h2 ref={typingRef} style={{
            fontSize: 'calc(var(--text-4xl) * 1.3)', // Increased size by 30%
            fontWeight: 'var(--font-bold)',
            color: 'white',
            opacity: 0.5, // 50% opacity
            marginBottom: 'var(--space-4)',
            minHeight: 'calc(var(--text-4xl) * 1.3)',
          }} />
        </div>

        {/* Welcome Text - moved down */}
        <div className="hero-welcome" style={{ marginTop: 'var(--space-8)' }}>
          <p>Welcome to my creative space</p>
          <p>I craft beautiful digital experiences</p>
        </div>

        <div ref={ctaRef} className="hero-cta" style={{ display: 'none' }}>
          <a href={content.hero.cta.primary.href} className="btn btn-primary btn-magnetic">
            <ArrowDown size={20} />
            {content.hero.cta.primary.text}
          </a>
          <a href={content.hero.cta.secondary.href} className="btn btn-secondary">
            <Mail size={20} />
            {content.hero.cta.secondary.text}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'float 2s ease-in-out infinite',
      }}>
        <ArrowDown size={32} color="rgba(255,255,255,0.7)" />
      </div>
    </section>
  )
}
