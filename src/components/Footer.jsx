import { Heart, Github, Code } from 'lucide-react'
import { content } from '../data/content'
import BottomBanner from './BottomBanner'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          {/* Main Footer Content */}
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-section">
              <h4 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'var(--space-4)',
              }}>
                {content.nav.logo}
              </h4>
              <p style={{ lineHeight: 'var(--leading-relaxed)' }}>
                Creative developer crafting beautiful, functional digital experiences.
              </p>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <Github size={16} />
                  GitHub
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>Quick Links</h4>
              {content.nav.links.map((link) => (
                <a key={link.name} href={link.href}>
                  {link.name}
                </a>
              ))}
            </div>

            {/* Connect */}
            <div className="footer-section">
              <h4>Connect</h4>
              {content.contact.social.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name}
                </a>
              ))}
              <a href={`mailto:${content.contact.email}`}>
                {content.contact.email}
              </a>
            </div>

            {/* Tech Stack */}
            <div className="footer-section">
              <h4>Built With</h4>
              <p style={{ marginBottom: 'var(--space-2)' }}>
                <Code size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                React + Vite + GSAP
              </p>
              <p>
                <Heart size={14} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--color-primary-500)' }} />
                Designed with passion
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p>
              © {currentYear} LUKAWI. All rights reserved. · {content.footer.builtWith}
            </p>
          </div>
        </div>
      </footer>
      
      {/* Bottom Banner with LUKAWI text */}
      <BottomBanner />
    </>
  )
}
