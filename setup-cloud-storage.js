#!/usr/bin/env node

/**
 * Cloud Storage Setup Script
 * 自动配置云端存储环境
 * 
 * 使用方法：
 * node setup-cloud-storage.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function main() {
  console.log('\n🌐 云端存储配置工具\n')
  console.log('本工具将帮助你配置 GitHub Gist 云端存储\n')

  // 步骤 1：获取 Token
  console.log('📝 步骤 1/3：GitHub Personal Access Token')
  console.log('创建地址：https://github.com/settings/tokens')
  console.log('权限要求：gist\n')

  const token = await question('请输入你的 GitHub Token (ghp_xxx): ')

  if (!token || !token.startsWith('ghp_')) {
    console.error('\n❌ Token 格式不正确，应以 ghp_ 开头')
    rl.close()
    process.exit(1)
  }

  // 步骤 2：获取 Gist ID
  console.log('\n📝 步骤 2/3：GitHub Gist ID')
  console.log('创建地址：https://gist.github.com/')
  console.log('格式：URL 最后一段（32位十六进制字符串）\n')

  const gistId = await question('请输入你的 Gist ID (留空自动创建): ')

  // 步骤 3：验证配置
  console.log('\n📝 步骤 3/3：验证配置\n')

  let finalGistId = gistId

  // 如果未提供 Gist ID，尝试自动创建
  if (!gistId) {
    console.log('正在自动创建 Gist...')
    
    try {
      const createResponse = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: 'Portfolio Cloud Storage',
          public: true,
          files: {
            'messages.json': {
              content: '[]',
            },
            'ideas.json': {
              content: '[]',
            },
          },
        }),
      })

      if (!createResponse.ok) {
        throw new Error(`创建 Gist 失败: ${createResponse.status}`)
      }

      const gistData = await createResponse.json()
      finalGistId = gistData.id
      console.log(`✅ Gist 创建成功: ${gistData.html_url}`)
    } catch (error) {
      console.error(`\n❌ 自动创建 Gist 失败: ${error.message}`)
      console.log('请手动创建 Gist 并重新运行此脚本')
      rl.close()
      process.exit(1)
    }
  } else {
    // 验证 Gist 是否存在
    console.log('正在验证 Gist...')
    
    try {
      const verifyResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      if (!verifyResponse.ok) {
        throw new Error(`验证 Gist 失败: ${verifyResponse.status}`)
      }

      console.log('✅ Gist 验证成功')
    } catch (error) {
      console.error(`\n❌ Gist 验证失败: ${error.message}`)
      console.log('请检查 Gist ID 是否正确')
      rl.close()
      process.exit(1)
    }
  }

  // 写入 .env.local 文件
  console.log('\n💾 正在保存配置...')

  const envContent = `# GitHub 个人访问令牌（用于写入 Gist）
# 创建方式：https://github.com/settings/tokens
# 权限：gist（仅需要 gist 权限）
VITE_GITHUB_TOKEN=${token}

# GitHub Gist ID
# 创建方式：https://gist.github.com/
# 或者留空让系统自动创建
VITE_GIST_ID=${finalGistId}
`

  const envPath = path.join(__dirname, '.env.local')
  fs.writeFileSync(envPath, envContent, 'utf8')

  console.log(`✅ 配置已保存到: ${envPath}`)

  // 测试 API 连接
  console.log('\n🔍 正在测试 API 连接...')

  try {
    const testResponse = await fetch(`https://api.github.com/gists/${finalGistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (testResponse.ok) {
      console.log('✅ API 连接成功！云端存储已配置完成')
      console.log('\n📋 下一步：')
      console.log('1. 运行 npm run dev 启动开发服务器')
      console.log('2. 访问留言板和想法库测试功能')
      console.log('3. 如需部署到 GitHub Pages，请参考 CLOUD_STORAGE_GUIDE.md')
    } else {
      console.log('⚠️ API 连接测试失败，但配置已保存')
    }
  } catch (error) {
    console.log(`⚠️ API 连接测试失败: ${error.message}`)
  }

  console.log('\n✨ 配置完成！\n')
  rl.close()
}

main().catch((error) => {
  console.error('\n❌ 配置失败:', error.message)
  rl.close()
  process.exit(1)
})
