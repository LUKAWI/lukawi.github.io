# 云端存储配置教程

本教程将指导你完成 GitHub Gist 云端存储的完整配置。

## 📋 目录

1. [功能概述](#功能概述)
2. [准备工作](#准备工作)
3. [创建 GitHub Personal Access Token](#创建-github-personal-access-token)
4. [创建 GitHub Gist](#创建-github-gist)
5. [配置本地环境变量](#配置本地环境变量)
6. [配置 GitHub Actions 环境变量](#配置-github-actions-环境变量)
7. [测试配置](#测试配置)
8. [故障排查](#故障排查)

---

## 功能概述

云端存储使用 **GitHub Gist API** 实现以下功能：

- 💬 **留言板**：访客留言持久化存储
- 💡 **想法库**：AI/EE 想法的增删改查
- 🔄 **数据同步**：多设备数据共享
- 🌐 **无需后端**：纯前端实现，零成本

---

## 准备工作

确保你已安装：
- Node.js 16+
- npm 或 pnpm
- Git

---

## 创建 GitHub Personal Access Token

### 步骤 1：访问 Token 设置页面

访问：https://github.com/settings/tokens

### 步骤 2：生成新 Token

1. 点击 **Generate new token** → **Generate new token (classic)**
2. 注意：选择 **classic** 版本（支持 gist 权限）

### 步骤 3：配置 Token

| 设置项 | 值 |
|--------|-----|
| **Note** | `Portfolio Cloud Storage` |
| **Expiration** | 选择有效期（建议 90 days） |
| **Scopes** | 勾选 `gist` |

### 步骤 4：复制 Token

1. 点击 **Generate token**
2. **立即复制 Token**（只显示一次！）
3. Token 格式：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

> ⚠️ **重要**：Token 只显示一次，请妥善保存！

---

## 创建 GitHub Gist

### 步骤 1：创建 Gist

访问：https://gist.github.com/

### 步骤 2：创建公开 Gist

1. 文件名：`messages.json`
2. 内容：
```json
[]
```
3. 选择 **Public**（公开）
4. 点击 **Create secret gist** → 改为 **Create public gist**

### 步骤 3：获取 Gist ID

创建后，URL 格式：
```
https://gist.github.com/LUKAWI/abcdef1234567890abcdef1234567890
```

**Gist ID** 是 URL 最后一段：`abcdef1234567890abcdef1234567890`

### 步骤 4：添加 ideas.json 文件（可选）

在 Gist 页面点击 **Edit**，添加新文件：
- 文件名：`ideas.json`
- 内容：
```json
[]
```
- 点击 **Update public gist**

---

## 配置本地环境变量

### 步骤 1：创建 .env.local 文件

项目已创建 `.env.local` 文件，编辑它：

```bash
# 替换为你的实际值
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GIST_ID=abcdef1234567890abcdef1234567890
```

### 步骤 2：验证配置

```bash
# 启动开发服务器
npm run dev
```

打开浏览器控制台，应该能看到：
- 留言功能正常加载
- 想法库正常显示

---

## 配置 GitHub Actions 环境变量

为了让 GitHub Pages 部署后也能使用云端存储，需要配置仓库环境变量。

### 步骤 1：进入仓库设置

访问：https://github.com/LUKAWI/lukawi.github.io/settings

### 步骤 2：添加 Secrets

1. 左侧菜单：**Secrets and variables** → **Actions**
2. 点击 **New repository secret**

添加以下两个 Secret：

| Name | Value |
|------|-------|
| `VITE_GITHUB_TOKEN` | 你的 Token（`ghp_xxx...`） |
| `VITE_GIST_ID` | 你的 Gist ID |

### 步骤 3：更新 GitHub Actions 工作流

需要修改 `.github/workflows/deploy.yml`，在构建步骤中注入环境变量。

---

## 测试配置

### 本地测试

1. 启动开发服务器：
```bash
npm run dev
```

2. 测试留言板：
   - 访问留言板部分
   - 输入姓名和留言
   - 提交后检查是否保存成功

3. 测试想法库：
   - 访问 `/thinking/ai-ee` 页面
   - 管理员登录（密码：`admin123`）
   - 添加/编辑/删除想法

### 生产环境测试

1. 推送代码到 GitHub：
```bash
git add .
git commit -m "Configure cloud storage"
git push
```

2. 等待 GitHub Actions 部署完成

3. 访问 https://lukawi.github.io/ 测试功能

---

## 故障排查

### 问题 1：控制台显示 "Cloud storage not configured"

**原因**：环境变量未正确配置

**解决**：
1. 检查 `.env.local` 文件是否存在
2. 确认 Token 和 Gist ID 正确
3. 重启开发服务器

### 问题 2：API 返回 401 Unauthorized

**原因**：Token 无效或权限不足

**解决**：
1. 确认 Token 格式正确（`ghp_` 开头）
2. 检查 Token 是否过期
3. 确认 Token 有 `gist` 权限

### 问题 3：API 返回 404 Not Found

**原因**：Gist ID 错误或 Gist 不存在

**解决**：
1. 确认 Gist ID 正确
2. 检查 Gist 是否公开
3. 确认 Gist 包含 `messages.json` 和 `ideas.json`

### 问题 4：GitHub Pages 部署后无法使用

**原因**：GitHub Actions 未配置环境变量

**解决**：
1. 在仓库 Settings → Secrets and variables → Actions 中添加 Secret
2. 确认工作流文件正确引用环境变量

---

## 安全注意事项

### ⚠️ 重要提醒

1. **不要提交 `.env.local` 到 Git**
   - 已在 `.gitignore` 中排除
   - 永远不要将 Token 提交到仓库

2. **GitHub Pages 环境变量安全**
   - 使用 GitHub Secrets 存储敏感信息
   - 不要在代码中硬编码 Token

3. **Token 权限最小化**
   - 仅授予 `gist` 权限
   - 设置合理的过期时间

4. **Gist 可见性**
   - 使用公开 Gist（API 需要）
   - 数据存储在 Gist 中，注意不要存储敏感信息

---

## 高级配置

### 自动创建 Gist

如果留空 `VITE_GIST_ID`，系统会自动创建 Gist（需要 Token 有 `gist` 权限）。

### 数据备份

定期备份 Gist 数据：

```bash
# 使用 curl 下载 Gist 数据
curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/gists/YOUR_GIST_ID \
     | jq '.files' > backup.json
```

### 多环境配置

创建不同环境的配置文件：

```
.env.local        # 本地开发
.env.production   # 生产环境
```

---

## 常见问题 FAQ

### Q: 可以使用私有 Gist 吗？
A: 可以，但需要 Token 有 `gist` 权限。公开 Gist 读取不需要认证。

### Q: Gist 有大小限制吗？
A: 单个 Gist 最大 1MB，对于留言和想法数据足够使用。

### Q: 可以同时使用多个 Gist 吗？
A: 可以，修改 `cloudStorage.js` 支持多 Gist 配置。

### Q: 数据会丢失吗？
A: 数据存储在 GitHub Gist 上，只要不删除 Gist，数据不会丢失。

---

## 技术支持

如遇到问题：
1. 检查浏览器控制台错误信息
2. 查看 GitHub Actions 部署日志
3. 参考 [GitHub Gist API 文档](https://docs.github.com/en/rest/gists/gists)

---

**祝你配置顺利！** 🎉
