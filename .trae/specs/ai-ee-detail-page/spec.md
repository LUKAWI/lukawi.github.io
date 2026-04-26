# AI+EE 二级目录页面 Spec

## Why
为 Thinking 板块中的"AI+EE"卡片添加详情页功能，让用户可以点击"Read More"查看更详细的内容，展示具体的 idea 和技术项目。

## What Changes
- 创建 AI+EE 详情页面组件，使用与主站相同的技术栈（React + Vite）和设计语言
- 在 content.js 中为 AI+EE idea 添加详情页数据（子卡片列表）
- 修改 Thinking 组件，为 AI+EE 卡片的"Read More"链接添加路由跳转
- 添加详情页路由配置
- 实现圆角卡片展示具体 idea，支持点击放大浏览详细内容
- 添加新增 idea 卡片的功能（通过数据配置方式）

## Impact
- 新增文件：`src/pages/AiEeDetail.jsx`
- 修改文件：`src/App.jsx`（添加路由）, `src/components/Thinking.jsx`（添加跳转链接）, `src/data/content.js`（添加详情页数据）
- 需要安装 react-router-dom（如果尚未安装）

## ADDED Requirements
### Requirement: AI+EE 详情页面
系统 SHALL 提供一个独立的详情页面，展示 AI+EE 主题下的具体 idea 和技术项目。

#### Scenario: 用户访问详情页
- **WHEN** 用户点击 AI+EE 卡片的"Read More"链接
- **THEN** 跳转到 `/ai-ee` 路由，显示详情页面

### Requirement: 圆角卡片展示
系统 SHALL 使用圆角卡片展示每个具体的 idea，卡片包含：
- 标题
- 描述内容
- 技术标签
- 可点击放大查看详情

#### Scenario: 查看 idea 详情
- **WHEN** 用户点击某个 idea 卡片
- **THEN** 以模态框或展开形式显示详细内容

### Requirement: 自定义添加 idea
系统 SHALL 支持通过在 content.js 中添加数据来新增 idea 卡片。

#### Scenario: 添加新 idea
- **WHEN** 在 content.js 的 aiEeIdeas 数组中添加新对象
- **THEN** 页面自动显示新的 idea 卡片

## MODIFIED Requirements
### Requirement: Thinking 板块数据
在 content.js 中，为 AI+EE idea 添加 `detailPageData` 字段，包含：
- `pageTitle`: 页面标题
- `description`: 页面描述
- `ideas`: 子 idea 数组（每个包含 id, title, content, tags, detailedContent）

## REMOVED Requirements
无
