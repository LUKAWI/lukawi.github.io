import { useRef, useEffect } from 'react'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { content } from '../data/content'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import FallbackImage from './ui/FallbackImage'
import gsap from 'gsap'

export default function Blog() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const { ref: revealRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-100px',
  })

  useEffect(() => {
    if (isVisible && titleRef.current) {
      gsap.fromTo(titleRef.current,
        { filter: 'blur(10px)', opacity: 0 },
        { filter: 'blur(0px)', opacity: 1, duration: 1, ease: 'power2.out' }
      )
    }
  }, [isVisible])

  return (
    <section id="blog" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal" ref={revealRef}>
          <h2 ref={titleRef} className="section-title text-gradient">{content.blog.title}</h2>
          <p className="section-description">{content.blog.subtitle}</p>
        </div>

        <div className={`grid-3 ${isVisible ? 'visible' : ''}`}>
          {content.blog.posts.map((post, index) => (
            <article
              key={post.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Post Image */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                overflow: 'hidden',
              }}>
                <FallbackImage
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                  }}
                />
                {/* Category badge */}
                <span className="badge" style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  border: 'none',
                  fontSize: '0.75rem',
                }}>
                  {post.category}
                </span>
              </div>

              {/* Post Content */}
              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="card-content" style={{ flex: 1 }}>
                  <h3 className="card-title" style={{
                    fontSize: 'var(--text-xl)',
                    marginBottom: 'var(--space-3)',
                    lineHeight: 'var(--leading-snug)',
                  }}>
                    {post.title}
                  </h3>

                  <p className="card-text" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.excerpt}
                  </p>
                </div>

                {/* Meta */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                  marginTop: 'auto',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                </div>

                {/* Read More Link */}
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <span className="nav-link" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-primary-600)',
                  }}>
                    Read more
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
