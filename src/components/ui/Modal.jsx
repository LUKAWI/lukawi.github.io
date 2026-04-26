import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }) {
  const modalRef = useRef(null)
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
      )
    }
  }, [isOpen])
  
  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      })
    } else {
      onClose()
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        ref={modalRef}
        className={`modal-content ${maxWidth === '400px' ? 'password-modal' : maxWidth === '600px' ? 'detail-modal' : maxWidth === '500px' ? 'add-edit-modal' : ''}`}
        style={maxWidth !== '600px' ? { maxWidth } : undefined}
      >
        <button
          onClick={handleClose}
          className="modal-close-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {title && (
          <h2 className="modal-header-sm">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}
