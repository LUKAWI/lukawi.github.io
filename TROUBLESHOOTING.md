# GitHub Pages 空白页面排查指南

## 🔍 问题诊断步骤

### 步骤 1：检查 GitHub Pages 设置

1. 访问：https://github.com/LUKAWI/lukawi.github.io/settings/pages
2. 确认 **Source** 选择的是 **GitHub Actions**
3. 确认 **Branch** 是 **main**
4. 查看是否显示 "Your site is live at https://lukawi.github.io/"

### 步骤 2：检查 GitHub Actions 部署状态

1. 访问：https://github.com/LUKAWI/lukawi.github.io/actions
2. 查看最新的部署工作流是否成功（绿色 ✅）
3. 如果失败，点击查看详情

### 步骤 3：清除浏览器缓存

1. **硬刷新**：
   - Windows/Linux: `Ctrl + Shift + R` 或 `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **无痕模式**：
   - 打开无痕/隐私窗口访问 https://lukawi.github.io/

3. **清除缓存**：
   - Windows/Linux: `Ctrl + Shift + Delete`
   - Mac: `Cmd + Shift + Delete`
   - 选择"缓存的图像和文件"

### 步骤 4：检查浏览器控制台

1. 按 `F12` 打开开发者工具
2. 切换到 **Console** 标签
3. 刷新页面
4. 查看是否有红色错误信息

### 步骤 5：检查网络请求

1. 在开发者工具中切换到 **Network** 标签
2. 刷新页面
3. 检查以下文件是否加载成功：
   - `index.html` - 状态码应为 200
   - `assets/index.js` - 状态码应为 200
   - `assets/index.css` - 状态码应为 200

### 步骤 6：检查 HTML 源代码

1. 右键点击页面 → **查看页面源代码**
2. 确认包含以下标签：
```html
<script type="module" crossorigin src="/assets/index.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index.css">
```

## 🛠️ 常见问题和解决方案

### 问题 1：GitHub Pages 未启用

**症状**：访问 https://lukawi.github.io/ 显示 404

**解决方案**：
1. 进入仓库 → Settings → Pages
2. 在 Source 部分选择 **GitHub Actions**
3. 等待部署完成

### 问题 2：资源 404 错误

**症状**：控制台显示 `Failed to load resource: net::ERR_ABORTED 404`

**解决方案**：
1. 确认 `vite.config.js` 中 `base` 设置为 `'/'`
2. 重新构建并推送：
```bash
npm run build
git add .
git commit -m "Fix: Rebuild for GitHub Pages"
git push
```

### 问题 3：JavaScript 运行时错误

**症状**：控制台显示 JavaScript 错误

**解决方案**：
1. 查看具体错误信息
2. 检查是否有导入错误
3. 确认所有依赖已安装

### 问题 4：React Router 路由问题

**症状**：页面空白但无错误

**解决方案**：
1. 确认 `BrowserRouter` 的 `basename` 为 `'/'`
2. 检查 `404.html` 重定向配置

### 问题 5：CORS 或网络错误

**症状**：控制台显示 CORS 错误

**解决方案**：
1. 这通常不会在 GitHub Pages 上发生
2. 尝试使用不同浏览器
3. 检查浏览器扩展是否阻止脚本

## 📋 快速检查清单

- [ ] GitHub Pages 已启用（Settings → Pages → GitHub Actions）
- [ ] 最新的 GitHub Actions 部署成功
- [ ] 浏览器缓存已清除
- [ ] 控制台无 JavaScript 错误
- [ ] 网络请求中 index.js 和 index.css 加载成功（200 状态码）
- [ ] HTML 源代码中包含正确的 script 和 link 标签
- [ ] BrowserRouter basename 为 '/'
- [ ] vite.config.js 中 base 为 '/'

## 🔧 手动触发部署

如果自动部署未触发：

1. 访问：https://github.com/LUKAWI/lukawi.github.io/actions
2. 点击 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow" 按钮
4. 选择 main 分支
5. 点击绿色的 "Run workflow" 按钮

## 📞 获取帮助

如果以上步骤都无法解决问题：

1. 打开浏览器控制台截图
2. 记录具体错误信息
3. 检查 GitHub Actions 部署日志
4. 提供以下信息：
   - 浏览器和版本
   - 控制台错误信息
   - 网络请求状态码
   - GitHub Actions 部署状态

---

**祝你排查顺利！** 🎉
