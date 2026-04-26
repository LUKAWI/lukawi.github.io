import { Lock } from 'lucide-react'
import Modal from './Modal'

export default function PasswordModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  password, 
  setPassword, 
  error 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      maxWidth="400px"
    >
      <div className="password-modal-icon">
        <Lock size={32} color="white" />
      </div>

      <h2 className="modal-title">
        开发者登录
      </h2>
      
      <p className="modal-subtitle">
        请输入密码以访问开发者功能
      </p>

      <form onSubmit={(e) => { e.preventDefault(); onLogin(e) }}>
        <div className="form-group">
          <label className="form-label">
            密码
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码..."
            autoFocus
            className={`form-input ${error ? 'form-input-error' : ''}`}
          />
          {error && (
            <p className="form-error">
              {error}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-full-width">
          登录
        </button>
      </form>
    </Modal>
  )
}
