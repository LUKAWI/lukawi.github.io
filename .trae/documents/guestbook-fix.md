# 留言板修复计划

## 问题分析

### 问题 1: 添加留言后无法正常显示

**根因**: 留言展示区域使用了 `.reveal` 类（第 414 行），该类初始状态为 `opacity: 0; transform: translateY(30px)`，需要通过 IntersectionObserver 添加 `.visible` 类才能显示。

当组件首次挂载时 `messages` 为空数组 `[]`，留言区域不渲染。当用户提交新留言后，`messages.length > 0` 条件满足，区域开始渲染，但此时 `.reveal` 元素刚进入 DOM，IntersectionObserver 可能还未触发，导致留言不可见。

**修复方案**: 在留言展示区域的外层 div 上添加条件类，当有留言时自动添加 `visible` 类：
```jsx
<div className={`reveal ${messages.length > 0 ? 'visible' : ''}`} style={{ marginTop: 'var(--space-12)' }}>
```

### 问题 2: 添加开发者模式删除功能

**需求**: 参考 `AiEeDirectory.jsx` 的实现，在开发者登录模式下，每条留言显示删除按钮，点击后弹出确认对话框，确认后删除留言。

## 实施步骤

### Step 1: 修复留言显示问题
- 修改 `src/components/Contact.jsx` 第 414 行
- 在留言展示区域的 div 上添加 `${messages.length > 0 ? 'visible' : ''}` 条件类

### Step 2: 添加开发者模式支持
- 导入 auth 相关函数：`isLoggedIn`
- 导入共享组件：`PasswordModal`、`Notification`
- 导入图标：`Lock`、`Trash2`、`LogOut`
- 添加状态：`isAdmin`、`isPasswordModalOpen`、`password`、`loginError`、`notification`
- 添加 `useEffect` 监听登录状态变化（`isLoggedIn()` 和 `storage` 事件）
- 添加 `handleLogin`、`handleLogout`、`handleLogoClick` 函数
- 添加 `showNotification` 函数

### Step 3: 添加删除功能
- 添加状态：`isDeleteConfirmOpen`、`messageToDelete`
- 添加 `handleDeleteMessage` 函数：
  - 从 messages 数组中过滤掉指定 id 的留言
  - 更新 localStorage
  - 更新 state
- 在每条留言卡片右上角添加删除按钮（仅 `isAdmin` 时显示）
- 添加删除确认模态框（使用共享 `Modal` 组件）

### Step 4: 添加密码登录模态框
- 使用共享的 `PasswordModal` 组件
- 在 logo 点击时触发登录

### Step 5: 添加通知组件
- 使用共享的 `Notification` 组件
- 登录成功、删除成功等操作显示通知

## 修改文件
- `src/components/Contact.jsx` - 主要修改文件
