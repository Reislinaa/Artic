/**
 * 密码哈希（Node 内置 crypto.scrypt，零依赖）
 * ------------------------------------------------------------------
 * 存储格式： scrypt$N$r$p$salt(base64)$hash(base64)
 *
 *   · 新注册 / 修改密码 → hashPassword()，只存哈希
 *   · 校验 → verifyPassword()，返回 { ok, needsRehash }
 *     needsRehash = true 表示命中的是**历史明文数据**，
 *     调用方应在登录成功后立即改存哈希（透明迁移，老用户无感）。
 */
import crypto from 'crypto'

const N = 16384 // CPU/内存成本
const R = 8
const P = 1
const KEYLEN = 32

/** 是否已是哈希格式 */
export const isHashed = (s) => typeof s === 'string' && s.startsWith('scrypt$')

/** 生成密码哈希 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const key = crypto.scryptSync(String(password), salt, KEYLEN, { N, r: R, p: P })
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`
}

/**
 * 校验密码
 * @returns {{ ok: boolean, needsRehash: boolean }}
 */
export function verifyPassword(password, stored) {
  if (!password || !stored) return { ok: false, needsRehash: false }

  if (isHashed(stored)) {
    const parts = String(stored).split('$')
    // scrypt $ N $ r $ p $ salt $ hash
    const [, n, r, p, saltB64, hashB64] = parts
    const salt = Buffer.from(saltB64, 'base64')
    const expected = Buffer.from(hashB64, 'base64')
    if (!salt.length || !expected.length) return { ok: false, needsRehash: false }
    const key = crypto.scryptSync(String(password), salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p)
    })
    const ok = key.length === expected.length && crypto.timingSafeEqual(key, expected)
    return { ok, needsRehash: false }
  }

  // 历史明文数据：比对成功后要求重新哈希
  const ok = String(password) === String(stored)
  return { ok, needsRehash: ok }
}
