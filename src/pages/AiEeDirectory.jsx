import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, X, Plus, ArrowLeft, Trash2, LogOut } from 'lucide-react'
import { content } from '../data/content'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToSection } from '../utils/scrollToSection'
import { isLoggedIn, login, logout, verifyPassword, getIdeas, saveIdeas, initializeDefaultIdeas, deleteIdea, editIdea } from '../utils/auth'
import Notification from '../components/ui/Notification'
import PasswordModal from '../components/ui/PasswordModal'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_IDEAS = content.thinking.aiEeIdeas

export default function AiEeDirectory() {
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState([])
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [newIdea, setNewIdea] = useState({ title: '', content: '' })
  const [editingIdea, setEditingIdea] = useState(null)
  const [editFormData, setEditFormData] = useState({ title: '', content: '' })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [ideaToDelete, setIdeaToDelete] = useState(null)
  const [notification, setNotification] = useState(null)
  
  const pageRef = useRef(null)

  // 加载 ideas 的通用函数
  const loadIdeas = () => {
    const adminStatus = isLoggedIn()
    setIsAdmin(adminStatus)
    
    const allIdeas = getIdeas()
    setIdeas(allIdeas)
  }

  // 初始化时加载 ideas 并检查是否需要初始化默认数据
  useEffect(() => {
    // 首次访问时自动初始化默认 ideas
    initializeDefaultIdeas(DEFAULT_IDEAS)
    
    // 加载 ideas
    loadIdeas()
  }, [])

  useEffect(() => {
    const initAnimations = () => {
      const revealElements = document.querySelectorAll('.reveal')
      revealElements.forEach((element) => {
        gsap.fromTo(element,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      const staggerContainers = document.querySelectorAll('.stagger')
      staggerContainers.forEach((container) => {
        gsap.fromTo(container.children,
          { y: 20, opacity: 0 },
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
    }

    const timer = setTimeout(initAnimations, 100)
    return () => clearTimeout(timer)
  }, [ideas])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedIdea(null)
        setIsAddModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteConfirmOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleCardClick = (idea) => {
    setSelectedIdea(idea)
  }

  const handleCloseModal = () => {
    setSelectedIdea(null)
  }

  const handleAddIdea = (e) => {
    e.preventDefault()
    if (!newIdea.title.trim() || !newIdea.content.trim()) {
      showNotification('请填写完整内容', 'error')
      return
    }

    const ideaToAdd = {
      id: Date.now(),
      title: newIdea.title.trim(),
      content: newIdea.content.trim(),
      detailedContent: newIdea.content.trim(),
      isDefault: false,
      createdAt: Date.now(),
    }

    // 保存所有 ideas（包括新添加的）
    const updatedIdeas = [...ideas, ideaToAdd]
    saveIdeas(updatedIdeas)
    
    setIdeas(updatedIdeas)
    setNewIdea({ title: '', content: '' })
    setIsAddModalOpen(false)
    showNotification('想法添加成功！', 'success')
  }

  // 处理编辑 idea
  const handleEditClick = (e, idea) => {
    e.stopPropagation()
    setEditingIdea(idea)
    setEditFormData({ title: idea.title, content: idea.content })
    setIsEditModalOpen(true)
  }

  const handleEditIdea = (e) => {
    e.preventDefault()
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      showNotification('请填写完整内容', 'error')
      return
    }

    const updatedIdea = {
      title: editFormData.title.trim(),
      content: editFormData.content.trim(),
      detailedContent: editFormData.content.trim(),
    }

    // 使用统一的编辑函数
    editIdea(editingIdea.id, updatedIdea)
    
    // 重新加载 ideas
    loadIdeas()
    
    setEditingIdea(null)
    setEditFormData({ title: '', content: '' })
    setIsEditModalOpen(false)
    showNotification('想法更新成功！', 'success')
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // 处理登录
  const handleLogin = async (e) => {
    e.preventDefault()
    if (await verifyPassword(password)) {
      login()
      setIsAdmin(true)
      setIsPasswordModalOpen(false)
      setPassword('')
      setLoginError(null)
      
      loadIdeas()
      
      showNotification('登录成功！', 'success')
    } else {
      setLoginError('密码错误')
      showNotification('密码错误，请重试', 'error')
    }
  }

  // 处理登出
  const handleLogout = () => {
    logout()
    setIsAdmin(false)
    loadIdeas() // 重新加载 ideas，确保显示所有 ideas
    showNotification('已退出登录', 'success')
  }

  // 打开删除确认弹窗
  const handleDeleteClick = (e, idea) => {
    e.stopPropagation()
    setIdeaToDelete(idea)
    setIsDeleteConfirmOpen(true)
  }

  // 确认删除 idea
  const handleConfirmDelete = () => {
    if (ideaToDelete) {
      // 使用统一的删除函数
      deleteIdea(ideaToDelete.id)
      
      // 重新加载 ideas
      loadIdeas()
      
      setIdeaToDelete(null)
      setIsDeleteConfirmOpen(false)
      showNotification('删除成功', 'success')
    }
  }

  // 取消删除
  const handleCancelDelete = () => {
    setIdeaToDelete(null)
    setIsDeleteConfirmOpen(false)
  }

  // Logo 点击处理
  const handleLogoClick = () => {
    if (isAdmin) {
      navigateToThinking()
    } else {
      setIsPasswordModalOpen(true)
    }
  }

  const navigateToThinking = () => {
    navigate('/#thinking')
    setTimeout(() => {
      // 滚动到 Thinking 板块，并同时显示 Experience 板块（第三个参数为 false，使用内置的特殊逻辑）
      scrollToSection('thinking', 80, false)
    }, 100)
  }

  return (
    <div ref={pageRef} className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
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
          <div className="flex-center">
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
              className="btn btn-secondary btn-icon"
              onClick={navigateToThinking}
            >
              <ArrowLeft size={18} />
              {isAdmin ? '返回 Thinking' : '返回 Thinking'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="page-main">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title text-gradient">AI+EE Ideas</h2>
            <p className="section-description">
              探索人工智能与电子工程交叉领域的创新想法
            </p>
          </div>

          {isAdmin && (
            <div className="reveal add-button-container">
              <button 
                className="btn btn-primary btn-icon"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={20} />
                Add New Idea
              </button>
            </div>
          )}

          {/* Ideas Grid */}
          <div className="grid-3 stagger">
            {ideas.map((idea, index) => (
              <div
                key={idea.id}
                className="card card-body idea-card"
                onClick={() => handleCardClick(idea)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {isAdmin && (
                  <div className="admin-actions">
                    <button
                      onClick={(e) => handleEditClick(e, idea)}
                      className="edit-btn"
                      title="编辑此想法"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                        <path d="m15 5 4 4"></path>
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => handleDeleteClick(e, idea)}
                      className="delete-btn"
                      title="删除此想法"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                
                <div className="card-content">
                  <div className="idea-icon">
                    <Lightbulb size={24} color="white" />
                  </div>

                  <h3 className="idea-card-title">
                    {idea.title}
                  </h3>

                  <p className="card-text idea-card-text">
                    {idea.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedIdea && (
        <div
          className="modal-backdrop"
          onClick={handleModalBackdropClick}
        >
          <div
            ref={modalRef}
            className="modal-content detail-modal"
          >
            <button
              onClick={handleCloseModal}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            <div className="idea-icon">
              <Lightbulb size={24} color="white" />
            </div>

            <h2 className="modal-header">
              {selectedIdea.title}
            </h2>

            <p className="modal-body-text">
              {selectedIdea.detailedContent || selectedIdea.content}
            </p>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false)
            }
          }}
        >
          <div
            className="modal-content add-edit-modal"
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            <h2 className="modal-header-sm">
              Add New Idea
            </h2>

            <form onSubmit={handleAddIdea}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  placeholder="Enter idea title..."
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label">
                  Content
                </label>
                <textarea
                  value={newIdea.content}
                  onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
                  placeholder="Describe your idea..."
                  rows={5}
                  className="form-textarea"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingIdea && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false)
            }
          }}
        >
          <div
            className="modal-content add-edit-modal"
          >
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            <h2 className="modal-header-sm">
              Edit Idea
            </h2>

            <form onSubmit={handleEditIdea}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  placeholder="Enter idea title..."
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label">
                  Content
                </label>
                <textarea
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  placeholder="Describe your idea..."
                  rows={5}
                  className="form-textarea"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && ideaToDelete && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelDelete()
            }
          }}
        >
          <div
            className="modal-content delete-confirm-modal"
          >
            <button
              onClick={handleCancelDelete}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            <div className="delete-icon-container">
              <Trash2 size={24} color="var(--color-error)" />
            </div>

            <h2 className="modal-title">
              确认删除
            </h2>

            <p className="modal-subtitle">
              确定要删除 <strong>"{ideaToDelete.title}"</strong> 这个想法吗？<br/>
              此操作无法撤销。
            </p>

            <div className="form-actions">
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
                className="btn btn-error"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      <Notification
        message={notification?.message}
        type={notification?.type}
      />

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

    </div>
  )
}
