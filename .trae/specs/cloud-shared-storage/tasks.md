# Tasks

- [ ] Task 1: 创建云存储工具模块 cloudStorage.js
  - [ ] SubTask 1.1: 实现 Gist API 读取函数 fetchCloudData()
  - [ ] SubTask 1.2: 实现 Gist API 写入函数 saveCloudData()
  - [ ] SubTask 1.3: 实现留言读写函数（getMessages, saveMessage, deleteMessage）
  - [ ] SubTask 1.4: 实现 ideas 读写函数（getIdeas, saveIdea, deleteIdea, editIdea）
  - [ ] SubTask 1.5: 实现初始化逻辑（首次使用 content.js 中的默认数据）
  - [ ] SubTask 1.6: 实现错误处理和加载状态管理

- [ ] Task 2: 添加环境变量配置
  - [ ] SubTask 2.1: 在 .env.example 中添加 VITE_GITHUB_TOKEN 和 VITE_GIST_ID 说明
  - [ ] SubTask 2.2: 确保 .env 在 .gitignore 中（不提交真实 token）

- [ ] Task 3: 修改 Contact.jsx 使用云存储
  - [ ] SubTask 3.1: 导入 cloudStorage 模块
  - [ ] SubTask 3.2: 移除 localStorage 相关代码
  - [ ] SubTask 3.3: 修改留言加载逻辑，从云端读取
  - [ ] SubTask 3.4: 修改留言提交逻辑，保存到云端
  - [ ] SubTask 3.5: 修改留言删除逻辑，从云端删除
  - [ ] SubTask 3.6: 添加加载状态和错误处理

- [ ] Task 4: 修改 AiEeDirectory.jsx 使用云存储
  - [ ] SubTask 4.1: 导入 cloudStorage 模块
  - [ ] SubTask 4.2: 移除 localStorage 相关代码
  - [ ] SubTask 4.3: 修改 ideas 加载逻辑，从云端读取
  - [ ] SubTask 4.4: 修改添加 idea 逻辑，保存到云端
  - [ ] SubTask 4.5: 修改编辑 idea 逻辑，更新云端数据
  - [ ] SubTask 4.6: 修改删除 idea 逻辑，从云端删除
  - [ ] SubTask 4.7: 添加加载状态和错误处理

- [ ] Task 5: 清理 auth.js
  - [ ] SubTask 5.1: 移除 saveIdeas、getIdeas、initializeDefaultIdeas、deleteIdea、editIdea 函数
  - [ ] SubTask 5.2: 保留认证相关函数（login、logout、isLoggedIn、verifyPassword 等）

- [ ] Task 6: 全面存储逻辑审查
  - [ ] SubTask 6.1: 审查所有组件中的 localStorage 使用
  - [ ] SubTask 6.2: 确认只有登录状态使用 localStorage
  - [ ] SubTask 6.3: 移除任何不必要的 localStorage 使用
  - [ ] SubTask 6.4: 检查 .gitignore 确保敏感信息不被提交

- [ ] Task 7: 测试和验证
  - [ ] SubTask 7.1: 测试留言提交和显示
  - [ ] SubTask 7.2: 测试留言删除功能
  - [ ] SubTask 7.3: 测试 idea 添加、编辑、删除功能
  - [ ] SubTask 7.4: 测试云端加载失败时的默认数据回退
  - [ ] SubTask 7.5: 测试多用户数据共享
  - [ ] SubTask 7.6: 测试登录状态 localStorage 功能正常

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
- [Task 4] depends on [Task 1, Task 2]
- [Task 5] depends on [Task 3, Task 4]
- [Task 6] depends on [Task 3, Task 4, Task 5]
- [Task 7] depends on [Task 6]
