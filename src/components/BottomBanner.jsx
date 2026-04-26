import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function BottomBanner() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastScrollYRef = useRef(window.scrollY)
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(true)

  // IntersectionObserver 用于检测 BottomBanner 区域是否可见
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // 滚动监听 - 自动展开/收起
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const threshold = 100
          const currentScrollY = window.scrollY
          
          const isAtBottom = documentHeight - scrollPosition < threshold
          const isScrollingDown = currentScrollY > lastScrollYRef.current
          
          if (isAtBottom && isScrollingDown) {
            setIsExpanded(true)
            setIsVisible(true)
          } else if (!isScrollingDown && isExpanded) {
            setIsExpanded(false)
            setTimeout(() => setIsVisible(false), 500)
          }
          
          lastScrollYRef.current = currentScrollY
          ticking = false
        })
        
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 初始化 Three.js 场景
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // 场景创建
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 相机设置
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / 300,
      0.1,
      1000,
    )
    camera.position.z = 50

    // 渲染器设置
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(containerRef.current.clientWidth, 300)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    // 创建粒子系统
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 120
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    // 粒子材质 - 使用橙黄色渐变
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xF97316,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    // 创建粒子网格
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // 创建波浪几何体 - 增强曲线效果（放在文字后面）
    const waveGeometry = new THREE.PlaneGeometry(150, 40, 100, 30) // 增宽到 150（匹配 LUKAWI 宽度），增加高度到 40
    const waveMaterial = new THREE.MeshBasicMaterial({
      color: 0xFBBF24,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial)
    waveMesh.rotation.x = -Math.PI / 3
    waveMesh.position.z = -20 // 放在更后面，让文字在前面
    scene.add(waveMesh)

    // 动画变量
    let time = 0

    // 动画循环 - 持续运行，不依赖任何状态
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      // 当 BottomBanner 区域不可见时暂停渲染
      if (!isIntersecting) return

      time += 0.005

      // 粒子动画
      particlesMesh.rotation.y = time * 0.1
      particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.1

      // 波浪动画 - 增强波动效果
      const positions = waveGeometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        positions[i + 2] = Math.sin(x * 0.5 + time) * 3 // 增加振幅，从 2 到 3
      }
      waveGeometry.attributes.position.needsUpdate = true

      // 波浪曲线亮暗周期波动效果 - 实时持续闪烁
      const brightnessCycle = Math.sin(time * 6.28) // 周期波动：1 秒周期（time 增量为 0.005，2π/0.005 ≈ 1 秒）
      const baseOpacity = 0.12 // 基础透明度
      const opacityVariation = 0.06 // 透明度变化幅度
      const currentOpacity = baseOpacity + (brightnessCycle * opacityVariation) // 0.06 - 0.18
      waveMaterial.opacity = Math.max(0.06, Math.min(0.18, currentOpacity)) // 限制范围

      renderer.render(scene, camera)
    }

    animate()

    // 响应式处理
    const handleResize = () => {
      if (!containerRef.current) return
      
      const width = containerRef.current.clientWidth
      const height = 300
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      waveGeometry.dispose()
      waveMaterial.dispose()
      renderer.dispose()
    }
  }, [isIntersecting])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-alt)',
        padding: 'var(--space-12)',
        overflow: 'hidden',
      }}
      className="lukawi-signature-container"
    >
      {/* Three.js Canvas - 包含粒子和波浪曲线背景 */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '300px',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: isVisible ? 1 : 0.3,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* LUKAWI Text - Artistic Style */}
      <h1
        style={{
          fontSize: 'calc(var(--text-8xl) * 1)',
          fontWeight: '900',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: 0,
          lineHeight: 1,
          fontFamily: "'Orbitron', var(--font-display), var(--font-primary)",
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          WebkitTextStroke: '1px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 10,
        }}
        className="lukawi-signature-text"
      >
        LUKAWI
      </h1>
    </div>
  )
}
