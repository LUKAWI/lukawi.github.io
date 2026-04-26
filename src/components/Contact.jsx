import { useState, useRef, useEffect } from 'react'
import { Mail, MapPin, Send, Github, Lock, Trash2 } from 'lucide-react'
import { content } from '../data/content'
import { isLoggedIn, login, logout, verifyPassword } from '../utils/auth'
import { getMessages, saveMessage, deleteMessage } from '../utils/cloudStorage'
import useMagnetic from '../hooks/useMagnetic'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import Modal from './ui/Modal'
import Notification from './ui/Notification'
import PasswordModal from './ui/PasswordModal'
import gsap from 'gsap'

export default function Contact() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const { ref: revealRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-100px',
  })

  const [formData, setFormData] = useState({
    name: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [errors, setErrors] = useState({})
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [showAllMessages, setShowAllMessages] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)
  const [expandedMessages, setExpandedMessages] = useState({})
  const [selectedMessage, setSelectedMessage] = useState(null)

  // Magnetic button for submit
  const { ref: submitBtnRef } = useMagnetic({ strength: 0.2 })

  useEffect(() => {
    if (isVisible && titleRef.current) {
      // Split text into letters and animate each one
      const title = titleRef.current
      const text = title.textContent
      title.textContent = ''
      
      // Create spans for each letter
      text.split('').forEach((char, i) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char // Use non-breaking space
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        title.appendChild(span)
        
        gsap.to(span, {
          opacity: 1,
          duration: 0.3,
          delay: 0.5 + (i * 0.05),
          ease: 'power2.out'
        })
      })
    }
  }, [isVisible])

  // Load messages from cloud storage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await getMessages()
        if (stored && stored.length > 0) {
          setMessages(stored)
        }
      } catch (e) {
        console.error('Failed to load messages:', e)
      } finally {
        setLoadingMessages(false)
      }
    }
    loadMessages()
  }, [])

  // 监听登录状态
  useEffect(() => {
    setIsAdmin(isLoggedIn())
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(isLoggedIn())
    }
    window.addEventListener('storage', handleStorageChange)
    
    // 监听自定义登录状态变化事件
    const handleAuthChange = () => {
      setIsAdmin(isLoggedIn())
    }
    window.addEventListener('auth-change', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  // ESC 键关闭模态框
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsPasswordModalOpen(false)
        setIsDeleteConfirmOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = '昵称不能为空'
    }
    if (!formData.message.trim()) {
      newErrors.message = '留言内容不能为空'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitStatus(null)
    setIsFadingOut(false)

    try {
      const newMessage = {
        id: Date.now(),
        name: formData.name.trim(),
        message: formData.message.trim(),
        timestamp: new Date().toISOString(),
      }

      const success = await saveMessage(newMessage)
      
      if (success) {
        const updatedMessages = await getMessages()
        setMessages(updatedMessages)
        setSubmitStatus('success')
        setFormData({ name: '', message: '' })
        setErrors({})
        
        setTimeout(() => {
          setIsFadingOut(true)
          setTimeout(() => {
            setSubmitStatus(null)
            setIsFadingOut(false)
          }, 500)
        }, 3000)
      } else {
        setSubmitStatus('error')
        
        setTimeout(() => {
          setIsFadingOut(true)
          setTimeout(() => {
            setSubmitStatus(null)
            setIsFadingOut(false)
          }, 500)
        }, 3000)
      }
    } catch (error) {
      setSubmitStatus('error')
      
      setTimeout(() => {
        setIsFadingOut(true)
        setTimeout(() => {
          setSubmitStatus(null)
          setIsFadingOut(false)
        }, 500)
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get display messages (limit to 5 or show all)
  const displayMessages = showAllMessages ? messages : messages.slice(0, 5)
  const hasMoreMessages = messages.length > 5

  // Get icon for social links
  const getSocialIcon = (iconName) => {
    switch (iconName) {
    case 'github': return <Github size={20} />
    default: return <Github size={20} />
    }
  }

  // 通知显示
  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // 登录处理
  const handleLogin = async (e) => {
    e.preventDefault()
    if (await verifyPassword(password)) {
      login()
      setIsAdmin(true)
      setIsPasswordModalOpen(false)
      setPassword('')
      setLoginError(null)
      showNotification('登录成功！', 'success')
    } else {
      setLoginError('密码错误')
      showNotification('密码错误，请重试', 'error')
    }
  }

  // 登出处理
  const handleLogout = () => {
    logout()
    setIsAdmin(false)
    showNotification('已退出登录', 'success')
  }

  // Logo 点击处理
  const handleLogoClick = () => {
    if (isAdmin) {
      handleLogout()
    } else {
      setIsPasswordModalOpen(true)
    }
  }

  // 删除留言
  const handleDeleteClick = (msg) => {
    setMessageToDelete(msg)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (messageToDelete) {
      try {
        const success = await deleteMessage(messageToDelete.id)
        if (success) {
          const updatedMessages = await getMessages()
          setMessages(updatedMessages)
          showNotification('删除成功', 'success')
        } else {
          showNotification('删除失败', 'error')
        }
      } catch (error) {
        console.error('Failed to delete message:', error)
        showNotification('删除失败', 'error')
      } finally {
        setMessageToDelete(null)
        setIsDeleteConfirmOpen(false)
      }
    }
  }

  const handleCancelDelete = () => {
    setMessageToDelete(null)
    setIsDeleteConfirmOpen(false)
  }

  // 切换留言展开/折叠
  const toggleMessageExpand = (msgId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }))
  }

  // 查看留言全文
  const viewMessageFull = (msg) => {
    setSelectedMessage(msg)
  }

  // 检测留言是否需要折叠（根据内容长度估算行数）
  const shouldCollapse = (message) => {
    const isMobile = window.innerWidth < 768
    const maxLines = isMobile ? 5 : 3
    const avgCharsPerLine = isMobile ? 30 : 50
    const estimatedLines = message.length / avgCharsPerLine
    return estimatedLines > maxLines
  }

  return (
    <section id="contact" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal" ref={revealRef}>
          <h2 ref={titleRef} className="section-title text-gradient">{content.contact.title}</h2>
          <p className="section-description">{content.contact.subtitle}</p>
        </div>

        <div className={`grid-2 ${isVisible ? 'visible' : ''}`} style={{ gap: 'var(--space-12)' }}>
          {/* Contact Info */}
          <div className="reveal" style={{ transitionDelay: '100ms' }}>
            <div className="card card-body" style={{ height: '100%' }}>
              <div className="card-content">
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  marginBottom: 'var(--space-6)',
                }}>
                  联系我
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  {/* Emails */}
                  {content.contact.emails.map((email, index) => (
                    <a
                      key={index}
                      href={`mailto:${email}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        color: 'var(--color-text)',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-primary-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary-600)',
                      }}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Email</p>
                        <p style={{ fontWeight: 'var(--font-medium)' }}>{email}</p>
                      </div>
                    </a>
                  ))}

                  {/* Location */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-primary-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary-600)',
                    }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Location</p>
                      <p style={{ fontWeight: 'var(--font-medium)' }}>{content.contact.location}</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div style={{ marginTop: 'var(--space-8)' }}>
                  <h4 style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    marginBottom: 'var(--space-4)',
                  }}>
                    Follow Me
                  </h4>
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    {content.contact.social.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{
                          padding: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-label={social.name}
                      >
                        {getSocialIcon(social.icon)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guestbook Form */}
          <div className="reveal" style={{ transitionDelay: '200ms' }}>
            <form
              onSubmit={handleSubmit}
              className="card"
              style={{ padding: 'var(--space-8)' }}
            >
              <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div>
                  <label
                    htmlFor="name"
                    style={{
                      display: 'block',
                      marginBottom: 'var(--space-2)',
                      fontWeight: 'var(--font-medium)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {content.contact.guestbook.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-base)',
                      transition: 'border-color var(--transition-fast)',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary-500)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                  />
                  {errors.name && (
                    <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: '0.25rem', marginBottom: '0' }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    style={{
                      display: 'block',
                      marginBottom: 'var(--space-2)',
                      fontWeight: 'var(--font-medium)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {content.contact.guestbook.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-base)',
                      resize: 'vertical',
                      minHeight: '120px',
                      transition: 'border-color var(--transition-fast)',
                      outline: 'none',
                      fontFamily: 'var(--font-primary)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary-500)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                  />
                  {errors.message && (
                    <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: '0.25rem', marginBottom: '0' }}>
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  ref={submitBtnRef}
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-magnetic"
                  style={{
                    width: '100%',
                    marginTop: 'var(--space-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                  }}
                >
                  {isSubmitting ? (
                    '发布中...'
                  ) : (
                    <>
                      <Send size={18} />
                      {content.contact.guestbook.submitButton}
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-success)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    fontWeight: 'var(--font-medium)',
                    transition: 'opacity 0.5s ease-out',
                    opacity: isFadingOut ? 0 : 1,
                    pointerEvents: isFadingOut ? 'none' : 'auto',
                  }}>
                    {content.contact.guestbook.successMessage}
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-error)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    fontWeight: 'var(--font-medium)',
                    transition: 'opacity 0.5s ease-out',
                    opacity: isFadingOut ? 0 : 1,
                    pointerEvents: isFadingOut ? 'none' : 'auto',
                  }}>
                    {content.contact.guestbook.errorMessage}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Messages Display Section */}
        {loadingMessages ? (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid var(--color-border)',
              borderTopColor: 'var(--color-primary-500)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
              加载留言中...
            </p>
          </div>
        ) : messages.length > 0 ? (
          <div className={`reveal ${messages.length > 0 ? 'visible' : ''}`} style={{ marginTop: 'var(--space-12)' }}>
            <h3 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 'var(--space-6)',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
            }}>
              {content.contact.guestbook.title}
              {isAdmin && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  animation: 'pulse 2s infinite',
                }} />
              )}
            </h3>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              {displayMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className="card card-body"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    position: 'relative',
                  }}
                >
                  {/* 删除按钮 - 仅管理员可见 */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteClick(msg)}
                      style={{
                        position: 'absolute',
                        top: 'var(--space-2)',
                        right: 'var(--space-2)',
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-base)',
                        zIndex: 10,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-error)'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                        e.currentTarget.style.color = 'var(--color-error)'
                      }}
                      title="删除此留言"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div className="card-content">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-3)',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--gradient-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-bold)',
                        }}>
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{
                          fontWeight: 'var(--font-semibold)',
                          fontSize: 'var(--text-base)',
                        }}>
                          {msg.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p 
                      style={{
                        lineHeight: 'var(--leading-relaxed)',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        transition: 'color var(--transition-fast)',
                        display: '-webkit-box',
                        WebkitLineClamp: expandedMessages[msg.id] ? 'unset' : (shouldCollapse(msg.message) ? 3 : 'unset'),
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                      onClick={() => viewMessageFull(msg)}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                    >
                      {msg.message}
                    </p>
                    {shouldCollapse(msg.message) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMessageExpand(msg.id)
                        }}
                        style={{
                          marginTop: 'var(--space-2)',
                          padding: 0,
                          border: 'none',
                          background: 'none',
                          color: 'var(--color-primary-600)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-medium)',
                          cursor: 'pointer',
                          transition: 'color var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-700)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'}
                      >
                        {expandedMessages[msg.id] ? '收起' : '展开全文'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMoreMessages && (
              <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                <button
                  onClick={() => setShowAllMessages(!showAllMessages)}
                  className="btn btn-secondary"
                  style={{
                    padding: 'var(--space-3) var(--space-6)',
                  }}
                >
                  {showAllMessages ? content.contact.guestbook.collapseButton : content.contact.guestbook.viewAllButton}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* 删除确认模态框 */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="400px"
      >
        {messageToDelete && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)',
              margin: '0 auto var(--space-4)',
            }}>
              <Trash2 size={24} color="var(--color-error)" />
            </div>

            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 'var(--space-2)',
              color: 'var(--color-text)',
              textAlign: 'center',
            }}>
              确认删除
            </h2>

            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 'var(--leading-relaxed)',
              textAlign: 'center',
            }}>
              确定要删除 <strong>"{messageToDelete.name}"</strong> 的留言吗？<br/>
              此操作无法撤销。
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="btn btn-ghost"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-primary"
                style={{
                  background: 'var(--color-error)',
                  color: 'white',
                  border: 'none',
                }}
              >
                删除
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* 留言全文模态框 */}
      <Modal
        isOpen={selectedMessage !== null}
        onClose={() => setSelectedMessage(null)}
        maxWidth="600px"
      >
        {selectedMessage && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)',
              paddingBottom: 'var(--space-4)',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-bold)',
              }}>
                {selectedMessage.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{
                  fontWeight: 'var(--font-semibold)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-text)',
                }}>
                  {selectedMessage.name}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                }}>
                  {formatTime(selectedMessage.timestamp)}
                </div>
              </div>
            </div>
            <div style={{
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {selectedMessage.message}
            </div>
          </>
        )}
      </Modal>

      {/* 密码登录模态框 */}
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

      {/* 通知 */}
      <Notification
        message={notification?.message}
        type={notification?.type}
      />
    </section>
  )
}
