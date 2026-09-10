// 第三方登录渠道 —— 前端兜底列表
//
// 有后端时：以 `GET /api/auth/providers` 返回的真实配置状态为准
//           （已配置的渠道按钮可点，未配置的灰显）
// 无后端时（如 GitHub Pages 纯静态部署）：用本列表渲染「预留入口」，
//           保证 UI 结构稳定、位置预留可见，接入后端后自动切换为真实状态。
//
// 新增渠道：这里补一条 + `server/oauth.js` 的 PROVIDERS 补一条即可，前端逻辑无需改动。
export const FALLBACK_PROVIDERS = [
  { id: 'wechat', name: '微信', color: '#07C160', tip: '需微信开放平台「网站应用」', implemented: true, configured: false, missing: [] },
  { id: 'qq', name: 'QQ', color: '#1EBAFC', tip: '需 QQ 互联开发者资质', implemented: true, configured: false, missing: [] },
  { id: 'feishu', name: '飞书', color: '#3370FF', tip: '需飞书开放平台网页应用', implemented: true, configured: false, missing: [] },
  { id: 'dingtalk', name: '钉钉', color: '#1677FF', tip: '需钉钉开放平台应用', implemented: true, configured: false, missing: [] },
  { id: 'wecom', name: '企业微信', color: '#2F7DFF', tip: '即将支持', implemented: false, configured: false, missing: [] },
  { id: 'alipay', name: '支付宝', color: '#1677FF', tip: '即将支持', implemented: false, configured: false, missing: [] },
  { id: 'github', name: 'GitHub', color: '#181717', tip: '即将支持', implemented: false, configured: false, missing: [] },
  { id: 'google', name: 'Google', color: '#4285F4', tip: '即将支持', implemented: false, configured: false, missing: [] },
  { id: 'apple', name: 'Apple', color: '#000000', tip: '即将支持', implemented: false, configured: false, missing: [] }
]

export default FALLBACK_PROVIDERS
