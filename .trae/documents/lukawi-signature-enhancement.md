# LUKAWI 签名标签增强计划

## 目标
1. 将点击展开/收起功能改为滚轮滚动到底部时平滑地自动展开
2. 从网络上选择一个更炫酷科幻的 React 框架字体替换当前字体

## 实施步骤

### 第一阶段：实现滚轮滚动自动展开功能

#### 步骤 1.1：分析当前实现
- 查看 BottomBanner.jsx 的当前状态
- 理解现有的 useState 和 onClick 处理逻辑
- 确定需要移除的点击交互代码

#### 步骤 1.2：实现滚动监听
- 使用 useEffect 添加全局滚动事件监听器
- 计算滚动位置与页面底部的距离
- 设置合适的触发阈值（如距离底部 100px）
- 当滚动到底部时，自动设置 isExpanded 为 true
- 当向上滚动离开底部时，自动设置 isExpanded 为 false

#### 步骤 1.3：优化滚动体验
- 添加防抖或节流处理，避免频繁触发
- 使用 requestAnimationFrame 优化性能
- 确保滚动检测的平滑性和准确性

#### 步骤 1.4：移除点击交互
- 移除 onClick 事件处理器
- 移除 cursor: pointer 样式（可选，保持视觉反馈）
- 更新底部提示文本（从"点击展开"改为自动展开提示）

### 第二阶段：替换为科幻风格字体

#### 步骤 2.1：研究科幻风格字体选项
搜索并评估以下字体选项：
- **Orbitron** - 未来感强的无衬线字体
- **Rajdhani** - 方形、技术感的字体
- **Exo 2** - 现代科技风格
- **Audiowide** - 流线型科幻字体
- **Press Start 2P** - 像素风格（备选）
- **Share Tech Mono** - 等宽科技字体

#### 步骤 2.2：选择并集成字体
推荐选择：**Orbitron** 或 **Rajdhani** 或 **Exo 2**
- 从 Google Fonts 引入
- 在 globals.css 中添加字体导入
- 更新 CSS 变量 --font-display

#### 步骤 2.3：应用新字体
- 更新 BottomBanner 组件中的 fontFamily
- 可能调整 letter-spacing 和 font-weight 以适配新字体
- 确保渐变和描边效果在新字体上依然美观

#### 步骤 2.4：测试和优化
- 在不同浏览器中测试字体渲染效果
- 检查移动端字体显示
- 调整字体大小和间距以达到最佳视觉效果

### 第三阶段：测试和验证

#### 步骤 3.1：功能测试
- 测试滚动到底部时自动展开功能
- 测试向上滚动时收起功能
- 测试防抖/节流效果
- 验证性能（无卡顿、无内存泄漏）

#### 步骤 3.2：视觉测试
- 验证新字体的显示效果
- 检查 LUKAWI 文本的渐变、阴影、描边效果
- 确认 Three.js 背景动画正常
- 测试响应式布局

#### 步骤 3.3：代码质量
- 运行 ESLint 检查
- 确保无控制台错误
- 验证代码符合项目规范

## 技术实现细节

### 滚动检测实现方案
```javascript
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const threshold = 100 // 距离底部 100px 触发
    
    const isAtBottom = documentHeight - scrollPosition < threshold
    
    if (isAtBottom && !isExpanded) {
      setIsExpanded(true)
    } else if (!isAtBottom && isExpanded) {
      setIsExpanded(false)
    }
  }
  
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始检查
  
  return () => window.removeEventListener('scroll', handleScroll)
}, [isExpanded])
```

### 字体集成方案
在 globals.css 中添加：
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
```

更新字体变量：
```css
--font-display: 'Orbitron', 'Noto Sans SC', sans-serif;
```

## 验收标准
- [ ] 滚动到页面底部时，LUKAWI 签名自动平滑展开
- [ ] 向上滚动离开底部时，签名自动收起
- [ ] 展开/收起动画流畅，无卡顿
- [ ] 新字体显示效果炫酷、科幻感强
- [ ] 所有视觉效果（渐变、阴影、描边）保持完美
- [ ] Three.js 背景动画正常运行
- [ ] 响应式设计正常工作
- [ ] 无 ESLint 错误
- [ ] 性能良好（60fps）
