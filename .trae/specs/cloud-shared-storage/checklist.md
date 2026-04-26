# Verification Checklist

## 云存储架构
- [ ] cloudStorage.js 模块正确实现 Gist API 读写
- [ ] 留言数据存储在云端 Gist 中
- [ ] ideas 数据存储在云端 Gist 中
- [ ] 不再使用 localStorage 存储留言和 ideas

## 留言功能
- [ ] 访问 Contact 页面时从云端加载留言
- [ ] 提交新留言后保存到云端
- [ ] 所有访客都能看到相同的留言列表
- [ ] 管理员可以删除留言
- [ ] 删除后所有访客的页面更新

## Ideas 功能
- [ ] 访问 AI+EE Directory 页面时从云端加载 ideas
- [ ] 首次访问时自动初始化默认 ideas 到云端
- [ ] 管理员可以添加新 idea
- [ ] 管理员可以编辑 idea
- [ ] 管理员可以删除 idea
- [ ] 所有访客都能看到最新的 ideas 列表

## 错误处理
- [ ] 云端加载失败时使用默认数据
- [ ] 云端保存失败时显示错误提示
- [ ] 未配置环境变量时显示配置提示
- [ ] 网络超时时有合理的重试机制

## 配置管理
- [ ] .env.example 包含配置说明
- [ ] .env 文件在 .gitignore 中（不提交真实 token）
- [ ] 环境变量正确读取

## 全面存储逻辑审查
- [ ] 所有组件中的 localStorage 使用已审查
- [ ] 只有登录状态使用 localStorage（合理用途）
- [ ] 无其他不必要的 localStorage 使用
- [ ] .gitignore 确保敏感信息不被提交

## 代码质量
- [ ] auth.js 只保留认证相关函数
- [ ] Contact.jsx 使用 cloudStorage 模块
- [ ] AiEeDirectory.jsx 使用 cloudStorage 模块
- [ ] 无重复代码
- [ ] 错误处理完善
