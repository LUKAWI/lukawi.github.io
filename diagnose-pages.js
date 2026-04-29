#!/usr/bin/env node

/**
 * GitHub Pages 诊断脚本
 * 检查配置并提供修复建议
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('\n🔍 GitHub Pages 诊断工具\n')

const issues = []
const warnings = []

// 检查 1: vite.config.js
console.log('📋 检查 1/6: Vite 配置')
try {
  const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.js'), 'utf8')
  if (viteConfig.includes("base: '/'") || viteConfig.includes('base: "/"')) {
    console.log('  ✅ base 配置正确: /')
  } else if (viteConfig.includes('base:')) {
    console.log('  ⚠️ base 配置可能不正确')
    warnings.push('检查 vite.config.js 中的 base 配置是否为 "/"')
  } else {
    console.log('  ❌ 未找到 base 配置')
    issues.push('vite.config.js 缺少 base 配置')
  }
} catch {
  console.log('  ❌ 无法读取 vite.config.js')
  issues.push('vite.config.js 文件不存在或无法读取')
}

// 检查 2: dist 目录
console.log('\n📋 检查 2/6: 构建产物')
const distPath = path.join(__dirname, 'dist')
if (fs.existsSync(distPath)) {
  console.log('  ✅ dist 目录存在')
  
  const indexHtml = path.join(distPath, 'index.html')
  if (fs.existsSync(indexHtml)) {
    console.log('  ✅ index.html 存在')
    
    const htmlContent = fs.readFileSync(indexHtml, 'utf8')
    
    // 检查 script 标签
    if (htmlContent.includes('/assets/index.js')) {
      console.log('  ✅ JavaScript 资源路径正确')
    } else {
      console.log('  ❌ JavaScript 资源路径可能有问题')
      issues.push('index.html 中的 JS 资源路径不正确')
    }
    
    // 检查 CSS 标签
    if (htmlContent.includes('/assets/index.css')) {
      console.log('  ✅ CSS 资源路径正确')
    } else {
      console.log('  ❌ CSS 资源路径可能有问题')
      issues.push('index.html 中的 CSS 资源路径不正确')
    }
    
    // 检查 root div
    if (htmlContent.includes('id="root"')) {
      console.log('  ✅ root 元素存在')
    } else {
      console.log('  ❌ 缺少 root 元素')
      issues.push('index.html 缺少 id="root" 的 div')
    }
  } else {
    console.log('  ❌ index.html 不存在')
    issues.push('dist/index.html 文件不存在，请运行 npm run build')
  }
} else {
  console.log('  ❌ dist 目录不存在')
  issues.push('dist 目录不存在，请运行 npm run build')
}

// 检查 3: GitHub Actions 工作流
console.log('\n📋 检查 3/6: GitHub Actions 工作流')
const workflowPath = path.join(__dirname, '.github', 'workflows', 'deploy.yml')
if (fs.existsSync(workflowPath)) {
  console.log('  ✅ deploy.yml 存在')
  
  const workflowContent = fs.readFileSync(workflowPath, 'utf8')
  
  if (workflowContent.includes('upload-pages-artifact')) {
    console.log('  ✅ 包含 upload-pages-artifact 步骤')
  } else {
    console.log('  ❌ 缺少 upload-pages-artifact 步骤')
    issues.push('工作流缺少 upload-pages-artifact 步骤')
  }
  
  if (workflowContent.includes('deploy-pages')) {
    console.log('  ✅ 包含 deploy-pages 步骤')
  } else {
    console.log('  ❌ 缺少 deploy-pages 步骤')
    issues.push('工作流缺少 deploy-pages 步骤')
  }
} else {
  console.log('  ❌ deploy.yml 不存在')
  issues.push('.github/workflows/deploy.yml 文件不存在')
}

// 检查 4: .gitignore
console.log('\n📋 检查 4/6: .gitignore 配置')
const gitignorePath = path.join(__dirname, '.gitignore')
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
  if (gitignoreContent.includes('dist')) {
    console.log('  ✅ dist 目录已排除')
  } else {
    console.log('  ⚠️ dist 目录未排除')
    warnings.push('建议将 dist 添加到 .gitignore')
  }
} else {
  console.log('  ⚠️ .gitignore 不存在')
  warnings.push('建议创建 .gitignore 文件')
}

// 检查 5: package.json
console.log('\n📋 检查 5/6: package.json 配置')
const packagePath = path.join(__dirname, 'package.json')
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  if (packageContent.scripts && packageContent.scripts.build) {
    console.log('  ✅ build 脚本存在')
  } else {
    console.log('  ❌ 缺少 build 脚本')
    issues.push('package.json 缺少 build 脚本')
  }
} else {
  console.log('  ❌ package.json 不存在')
  issues.push('package.json 文件不存在')
}

// 检查 6: 404.html
console.log('\n📋 检查 6/6: 404 页面配置')
const public404Path = path.join(__dirname, 'public', '404.html')
if (fs.existsSync(public404Path)) {
  console.log('  ✅ public/404.html 存在')
  
  const content = fs.readFileSync(public404Path, 'utf8')
  if (content.includes('_redirect')) {
    console.log('  ✅ 包含重定向逻辑')
  } else {
    console.log('  ⚠️ 可能缺少重定向逻辑')
    warnings.push('404.html 可能缺少 SPA 路由重定向逻辑')
  }
} else {
  console.log('  ⚠️ public/404.html 不存在')
  warnings.push('建议创建 public/404.html 用于 SPA 路由')
}

// 总结
console.log('\n' + '='.repeat(50))
console.log('📊 诊断结果\n')

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ 所有检查通过！配置看起来正确。')
  console.log('\n如果页面仍然空白，请检查：')
  console.log('1. GitHub Pages 设置：https://github.com/LUKAWI/lukawi.github.io/settings/pages')
  console.log('   - 确认 Source 选择的是 "GitHub Actions"')
  console.log('2. GitHub Actions 状态：https://github.com/LUKAWI/lukawi.github.io/actions')
  console.log('   - 确认最新部署成功（绿色 ✅）')
  console.log('3. 浏览器缓存：')
  console.log('   - 按 Ctrl+Shift+R 硬刷新')
  console.log('   - 或使用无痕模式访问')
  console.log('4. 浏览器控制台（F12）：')
  console.log('   - 查看是否有 JavaScript 错误')
  console.log('   - 查看 Network 标签确认资源加载状态')
} else {
  if (issues.length > 0) {
    console.log('❌ 发现以下问题：')
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`)
    })
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️ 发现以下警告：')
    warnings.forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`)
    })
  }
  
  console.log('\n🔧 建议修复步骤：')
  if (issues.some(i => i.includes('build'))) {
    console.log('   1. 运行 npm run build 重新构建')
  }
  if (issues.some(i => i.includes('deploy.yml'))) {
    console.log('   2. 检查 .github/workflows/deploy.yml 文件')
  }
  if (issues.some(i => i.includes('base'))) {
    console.log('   3. 检查 vite.config.js 中的 base 配置')
  }
}

console.log('\n' + '='.repeat(50))
console.log('')
