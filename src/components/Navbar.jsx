import { useState, useEffect } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { content } from '../data/content'
import useScrollProgress from '../hooks/useScrollProgress'
import useMagnetic from '../hooks/useMagnetic'
import { scrollToSection } from '../utils/scrollToSection'
import { isLoggedIn, login, logout, verifyPassword } from '../utils/auth'
import PasswordModal from './ui/PasswordModal'
import Notification from './ui/Notification'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [notification, setNotification] = useState(null)

  useScrollProgress({ targetSelector: '#nav-progress' })

  const { ref: magneticRef } = useMagnetic({ strength: 0.2 })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsAdmin(isLoggedIn())
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(isLoggedIn())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (await verifyPassword(password)) {
      login()
      setIsAdmin(true)
      setIsPasswordModalOpen(false)
      setPassword('')
      setLoginError(null)
      showNotification('登录成功！', 'success')
      // 触发自定义事件通知其他组件
      window.dispatchEvent(new CustomEvent('auth-change'))
    } else {
      setLoginError('密码错误')
      showNotification('密码错误，请重试', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    setIsAdmin(false)
    showNotification('已退出登录', 'success')
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('auth-change'))
  }

  const handleLogoClick = () => {
    if (isAdmin) {
      handleLogout()
    } else {
      setIsPasswordModalOpen(true)
    }
  }

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    
    const sectionId = href.substring(1)
    scrollToSection(sectionId, 80, true)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div id="nav-progress" className="nav-progress" style={{ width: '0%' }} />

      <div className="navbar-content">
        <div 
          className="navbar-logo logo-clickable" 
          onClick={handleLogoClick}
        >
          {content.nav.logo}
          {isAdmin && (
            <div className="admin-indicator" />
          )}
        </div>

        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {content.nav.links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={handleLogout}
            className="btn btn-ghost logout-btn"
          >
            <LogOut size={16} />
            退出
          </button>
        )}

        <button
          ref={magneticRef}
          className="navbar-toggle btn-magnetic"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false)
          setLoginError(null)
          setPassword('')
        }}
        onLogin={handleLogin}
        password={password}
        setPassword={setPassword}
        error={loginError}
      />

      <Notification
        message={notification?.message}
        type={notification?.type}
      />
    </nav>
  )
}
