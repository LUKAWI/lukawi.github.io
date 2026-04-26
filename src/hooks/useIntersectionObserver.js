import { useState, useEffect, useRef } from 'react'

/**
 * useIntersectionObserver Hook
 * Detects when an element enters or leaves the viewport
 *
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Trigger when % of element is visible (0-1), default 0.1
 * @param {number} options.rootMargin - Margin around root, e.g., '0px 0px -100px 0px'
 * @returns {Object} { ref, isVisible, entry } - ref to attach, visibility state, intersection entry
 *
 * @example
 * const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });
 * <div ref={ref} className={isVisible ? 'visible' : ''}>Content</div>
 */
export default function useIntersectionObserver(options = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options
  const [isVisible, setIsVisible] = useState(false)
  const [entry, setEntry] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        setEntry(entry)
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin])

  return { ref, isVisible, entry }
}

/**
 * Multiple target variant - observe multiple elements
 * @returns {Object} { refs, visibleIds } - refs object keyed by id, set of visible ids
 */
export function useMultipleIntersectionObserver(targets = [], options = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options
  const [visibleIds, setVisibleIds] = useState(new Set())
  const refs = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisible = new Set(visibleIds)
        entries.forEach((entry) => {
          const id = entry.target.dataset.intersectionId
          if (entry.isIntersecting) {
            newVisible.add(id)
          } else {
            newVisible.delete(id)
          }
        })
        setVisibleIds(newVisible)
      },
      {
        threshold,
        rootMargin,
      },
    )

    // Observe all targets
    targets.forEach((id) => {
      const element = refs.current[id]
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      targets.forEach((id) => {
        const element = refs.current[id]
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [targets, threshold, rootMargin])

  const setRef = (id) => (element) => {
    refs.current[id] = element
  }

  return { refs: refs.current, setRef, visibleIds }
}
