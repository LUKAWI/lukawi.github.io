import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Notification({ message, type = 'success', duration = 3000 }) {
  const notifRef = useRef(null)
  
  useEffect(() => {
    if (notifRef.current) {
      gsap.fromTo(notifRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [])
  
  if (!message) return null
  
  return (
    <div
      ref={notifRef}
      className={`notification ${type}`}
    >
      {message}
    </div>
  )
}
