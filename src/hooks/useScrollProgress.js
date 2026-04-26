import { useState, useEffect, useRef } from 'react'

/**
 * useScrollProgress Hook
 * Calculates scroll progress (0 to 1) and optionally updates an element's width
 *
 * @param {Object} options - Configuration options
 * @param {string} options.targetSelector - CSS selector for progress bar element
 * @param {boolean} options.throttle - Throttle update frequency (default true)
 * @returns {Object} { progress, scrollPercent } - Current scroll progress (0-1) and percentage
 *
 * @example
 * const { progress } = useScrollProgress({ targetSelector: '#scroll-progress' });
 * // In JSX: <div id="scroll-progress" style={{ width: `${progress * 100}%` }} />
 */
export default function useScrollProgress(options = {}) {
  const { targetSelector, throttle = true } = options
  const [progress, setProgress] = useState(0)
  const [scrollPercent, setScrollPercent] = useState(0)
  const rafRef = useRef(null)
  const lastUpdateRef = useRef(0)

  useEffect(() => {
    const updateProgress = () => {
      // Get scroll values
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

      // Calculate progress (0 to 1)
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      const percent = Math.round(scrollProgress * 100)

      // Throttle updates to every 50ms for performance
      if (throttle) {
        const now = Date.now()
        if (now - lastUpdateRef.current < 50) {
          rafRef.current = requestAnimationFrame(updateProgress)
          return
        }
        lastUpdateRef.current = now
      }

      setProgress(scrollProgress)
      setScrollPercent(percent)

      // Update target element if selector provided
      if (targetSelector) {
        const target = document.querySelector(targetSelector)
        if (target) {
          target.style.width = `${percent}%`
        }
      }

      rafRef.current = requestAnimationFrame(updateProgress)
    }

    // Start tracking
    rafRef.current = requestAnimationFrame(updateProgress)

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [targetSelector, throttle])

  return { progress, scrollPercent }
}
