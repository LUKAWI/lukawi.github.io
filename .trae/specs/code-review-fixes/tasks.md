# Tasks

## 第一批：高优先级问题修复

- [x] Task 1: 修复 GitHub Pages 路由 404 问题（P2）
  - [x] Step 1.1: 创建 `public/404.html` 文件，包含 SPA 重定向脚本
  - [x] Step 1.2: 在 `src/App.jsx` 中添加重定向参数处理逻辑（useEffect 中处理 `_redirect` 参数）
  - [x] Step 1.3: 验证构建后 `dist/404.html` 正确生成

- [x] Task 2: 优化 Three.js 性能（P3）
  - [x] Step 2.1: 减少 Hero.jsx 粒子数量从 400 到 200
  - [x] Step 2.2: 减少 BottomBanner.jsx 粒子数量从 240 到 120
  - [x] Step 2.3: 在 Hero.jsx 中添加 IntersectionObserver 暂停不可见渲染
  - [x] Step 2.4: 在 BottomBanner.jsx 中添加 IntersectionObserver 暂停不可见渲染
  - [x] Step 2.5: 将 DPR 限制从 2 降低到 1.5
  - [x] Step 2.6: 添加移动端检测，移动端禁用 Three.js

- [x] Task 3: 密码哈希处理（P1）
  - [x] Step 3.1: 在 `src/utils/auth.js` 中实现 SHA-256 哈希函数
  - [x] Step 3.2: 将明文密码替换为 SHA-256 哈希值
  - [x] Step 3.3: 修改 `verifyPassword` 函数使用哈希比较
  - [x] Step 3.4: 验证登录功能正常工作

- [x] Task 4: 修复 GSAP 动画初始化（P4）
  - [x] Step 4.1: 在 `src/App.jsx` 中使用 `useLayoutEffect` 替代 `setTimeout`
  - [x] Step 4.2: 使用 `gsap.context()` 进行批量清理
  - [x] Step 4.3: 移除 `setTimeout` 延迟初始化逻辑
  - [x] Step 4.4: 验证动画在所有设备上正确触发

## 第二批：中优先级问题修复

- [x] Task 5: 清理未使用依赖（P7）
  - [x] Step 5.1: 从 `package.json` 移除 `framer-motion`
  - [x] Step 5.2: 从 `package.json` 移除 `@typescript-eslint/eslint-plugin`
  - [x] Step 5.3: 从 `package.json` 移除 `@typescript-eslint/parser`
  - [x] Step 5.4: 从 `package.json` 移除 `typescript-eslint`
  - [x] Step 5.5: 运行 `npm install` 更新依赖
  - [x] Step 5.6: 验证构建正常

- [x] Task 6: 抽取共享模态框组件（P6）
  - [x] Step 6.1: 创建 `src/components/ui/Modal.jsx` 通用模态框组件
  - [x] Step 6.2: 创建 `src/components/ui/Notification.jsx` 通知组件
  - [x] Step 6.3: 创建 `src/components/ui/PasswordModal.jsx` 密码登录模态框
  - [x] Step 6.4: 创建 `src/styles/modals.css` 模态框样式文件
  - [x] Step 6.5: 重构 `Navbar.jsx` 使用共享组件
  - [x] Step 6.6: 重构 `AiEeDirectory.jsx` 使用共享组件
  - [x] Step 6.7: 验证所有模态框功能正常

- [x] Task 7: 修复事件监听器内存泄漏（P9）
  - [x] Step 7.1: 在 Hero.jsx 的 animate 函数中添加 animationFrameRef
  - [x] Step 7.2: 在 cleanup 函数中调用 cancelAnimationFrame
  - [x] Step 7.3: 验证组件卸载后无残留动画帧

- [x] Task 8: 修复 useEffect 依赖数组（P10）
  - [x] Step 8.1: 修复 BottomBanner.jsx 中滚动监听 useEffect 的依赖数组
  - [x] Step 8.2: 使用 useRef 存储 lastScrollY 避免闭包陷阱
  - [x] Step 8.3: 验证滚动行为正常

- [x] Task 9: 提取内联样式（P5）
  - [x] Step 9.1: 将模态框相关内联样式提取到 modals.css
  - [x] Step 9.2: 将通知相关内联样式提取到 modals.css
  - [x] Step 9.3: 更新组件使用 CSS 类替代内联样式
  - [x] Step 9.4: 验证样式一致性

- [x] Task 10: 图片资源优化（P8）
  - [x] Step 10.1: 为所有图片添加 onError 处理
  - [x] Step 10.2: 添加图片加载失败的 fallback 占位图
  - [x] Step 10.3: 验证图片加载错误处理正常

## 第三批：验证

- [x] Task 11: 全面验证
  - [x] Step 11.1: 运行 `npm run build` 确保构建成功
  - [x] Step 11.2: 运行 `npm run preview` 预览构建结果
  - [x] Step 11.3: 验证 GitHub Pages 路由重定向正常
  - [x] Step 11.4: 验证 Three.js 性能优化效果
  - [x] Step 11.5: 验证密码登录功能正常
  - [x] Step 11.6: 验证 GSAP 动画正常触发
  - [x] Step 11.7: 验证所有模态框功能正常
  - [x] Step 11.8: 验证无控制台错误
  - [x] Step 11.9: 验证移动端显示正常

# Task Dependencies
- [Task 11] depends on [Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9, Task 10]
- [Task 6] depends on [Task 5]（共享组件需要清理依赖后创建）
- Task 1-4 可并行执行
- Task 5-10 可并行执行（除 Task 6 依赖 Task 5）
