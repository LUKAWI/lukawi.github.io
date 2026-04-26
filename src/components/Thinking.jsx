import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, PenTool, ChevronDown, ChevronUp } from 'lucide-react'
import { content } from '../data/content'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import useIntersectionObserver from '../hooks/useIntersectionObserver'

// Register GSAP TextPlugin
gsap.registerPlugin(TextPlugin)

export default function Thinking() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const { ref: revealRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-100px',
  })

  const titleTextRef = useRef(null)
  const [expandedIdea, setExpandedIdea] = useState(null)

  useEffect(() => {
    if (!isVisible || !titleTextRef.current) return

    const element = titleTextRef.current
    const fullText = content.thinking.title

    // Clear initial text
    element.textContent = ''

    // Create GSAP timeline with infinite repeat
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5, // pause before restarting
    })

    // Type out effect
    tl.to(element, {
      text: fullText,
      duration: fullText.length * 0.1, // 100ms per character (slowed down 2x)
      ease: 'none',
      textPlugin: { delimiter: '' }, // character by character
    })
      .to(element, {
        duration: 1, // pause for 1 second after typing
      })
      .to(element, {
        text: '',
        duration: fullText.length * 0.06, // slower delete (slowed down 2x)
        ease: 'none',
        textPlugin: { delimiter: '' },
      })

    return () => {
      tl.kill()
    }
  }, [isVisible])

  return (
    <section id="thinking" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal" ref={revealRef}>
          <h2 className="section-title text-gradient">
            <span ref={titleTextRef} />
            <span style={{
              display: 'inline-block',
              width: '3px',
              height: '1em',
              background: 'var(--gradient-primary)',
              marginLeft: '0.1em',
              animation: 'pulse 1s infinite',
              verticalAlign: 'text-bottom',
            }} />
          </h2>
          <p className="section-description">{content.thinking.subtitle}</p>
        </div>

        {/* Quote */}
        <div className={`reveal ${isVisible ? 'visible' : ''}`} style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto var(--space-12)',
          position: 'relative',
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontStyle: 'italic',
            color: 'var(--color-text)',
            position: 'relative',
            padding: '0 var(--space-8)',
          }}>
            <PenTool style={{
              position: 'absolute',
              left: 0,
              top: '-10px',
              color: 'var(--color-primary-500)',
              opacity: 0.5,
            }} size={32} />
            "{content.thinking.quote}"
            <PenTool style={{
              position: 'absolute',
              right: 0,
              bottom: '-20px',
              color: 'var(--color-primary-500)',
              opacity: 0.5,
              transform: 'rotate(180deg)',
            }} size={32} />
          </div>
        </div>

        {/* Ideas Grid */}
        <div className={`grid-3 ${isVisible ? 'visible' : ''}`}>
          {content.thinking.ideas.map((idea, index) => {
            const isExpanded = expandedIdea === idea.id
            const isAIPlusEE = idea.title === 'AI+EE'
            
            return (
            <div
              key={idea.id}
              className="card card-body"
              style={{
                animationDelay: `${index * 150}ms`,
                cursor: isAIPlusEE ? 'pointer' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'all 0.3s ease',
              }}
              onClick={() => {
                if (isAIPlusEE) {
                  navigate('/thinking/ai-ee')
                } else {
                  setExpandedIdea(isExpanded ? null : idea.id)
                }
              }}
            >
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}>
                  <Lightbulb size={24} color="white" />
                </div>

                <h3 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--color-text)',
                }}>
                  {idea.title}
                </h3>

                <p className="card-text" style={{ flex: 1, marginBottom: 'var(--space-4)' }}>
                  {idea.summary}
                </p>

                {isExpanded && !isAIPlusEE && (
                  <div style={{
                    marginTop: 'var(--space-4)',
                    padding: 'var(--space-4)',
                    background: 'var(--color-bg-secondary, rgba(0,0,0,0.03))',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--color-primary-500)',
                  }}>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      lineHeight: '1.6',
                      color: 'var(--color-text-secondary, var(--color-text))',
                      margin: 0,
                    }}>
                      {idea.detailedContent}
                    </p>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'var(--space-4)',
                }}>
                  {!isAIPlusEE && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-primary-600)',
                      fontWeight: 'var(--font-medium)',
                    }}>
                      {isExpanded ? (
                        <>
                          收起 <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          展开详情 <ChevronDown size={16} />
                        </>
                      )}
                    </span>
                  )}
                  {isAIPlusEE && (
                    <span
                      className="nav-link"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-primary-600)',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/thinking/ai-ee')
                      }}
                    >
                      View All Ideas
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
