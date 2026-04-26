/**
 * 通用工具函数：滚动到指定板块并触发动画显示
 * @param {string} sectionId - 目标板块的 ID
 * @param {number} navbarHeight - 导航栏高度（像素）
 * @param {boolean} showAllSections - 是否显示所有板块（用于导航栏点击）
 */
export const scrollToSection = (sectionId, navbarHeight = 80, showAllSections = false) => {
  const section = document.getElementById(sectionId)
  if (!section) return

  const elementPosition = section.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - navbarHeight

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  })

  setTimeout(() => {
    // 如果需要显示所有板块（导航栏点击或从二级目录返回）
    if (showAllSections || sectionId === 'thinking') {
      const allSections = document.querySelectorAll('section.section')
      allSections.forEach((sec) => {
        // 触发所有 .reveal 元素
        const revealElements = sec.querySelectorAll('.reveal')
        revealElements.forEach((el) => {
          el.classList.add('visible')
        })
        
        // 触发所有 .section-header
        const sectionHeader = sec.querySelector('.section-header')
        if (sectionHeader) {
          sectionHeader.classList.add('visible')
        }
        
        // 触发所有带有 reveal 类的子元素（包括 div、span 等）
        const allRevealChildren = sec.querySelectorAll('[class*="reveal"]')
        allRevealChildren.forEach((el) => {
          el.classList.add('visible')
        })
        
        // 触发所有内联样式中有 opacity 或 transform 的元素
        const allAnimatedElements = sec.querySelectorAll('*')
        allAnimatedElements.forEach((el) => {
          const style = window.getComputedStyle(el)
          if (style.opacity === '0' || style.transform.includes('translate')) {
            el.classList.add('visible')
          }
        })
      })
    } else {
      // 只触发目标板块显示
      const revealElements = section.querySelectorAll('.reveal')
      revealElements.forEach((el) => {
        el.classList.add('visible')
      })
      
      const sectionHeader = section.querySelector('.section-header')
      if (sectionHeader) {
        sectionHeader.classList.add('visible')
      }
    }
  }, 300)
}
