import { useRef, useEffect } from 'react'
import { User, Code, Palette } from 'lucide-react'
import { content } from '../data/content'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import FallbackImage from './ui/FallbackImage'
import gsap from 'gsap'

export default function About() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const { ref: revealRef, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '-50px',
  })

  useEffect(() => {
    if (isVisible && titleRef.current) {
      gsap.fromTo(titleRef.current,
        { scale: 0.8, opacity: 0, rotation: -5 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
      )
    }
  }, [isVisible])

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal" ref={revealRef}>
          <h2 ref={titleRef} className="section-title text-gradient">{content.about.title}</h2>
          <p className="section-description">{content.about.subtitle}</p>
        </div>

        <div className={`grid-2 ${isVisible ? 'visible' : ''}`}>
          {/* Image */}
          <div className="reveal" style={{ transitionDelay: '100ms' }}>
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{
                width: '100%',
                height: '400px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
              }}>
                <FallbackImage
                  src={content.about.image}
                  alt="Profile"
                  loading="lazy"
                  decoding="async"
                  className="skeleton"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="reveal" style={{ transitionDelay: '200ms' }}>
            <div className="card card-body" style={{ height: '100%' }}>
              <div className="card-content">
                <p style={{
                  fontSize: 'var(--text-lg)',
                  lineHeight: 'var(--leading-loose)',
                  marginBottom: 'var(--space-6)',
                }}>
                  {content.about.description}
                </p>

                {/* Skills */}
                <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
                  {content.about.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="badge"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        willChange: 'transform',
                      }}
                    >
                      <Code size={14} style={{ marginRight: '0.5rem' }} />
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
