import { useRef, useEffect } from 'react'
import { Briefcase, Calendar } from 'lucide-react'
import { content } from '../data/content'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import gsap from 'gsap'

export default function Experience() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const { ref: revealRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-100px',
  })

  useEffect(() => {
    if (isVisible && titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'bounce.out' }
      )
    }
  }, [isVisible])

  return (
    <section id="experience" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal" ref={revealRef}>
          <h2 ref={titleRef} className="section-title text-gradient">{content.experience.title}</h2>
          <p className="section-description">{content.experience.subtitle}</p>
        </div>

        {/* Timeline */}
        <div className={`grid-1 ${isVisible ? 'visible' : ''}`} style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          paddingLeft: 'var(--space-8)',
        }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: '24px',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'var(--gradient-primary)',
            opacity: 0.3,
          }} />

          {content.experience.timeline.map((item, index) => (
            <div
              key={item.id}
              className="reveal"
              style={{
                position: 'relative',
                marginBottom: 'var(--space-12)',
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: '-2.5rem',
                top: '0',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                border: '3px solid white',
                boxShadow: '0 0 0 4px var(--color-primary-100)',
              }} />

              <div className="card card-body">
                <div className="card-content">
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-4)',
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--color-text)',
                      }}>
                        {item.role}
                      </h3>
                      <p style={{
                        color: 'var(--color-primary-600)',
                        fontWeight: 'var(--font-medium)',
                        fontSize: 'var(--text-base)',
                      }}>
                        {item.company}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                    }}>
                      {item.period !== 'To be Continued...' && <Calendar size={14} />}
                      {item.period}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    marginBottom: 'var(--space-4)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}>
                    {item.description}
                  </p>

                  {/* Skills */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    {item.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="badge"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <Briefcase size={12} style={{ marginRight: '0.25rem' }} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
