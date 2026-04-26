# 代码审查高/中优先级问题修复 Spec

## Why
根据全面的代码审查报告，项目存在 4 个高优先级问题和 6 个中优先级问题，影响 GitHub Pages 部署、性能、安全性和可维护性。需要系统性地修复这些问题。

## What Changes

### 高优先级修复（第一批）

- **P2**: 修复 GitHub Pages 路由 404 问题 — 创建 `public/404.html` 重定向脚本，在 `App.jsx` 中添加重定向处理逻辑
- **P3**: 优化 Three.js 性能 — 减少粒子数量（Hero: 400→200, BottomBanner: 240→120），添加 `IntersectionObserver` 暂停不可见区域渲染，限制 DPR
- **P1**: 密码哈希处理 — 使用 SHA-256 哈希替代明文密码存储
- **P4**: 修复 GSAP 动画初始化时机 — 使用 `useLayoutEffect` 替代 `setTimeout`，使用 `gsap.context()` 进行批量清理

### 中优先级修复（第二批）

- **P7**: 清理未使用依赖 — 从 `package.json` 移除 `framer-motion`、`@typescript-eslint/*`、`typescript-eslint`
- **P6**: 抽取共享模态框组件 — 创建 `Modal.jsx`、`Notification.jsx`、`PasswordModal.jsx` 共享组件
- **P9**: 修复事件监听器内存泄漏 — 在 `Hero.jsx` 中添加 `requestAnimationFrame` 的取消逻辑
- **P10**: 修复 `useEffect` 依赖数组 — 修复 `BottomBanner.jsx` 中的闭包陷阱
- **P5**: 提取内联样式 — 将重复的内联样式提取为 CSS 类
- **P8**: 图片资源优化 — 添加图片加载错误处理和 fallback

## Impact
- Affected specs: 无（独立修复）
- Affected code:
  - `src/App.jsx`
  - `src/components/Hero.jsx`
  - `src/components/BottomBanner.jsx`
  - `src/utils/auth.js`
  - `src/components/Navbar.jsx`
  - `src/pages/AiEeDirectory.jsx`
  - `package.json`
  - `public/404.html`（新建）
  - `src/components/ui/Modal.jsx`（新建）
  - `src/components/ui/Notification.jsx`（新建）
  - `src/components/ui/PasswordModal.jsx`（新建）
  - `src/styles/modals.css`（新建）

## ADDED Requirements

### Requirement: GitHub Pages SPA 路由支持
系统 SHALL 提供 GitHub Pages 上的 SPA 路由支持，确保刷新子路由页面不出现 404 错误。

#### Scenario: 用户刷新子路由页面
- **WHEN** 用户访问 `/thinking/ai-ee` 并刷新页面
- **THEN** 页面应正确重定向到该路由，显示 AI+EE Ideas 页面

#### Scenario: 用户直接访问子路由 URL
- **WHEN** 用户直接在浏览器输入子路由 URL
- **THEN** 页面应正确加载并显示对应内容

### Requirement: Three.js 性能优化
系统 SHALL 优化 Three.js 渲染性能，确保在移动端和低性能设备上流畅运行。

#### Scenario: 页面加载
- **WHEN** 用户加载页面
- **THEN** Hero 区域粒子数量不超过 200，BottomBanner 不超过 120

#### Scenario: 不可见区域
- **WHEN** Three.js 渲染区域滚动到不可见
- **THEN** 渲染循环应暂停以节省资源

### Requirement: 密码安全存储
系统 SHALL 使用 SHA-256 哈希存储密码，避免明文存储。

#### Scenario: 密码验证
- **WHEN** 用户输入密码
- **THEN** 系统应将输入密码的 SHA-256 哈希与存储的哈希进行比较

### Requirement: GSAP 动画可靠初始化
系统 SHALL 使用可靠的方法初始化 GSAP 动画，确保在所有设备上正确触发。

#### Scenario: 页面加载完成
- **WHEN** DOM 完全渲染
- **THEN** GSAP 动画应自动初始化，不依赖 setTimeout

### Requirement: 共享模态框组件
系统 SHALL 提供可复用的模态框组件，减少代码重复。

#### Scenario: 使用共享模态框
- **WHEN** Navbar 和 AiEeDirectory 需要显示模态框
- **THEN** 应使用共享的 Modal、Notification、PasswordModal 组件

### Requirement: 事件监听器正确清理
系统 SHALL 正确清理事件监听器和 requestAnimationFrame，避免内存泄漏。

#### Scenario: 组件卸载
- **WHEN** Hero 或 BottomBanner 组件卸载
- **THEN** 所有事件监听器和动画帧应被正确取消

## MODIFIED Requirements

### Requirement: 依赖管理
当前包含的未使用依赖 SHALL 被移除，包括 `framer-motion`、`@typescript-eslint/eslint-plugin`、`@typescript-eslint/parser`、`typescript-eslint`。

## REMOVED Requirements

### Requirement: 明文密码存储
**Reason**: 明文密码存储是安全不良实践
**Migration**: 迁移到 SHA-256 哈希存储

### Requirement: setTimeout 动画初始化
**Reason**: setTimeout 等待 DOM 渲染不可靠
**Migration**: 迁移到 useLayoutEffect + gsap.context()
