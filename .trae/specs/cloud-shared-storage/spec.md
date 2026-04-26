# 云端共享存储 Spec

## Why
当前留言板（guestbook messages）和 AI+EE Ideas 使用 localStorage 存储，数据仅保存在单个用户的浏览器中，无法在不同访客之间共享。用户希望留言和 idea 能够永久保存并与所有访客共享。

## What Changes
- **引入 GitHub Gist API 作为云端存储**：使用 GitHub Gist 存储留言和 ideas 数据，实现跨用户共享
- **创建统一的云存储工具模块**：新建 `src/utils/cloudStorage.js`，封装所有云端读写操作
- **保留 localStorage 作为缓存和离线后备**：优先从云端加载，失败时使用本地缓存
- **修改 Contact.jsx 留言逻辑**：从云端读写留言数据
- **修改 AiEeDirectory.jsx ideas 逻辑**：从云端读写 ideas 数据
- **修改 auth.js**：保留本地认证逻辑，移除 ideas 相关的 localStorage 函数（迁移到云存储）
- **添加 .env 配置**：支持配置 Gist ID 和访问令牌

## Impact
- **Affected specs**: 
  - ai-ee-ideas-storage（之前的 ideas 存储方案，将被本方案替代）
- **Affected code**: 
  - `src/utils/cloudStorage.js` - 新建云存储工具模块
  - `src/utils/auth.js` - 保留认证逻辑，移除 ideas 存储函数
  - `src/components/Contact.jsx` - 修改留言读写逻辑
  - `src/pages/AiEeDirectory.jsx` - 修改 ideas 读写逻辑
  - `.env` - 添加云存储配置

## ADDED Requirements

### Requirement: 云存储工具模块
The system SHALL provide a cloud storage utility module that uses GitHub Gist API for persistent shared storage.

#### Scenario: 初始化云存储
- **WHEN** 应用首次启动且云端无数据
- **THEN** 系统自动在 GitHub 上创建 Gist 存储文件（需要管理员配置）
- **OR** 如果无法创建，使用默认数据并提示管理员配置

#### Scenario: 读取云端数据
- **WHEN** 用户访问页面
- **THEN** 系统从 GitHub Gist 加载数据
- **AND** 如果加载失败，使用 localStorage 缓存数据作为后备

#### Scenario: 写入云端数据
- **WHEN** 管理员添加/修改/删除留言或 idea
- **THEN** 系统先将数据保存到云端 Gist
- **AND** 同时更新 localStorage 缓存
- **AND** 如果云端保存失败，显示错误提示但保留本地更改

### Requirement: 留言云端存储
The system SHALL store guestbook messages in cloud storage shared by all visitors.

#### Scenario: 加载留言
- **WHEN** 用户访问 Contact 页面
- **THEN** 系统从云端加载所有留言
- **AND** 按时间倒序显示（最新在前）

#### Scenario: 提交留言
- **WHEN** 用户提交新留言
- **THEN** 留言被添加到云端存储
- **AND** 所有访客都能看到新留言

#### Scenario: 删除留言
- **WHEN** 管理员删除留言
- **THEN** 留言从云端存储中永久删除
- **AND** 所有访客的页面都会更新

### Requirement: Ideas 云端存储
The system SHALL store AI+EE ideas in cloud storage shared by all visitors.

#### Scenario: 加载 ideas
- **WHEN** 用户访问 AI+EE Directory 页面
- **THEN** 系统从云端加载所有 ideas
- **AND** 如果云端为空，使用 content.js 中的默认 ideas 初始化

#### Scenario: 添加 idea
- **WHEN** 管理员添加新 idea
- **THEN** idea 被保存到云端存储
- **AND** 所有访客都能看到新 idea

#### Scenario: 编辑 idea
- **WHEN** 管理员编辑 idea
- **THEN** idea 在云端存储中更新
- **AND** 所有访客都能看到更新后的内容

#### Scenario: 删除 idea
- **WHEN** 管理员删除 idea
- **THEN** idea 从云端存储中永久删除
- **AND** 所有访客的页面都会更新

### Requirement: 配置管理
The system SHALL support configuration via environment variables.

#### Scenario: 环境变量配置
- **WHEN** 应用启动
- **THEN** 读取 `.env` 中的以下配置：
  - `VITE_GITHUB_TOKEN` - GitHub 个人访问令牌（用于写入）
  - `VITE_GIST_ID` - GitHub Gist ID（用于读写）
- **AND** 如果未配置，显示配置提示

### Requirement: 数据模型
The system SHALL use the following data structures:

```javascript
// 留言数据模型
{
  id: number,           // 唯一标识符（时间戳）
  name: string,         // 昵称
  message: string,      // 留言内容
  timestamp: string,    // ISO 时间字符串
}

// Idea 数据模型
{
  id: number,           // 唯一标识符
  title: string,        // 标题
  content: string,      // 简短描述
  detailedContent: string, // 详细内容
  isDefault: boolean,   // 是否为默认 idea
  createdAt: number,    // 创建时间戳
  updatedAt: number,    // 更新时间戳（可选）
}
```

## MODIFIED Requirements

### Requirement: 本地缓存策略
[原有 localStorage 直接存储改为缓存层，优先使用云端数据]

### Requirement: 登录认证
[原有登录认证逻辑保持不变，仍使用 localStorage]

## REMOVED Requirements

### Requirement: Ideas 纯 localStorage 存储
**Reason**: localStorage 无法实现跨用户共享
**Migration**: 迁移到 GitHub Gist 云存储，localStorage 仅作为缓存

### Requirement: 留言纯 localStorage 存储
**Reason**: localStorage 无法实现跨用户共享
**Migration**: 迁移到 GitHub Gist 云存储，localStorage 仅作为缓存
