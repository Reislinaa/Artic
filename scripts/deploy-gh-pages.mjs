// 手动部署 dist/ 到 GitHub Pages (gh-pages 分支)
// 用法: node scripts/deploy-gh-pages.mjs <github用户名> <仓库名>
// 例: node scripts/deploy-gh-pages.mjs Reislinaa Artic

import { execSync } from 'child_process'
import { existsSync, rmSync, mkdirSync, readdirSync, copyFileSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const username = process.argv[2]
const repo = process.argv[3]

if (!username || !repo) {
  console.error('用法: node scripts/deploy-gh-pages.mjs <用户名> <仓库名>')
  process.exit(1)
}

const remote = `https://github.com/${username}/${repo}.git`
const distPath = join(root, 'dist')

if (!existsSync(distPath)) {
  console.error('错误: dist/ 目录不存在，请先构建')
  process.exit(1)
}

console.log('=========================================')
console.log('  部署到 GitHub Pages')
console.log('  用户:', username, '/', repo)
console.log('  远程:', remote)
console.log('=========================================')

const run = (cmd, opts = {}) => {
  console.log('> ' + cmd)
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', cwd: root, ...opts })
  } catch (e) {
    console.error('命令失败:', cmd)
    console.error(String(e?.stderr || e?.message || e))
    process.exit(1)
  }
}

// ---- 检查 gh-pages 分支是否已存在 ----
let hasBranch = false
try {
  const refs = execSync(`git ls-remote --heads "${remote}"`, { encoding: 'utf-8' })
  hasBranch = refs.includes('refs/heads/gh-pages')
} catch (e) {
  console.log('无法列出远程分支，按全新仓库处理')
}

const tmpDir = join(root, `.gh-pages-tmp-${Date.now()}`)

// ---- 初始化 gh-pages 分支目录 ----
console.log('[1/3] 准备 gh-pages 分支内容...')
mkdirSync(tmpDir, { recursive: true })
run(`git init -q "${tmpDir}"`)
// 复制 dist 内容
copyDir(distPath, tmpDir)
// 写 .nojekyll
const fs = await import('fs')
fs.writeFileSync(join(tmpDir, '.nojekyll'), '')
fs.writeFileSync(join(tmpDir, 'index.html'), fs.readFileSync(join(distPath, 'index.html')))

console.log('[2/3] 提交...')
run(`git -C "${tmpDir}" add -A`)
run(`git -C "${tmpDir}" -c user.name="ARTIC部署" -c user.email="deploy@Artic.local" commit -m "deploy: 更新站点"`)

console.log('[3/3] 推送 gh-pages 分支...')
run(`git -C "${tmpDir}" branch -M gh-pages`)
run(`git -C "${tmpDir}" remote add origin "${remote}"`)
try {
  run(`git -C "${tmpDir}" push -u origin gh-pages --force`)
} catch (e) {
  console.error('推送失败，可能是需要认证。请检查:')
  console.error('1. 仓库是 Public')
  console.error('2. git 已配置 token 或账号')
  process.exit(1)
}

console.log()
console.log('=========================================')
console.log('  ✅ 推送完成！')
console.log('  访问: https://' + username + '.github.io/' + repo + '/')
console.log('=========================================')
console.log()
console.log('如果 404，请到仓库 Settings → Pages → Source 选 gh-pages 分支保存')

// 不删除临时目录（安全 shim 会拦截 rmSync），下次用新时间戳目录

function copyDir(src, dst) {
  if (!existsSync(dst)) mkdirSync(dst, { recursive: true })
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name)
    const d = join(dst, entry.name)
    if (entry.isDirectory()) copyDir(s, d)
    else copyFileSync(s, d)
  }
}