# AI+EE 二级目录功能规范

## Why
当前 Thinking 板块中的 AI+EE 想法卡片点击"Read More"后没有实际功能。需要为 AI+EE 板块添加二级目录页面，展示更多相关的 idea 卡片，并提供添加新想法的功能。

## What Changes
- 创建新的二级目录页面 `/thinking/ai-ee`，**完全复用主站的设计系统和组件**
- 将 AI+EE 相关的 idea 卡片以圆角卡片形式展示（使用 `--radius-xl` 和 `--radius-2xl`）
- 点击卡片可放大浏览详细内容（模态框形式，带平滑动画）
- 添加"添加新想法"功能，允许用户自定义新增卡片和内容
- 主页面 Thinking 板块的 AI+EE 卡片"Read More"链接跳转到二级目录
- **所有交互效果（悬停、点击、过渡）与主站保持一致**

## Impact
- 新增文件：`src/pages/AiEeDirectory.jsx`
- 修改文件：`src/components/Thinking.jsx`（添加跳转链接）
- 修改文件：`src/App.jsx`（添加路由）
- 修改文件：`src/data/content.js`（添加 AI+EE 相关数据）
- 修改文件：`src/styles/globals.css`（添加模态框和目录页样式）

## ADDED Requirements

### Requirement: 二级目录页面
The system SHALL provide a dedicated page at `/thinking/ai-ee` displaying AI+EE related idea cards

#### Scenario: 用户访问二级目录
- **WHEN** 用户点击 AI+EE 卡片的"Read More"按钮
- **THEN** 跳转到 `/thinking/ai-ee` 页面，展示所有 AI+EE 相关的 idea 卡片
- **DESIGN**: 页面必须使用与主站完全相同的设计语言（颜色变量、字体、间距系统）

### Requirement: 圆角卡片展示
The system SHALL display idea cards with rounded corners, consistent with the existing design language

#### Scenario: 卡片展示
- **WHEN** 页面加载完成
- **THEN** 所有 idea 卡片以网格布局展示，带有圆角、阴影和悬停效果
- **DESIGN**: 
  - 卡片圆角：`border-radius: var(--radius-xl)` (16px) 或 `var(--radius-2xl)` (20px)
  - 阴影效果：使用 `--shadow-md`（默认）和 `--shadow-lg`（悬停）
  - 悬停动画：`transform: translateY(-8px)` + 阴影增强，过渡时间 `var(--transition-base)` (300ms)
  - 热浪涟漪效果：复用主站 `.card::before` 径向渐变效果

### Requirement: 卡片详情查看
The system SHALL provide a modal to view detailed content when clicking on a card

#### Scenario: 点击卡片查看详情
- **WHEN** 用户点击任意 idea 卡片
- **THEN** 弹出模态框，放大显示该 idea 的详细内容
- **DESIGN**:
  - 模态框圆角：`var(--radius-2xl)` (20px)
  - 背景遮罩：半透明黑色背景 `rgba(0,0,0,0.5)`
  - 打开/关闭动画：使用 `var(--transition-spring)` (600ms cubic-bezier)
  - 关闭按钮：右上角圆形按钮，悬停有颜色变化

### Requirement: 添加新想法
The system SHALL provide a form to add new idea cards with custom title and content

#### Scenario: 用户添加新想法
- **WHEN** 用户点击"Add New Idea"按钮并填写表单
- **THEN** 新卡片被添加到页面，并保存到本地存储
- **DESIGN**:
  - 表单样式：输入框使用 `var(--radius-md)` 圆角，聚焦时有橙色边框
  - 提交按钮：使用主站 `.btn-primary` 渐变橙色样式
  - 表单模态框：与详情模态框相同的设计风格

### Requirement: 数据持久化
The system SHALL persist idea cards data using localStorage

#### Scenario: 数据持久化
- **WHEN** 用户刷新页面
- **THEN** 所有添加的 idea 卡片仍然存在

### Requirement: 动态交互效果
The system SHALL implement interactive animations consistent with the main site

#### Scenario: 所有交互场景
- **卡片悬停**: 上浮 8px + 阴影增强 + 径向渐变从中心扩散
- **卡片点击**: 使用 `scale(0.95)` 的点击反馈（复用主站 `.btn:active`）
- **页面加载**: 使用 `.reveal` 和 `.stagger` 类实现渐进式显示动画
- **模态框**: 平滑的淡入淡出 + 缩放动画
- **按钮**: 所有按钮使用主站 `.btn` 基础样式，悬停和点击有相应变换

## MODIFIED Requirements

### Requirement: Thinking 板块 AI+EE 卡片
The AI+EE card in Thinking section SHALL have a working "Read More" link

**Before**: "Read More"链接没有实际功能
**After**: 点击跳转到 `/thinking/ai-ee` 二级目录页面

## REMOVED Requirements
无
