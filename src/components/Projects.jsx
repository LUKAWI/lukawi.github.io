import { useRef, useState, useEffect } from 'react'
import { Github, ExternalLink } from 'lucide-react'
import { content } from '../data/content'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import FallbackImage from './ui/FallbackImage'
import gsap from 'gsap'

export default function Projects() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const { ref: revealRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-100px',
  })

  // Mobile detection based on DESIGN.md breakpoint (768px)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isVisible && titleRef.current) {
      gsap.fromTo(titleRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )
    }
  }, [isVisible])

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal" ref={revealRef}>
          <h2 ref={titleRef} className="section-title text-gradient">{content.projects.title}</h2>
          <p className="section-description">{content.projects.subtitle}</p>
        </div>

        {/* Bento Grid */}
        <div className={`bento-grid ${isVisible ? 'visible' : ''}`}>
          {content.projects.items.map((project, index) => (
            <div
              key={project.id}
              className={`card ${project.featured ? 'bento-large' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                animationDelay: `${index * 100}ms`,
              }}
            >
              {isMobile ? (
                // Mobile: direct display without flip
                <>
                  {/* Image */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: project.featured ? '60%' : '200px',
                    overflow: 'hidden',
                  }}>
                    <FallbackImage
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                      }}
                    />
                  </div>
                  {/* Content with links directly visible */}
                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="card-content" style={{ flex: 1 }}>
                      <h3 className="card-title">{project.title}</h3>
                      <p className="card-text">{project.description}</p>
                      {/* Tech Stack Tags */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: 'auto',
                        paddingTop: '1rem',
                      }}>
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="badge"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Links directly in body for mobile */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <Github size={16} />
                        Code
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <ExternalLink size={16} />
                        Demo
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                // Desktop: 3D flip
                <div className="card-flip-container" style={{ height: '100%' }}>
                  <div className="card-flip-inner">
                    <div className="card-flip-front">
                      <FallbackImage
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <div className="card-flip-back">
                      <div className="card-body" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 className="card-title">{project.title}</h3>
                        <p className="card-text">{project.description}</p>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          marginTop: 'auto',
                          paddingTop: '1rem',
                        }}>
                          {project.tech.map((tech, i) => (
                            <span
                              key={i}
                              className="badge"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.875rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <Github size={16} />
                            Code
                          </a>
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.875rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <ExternalLink size={16} />
                            Demo
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
