# Verification Checklist

## 数据存储架构
- [x] 所有 ideas 统一存储在单个 localStorage key 中
- [x] 每个 idea 包含 isDefault 标记
- [x] 不再使用 deletedIds 黑名单机制

## 功能测试
- [x] 首次访问页面时自动初始化默认 ideas
- [x] 添加新 idea 后立即显示在列表中
- [x] 删除 idea 后立即从列表移除
- [x] 添加/删除操作持久化到 localStorage

## 状态显示测试
- [x] 未登录状态下显示所有 ideas
- [x] 已登录状态下显示所有 ideas + 管理按钮
- [x] 退出登录后所有 ideas 仍然正常显示
- [x] 刷新页面后数据保持正确

## 代码质量
- [x] auth.js 导出所有必要的工具函数
- [x] AiEeDirectory.jsx 使用统一的 loadIdeas 逻辑
- [x] 无重复代码和冗余逻辑
- [x] 错误处理完善

## 边界情况
- [x] localStorage 为空时的初始化逻辑正确
- [x] 快速连续添加/删除操作不会导致数据丢失
- [x] 多标签页操作时数据一致性
