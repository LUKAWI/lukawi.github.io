import { useState, useEffect, useRef } from 'react'

/**
 * useMagnetic Hook
 * Creates a magnetic button effect that follows the cursor
 *
 * @param {Object} options - Configuration options
 * @param {number} options.strength - Magnetic strength (0-1), default 0.3
 * @param {number} options.distance - Max distance for effect in px, default 100
 * @returns {Object} { ref, position } - ref to attach to element, current position
 *
 * @example
 * const { ref } = useMagnetic({ strength: 0.2 });
 * <button ref={ref} className="btn-magnetic">Click me</button>
 */
export default function useMagnetic(options = {}) {
  const { strength = 0.3, distance = 100 } = options
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let ticking = false

    const handleMouseMove = (e) => {
      const clientX = e.clientX
      const clientY = e.clientY

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2

          const deltaX = clientX - centerX
          const deltaY = clientY - centerY

          // Calculate distance from center
          const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

          if (dist <= distance) {
            // Calculate magnetic offset based on strength
            const moveX = deltaX * strength
            const moveY = deltaY * strength
            setPosition({ x: moveX, y: moveY })
          } else {
            setPosition({ x: 0, y: 0 })
          }

          ticking = false
        })
        ticking = true
      }
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, distance])

  // Apply transform to element
  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.style.transform = `translate(${position.x}px, ${position.y}px)`
  }, [position])

  return { ref }
}
