# Tasks

- [x] Task 1: 扩展 auth.js 工具函数，支持统一的 ideas 存储
  - [x] SubTask 1.1: 修改 getIdeas() 函数，返回所有 ideas
  - [x] SubTask 1.2: 修改 saveIdeas() 函数，保存完整 ideas 数组
  - [x] SubTask 1.3: 添加 initializeDefaultIdeas() 函数，初始化默认数据
  - [x] SubTask 1.4: 添加 deleteIdea() 函数，删除指定 idea

- [x] Task 2: 重构 AiEeDirectory.jsx 数据管理逻辑
  - [x] SubTask 2.1: 简化 loadIdeas() 函数，从统一存储加载
  - [x] SubTask 2.2: 修改 handleAddIdea()，使用新的保存函数
  - [x] SubTask 2.3: 修改 handleDeleteIdea()，直接删除而非黑名单
  - [x] SubTask 2.4: 优化 handleLogout()，确保正确重新加载

- [x] Task 3: 实现首次访问时自动初始化默认 ideas
  - [x] SubTask 3.1: 在组件挂载时检查存储是否为空
  - [x] SubTask 3.2: 如为空则自动初始化默认 ideas
  - [x] SubTask 3.3: 确保初始化只在首次访问时执行一次

- [x] Task 4: 测试各种状态下的显示逻辑
  - [x] SubTask 4.1: 测试未登录状态下所有 ideas 正常显示
  - [x] SubTask 4.2: 测试登录后添加/删除功能正常
  - [x] SubTask 4.3: 测试退出登录后所有 ideas 仍然显示
  - [x] SubTask 4.4: 测试刷新页面后数据保持正确

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
