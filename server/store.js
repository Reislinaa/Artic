// 轻量 JSON 文件存储（无需原生编译，易于部署）
// 数据保存在 server/data/ 目录下的 JSON 文件中

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')

const ensureDir = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

const readJSON = (file, fallback = []) => {
  ensureDir()
  const filePath = path.join(DATA_DIR, file)
  if (!fs.existsSync(filePath)) return fallback
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return fallback
  }
}

const writeJSON = (file, data) => {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf-8')
}

/** 对外返回的用户对象：**必须剥离密码等敏感字段** */
export const safeUser = (u) => {
  if (!u) return null
  return {
    id: u.id,
    username: u.username,
    email: u.email || '',
    avatar: u.avatar || '',
    // 已绑定的第三方登录渠道
    providers: Object.keys(u.oauth || {})
  }
}

// ============================================================
// 用户
// ============================================================
export const findUser = (username) => {
  const users = readJSON('users.json')
  return users.find(u => u.username === username) || null
}

export const findUserByEmail = (email) => {
  const users = readJSON('users.json')
  return users.find(u => u.email === email) || null
}

export const findUserById = (id) => {
  const users = readJSON('users.json')
  return users.find(u => String(u.id) === String(id)) || null
}

export const createUser = (username, email, password) => {
  const users = readJSON('users.json')
  const user = {
    id: Date.now(),
    username,
    email,
    password,
    created_at: new Date().toISOString()
  }
  users.push(user)
  writeJSON('users.json', users)
  return user
}

/**
 * 第三方登录：按 provider + openId（或 unionId）查找，不存在则创建。
 * 若同邮箱已存在账号，则把第三方渠道「绑定」到该账号，避免重复注册。
 */
export const upsertOAuthUser = ({ provider, openId, unionId = '', name = '', avatar = '', email = '' }) => {
  const users = readJSON('users.json')

  let user = users.find(
    (u) => u.oauth && u.oauth[provider] &&
      (u.oauth[provider].openId === openId ||
        (unionId && u.oauth[provider].unionId === unionId))
  )

  if (user) {
    // 已存在：同步最新昵称/头像
    let changed = false
    if (avatar && user.avatar !== avatar) { user.avatar = avatar; changed = true }
    if (name && user.nickname !== name) { user.nickname = name; changed = true }
    if (changed) writeJSON('users.json', users)
    return user
  }

  // 同邮箱账号 → 绑定
  if (email) {
    user = users.find((u) => u.email && u.email === email)
    if (user) {
      user.oauth = { ...(user.oauth || {}), [provider]: { openId, unionId, boundAt: new Date().toISOString() } }
      if (avatar && !user.avatar) user.avatar = avatar
      writeJSON('users.json', users)
      return user
    }
  }

  // 新建用户：生成不冲突的用户名
  const base = `${provider}_${(name || openId || 'user').replace(/[^\w\u4e00-\u9fa5]/g, '').slice(0, 12) || 'user'}`
  let username = base
  let n = 1
  while (users.some((u) => u.username === username)) {
    username = `${base}${n++}`
  }

  user = {
    id: Date.now(),
    username,
    email,
    password: null, // 第三方登录用户无密码
    nickname: name,
    avatar,
    oauth: { [provider]: { openId, unionId, boundAt: new Date().toISOString() } },
    created_at: new Date().toISOString()
  }
  users.push(user)
  writeJSON('users.json', users)
  return user
}

// AI 请求日志
export const addLog = (input, output, mode) => {
  const logs = readJSON('logs.json')
  logs.push({
    id: Date.now(),
    input,
    output,
    mode,
    created_at: new Date().toISOString()
  })
  // 只保留最近 500 条
  if (logs.length > 500) logs.splice(0, logs.length - 500)
  writeJSON('logs.json', logs)
}
