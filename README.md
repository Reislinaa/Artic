# ARTIC — AI 语音成稿工具

> 让说出口的话，就是能直接发出去的稿。
> `Say what you mean, but better.`

面向**高端商务场景**的 AI 语音转文字 + 润色工具：说出口语，直接得到可发送的商务书面稿。

## 核心能力

- **语音转文字 + 润色**：客户微信、工作邮件、会议纪要、社群回复，说出口就是成稿
- **语音转文字 + 翻译 + 润色**：中文口语输入，产出地道的外语商务表达（连语气与商务礼节一起重写）
- **自定义热键一键唤起**：最多两键，开口即用
- **超长音频 3 秒内出稿**：说完即所得

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + Vite 5 + 原生 CSS |
| 动画 | GSAP 3（ScrollTrigger）+ IntersectionObserver |
| 后端 | Node.js + Express 4 |
| 存储 | JSON 文件（`server/store.js`） |
| 支付 | `wechatpay-node-v3`（微信 APIv3）+ `alipay-sdk`（支付宝官方 SDK） |

## 快速开始

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev              # 前端 5173，后端 3001
```

## 支付链路（当前重点）

支付实现在 `server/pay.js`，设计目标是**填入证件号即可上线，无需改代码**：

| 模式 | 触发条件 | 行为 |
|---|---|---|
| 演示 demo | 未配置商户参数 | 走通完整「下单 → 二维码 → 轮询 → 成功」，8 秒模拟到账 |
| 正式 live | `.env` 中该渠道配齐 | 微信 Native 下单 / 支付宝当面付，官方异步回调验签后置为已支付 |

启动服务时会打印当前模式与仍缺失的字段。配置项见 `.env.example`。

### 支付相关接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/pay/status` | 支付模式与各渠道缺失配置 |
| POST | `/api/order/create` | 创建订单（已配置渠道走真实下单） |
| GET | `/api/order/status` | 订单状态（前端轮询） |
| POST | `/api/order/forcepaid` | 演示模式模拟支付（正式模式返回 403） |
| POST | `/api/pay/wechat/notify` | 微信支付结果通知 |
| POST | `/api/pay/alipay/notify` | 支付宝异步通知 |

### 其他接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 健康检查 |
| POST | `/api/ai/complete` | AI 补全 / 改写 / 翻译，参数 `{text, mode}` |
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |

## 生产部署

```bash
npm run build
NODE_ENV=production npm start   # 由 Express 同时托管 dist 与 API
```

需要公网 HTTPS 域名，才能接收微信 / 支付宝的支付回调。

## 相关文档

- **`DESIGN.md`** — 设计规范，改 UI 前必读
- **`Artic项目日志.md`** — 项目日志，**每次完成任务后必须更新**
- **`ui-skills.md`** — 设计栈说明（供其他 AI 复用）

## 在线预览

https://reislinaa.github.io/Artic/
