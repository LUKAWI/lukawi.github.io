# AI+EE Ideas 存储系统重构 Spec

## Why
当前系统存在以下问题：
1. 默认 ideas 和自定义 ideas 分离存储，导致逻辑复杂
2. 退出登录后卡片不显示（已修复但架构仍有问题）
3. 删除机制使用 deletedIds 列表，不够直观
4. 所有 ideas 应该地位等同，统一管理

## What Changes
- **重构存储架构**：所有 ideas 统一存储到 localStorage，不再区分默认/自定义
- **简化数据模型**：每个 idea 增加 `isDefault` 标记，而非分离存储
- **优化删除逻辑**：直接从存储中删除，而非使用 deletedIds 黑名单
- **改进加载逻辑**：统一加载函数，确保任何状态下都能正确显示
- **增强状态管理**：使用单一数据源，避免状态不一致

## Impact
- **Affected specs**: 
  - 现有 auth 工具需要扩展以支持新的存储结构
  - AiEeDirectory 页面需要重构数据加载和管理逻辑
- **Affected code**: 
  - `src/utils/auth.js` - 扩展存储函数
  - `src/pages/AiEeDirectory.jsx` - 重构 ideas 管理逻辑
  - `src/data/content.js` - 保持默认 ideas 数据作为初始值

## ADDED Requirements

### Requirement: 统一 Idea 存储
The system SHALL store all ideas in a single localStorage key without distinguishing between default and custom ideas.

#### Scenario: 初始化默认 ideas
- **WHEN** 用户首次访问页面且 localStorage 为空
- **THEN** 系统自动初始化所有默认 ideas 到存储中

#### Scenario: 添加新 idea
- **WHEN** 管理员点击 "Add New Idea" 并提交表单
- **THEN** 新 idea 被添加到存储中，并立即显示在列表中

#### Scenario: 删除 idea
- **WHEN** 管理员点击删除按钮并确认
- **THEN** 该 idea 从存储中永久删除，列表立即更新

#### Scenario: 退出登录后显示
- **WHEN** 管理员退出登录
- **THEN** 所有 ideas（包括默认和自定义）仍然正常显示

### Requirement: Idea 数据模型
The system SHALL use the following data structure for each idea:
```javascript
{
  id: number,           // 唯一标识符
  title: string,        // 标题
  content: string,      // 简短描述
  detailedContent: string, // 详细内容
  isDefault: boolean,   // 是否为默认 idea
  createdAt: number     // 创建时间戳
}
```

### Requirement: 状态一致性
The system SHALL ensure ideas display correctly regardless of login state.

#### Scenario: 未登录状态
- **WHEN** 用户未登录访问页面
- **THEN** 显示所有存储的 ideas，但不显示添加/删除按钮

#### Scenario: 已登录状态
- **WHEN** 管理员登录
- **THEN** 显示所有 ideas，并显示添加/删除按钮

## MODIFIED Requirements

### Requirement: 登录认证
[原有登录认证逻辑保持不变，但移除与 ideas 加载的耦合]

### Requirement: Ideas 加载逻辑
[从分离加载改为统一加载，所有 ideas 来自单一数据源]

## REMOVED Requirements

### Requirement: DeletedIds 黑名单机制
**Reason**: 使用黑名单机制导致逻辑复杂且容易出错
**Migration**: 直接删除数据，不再维护 deletedIds 列表

### Requirement: 默认/自定义 Ideas 分离存储
**Reason**: 分离存储导致状态管理复杂，退出登录时显示异常
**Migration**: 统一存储到单个 key，使用 isDefault 标记区分
