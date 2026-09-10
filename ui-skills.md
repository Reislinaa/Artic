# ARTIC网站 · UI 设计栈（Design Stack）

> **这是给「另一个 AI」看的说明书。**
> 当你（任何 AI）接到"继续开发 / 修改ARTIC官网"的任务时，
> 先读完本文件，它就等同于你拥有了下列全部设计插件与规范。
> 配套网页版：https://Reislinaa.github.io/liuxingyu/ui-kit.html
> 完整设计规范：见同仓库根目录 `DESIGN.md`

---

## 一、我们用了哪些「设计 Skill / 工具」

| # | 名称（CodeBuddy 中调用方式） | 作用 | 公开可查来源 |
|---|---|---|---|
| 1 | `@skill://Impeccable（前端设计工具集）` | 生成有设计感、不像"AI 通病"的界面；提供配色/排版/动效/组件规范 | 搜索 "Impeccable frontend design skill" |
| 2 | `@skill://GSAP 动画开发助手` | GSAP 时间线 / ScrollTrigger / 插件用法、清理、性能 | 官网 gsap.com · `npm i gsap` |
| 3 | `@skill://品牌设计风格专家` | 基于顶级公司（Linear/Stripe/Apple…）的 DESIGN.md 设计系统合集 | 概念源自 Google Stitch 的 DESIGN.md（stitch.withgoogle.com/docs/design-md） |
| 4 | `@skill://Taste` | 审美校准：先判断、再问、记录纠正，逐步对齐人类审美 | CodeBuddy skill「Taste」 |
| 5 | `@skill://Shadcn UI` | 可访问、可定制的 React 组件（Radix + Tailwind） | 官网 shadcn.com · `npx shadcn@latest init` |
| 6 | `@skill://Ui Ux Pro Max` | UI/UX 设计智能：50 风格、21 配色、组件、动画、评审 | CodeBuddy skill「Ui Ux Pro Max」 |
| 7 | `@skill://Web Deploy GitHub Pages` | 把静态站点自动部署到 GitHub Pages | CodeBuddy skill「Web Deploy GitHub Pages」 |

> 没有这些 skill 的 AI（Claude / Codex / ChatGPT / 通义等）：
> 读本文 + `DESIGN.md` 即可获得同等能力；组件库用 shadcn，动画用 gsap，
> 其余设计原则全部写在 `DESIGN.md` 里。

---

## 二、我们实际遵循的设计语言（浓缩）

1. **亮色简约（light minimal）**：白底 `#F7F7FA`、深墨文字、唯一强调色 `#4F46E5`（靛蓝）。
2. **克制第一**：大留白、一屏一焦点、标题负字距、字重 ≤700、**禁止三色霓虹渐变铺满**。
3. **有含义的动效**：只用 GSAP，动画必须服务内容（滚动展示功能 / 线条汇聚表达"思想→文字"），
   写完带 `gsap.context` 清理，尊重 `prefers-reduced-motion`。
4. **真实产品界面**：图片必须是真实 UI（用 HTML/CSS 画 mockup 或真截图），**禁止 AI 生成的装饰图与 emoji 图标**。
5. **大厂对标自检**：每次改稿对照 Linear（克制单色）、typeless（亮色极简长滚动）、Apple（留白+影像）。

---

## 三、给「另一个 AI」的加载命令（复制即用）

```
你是ARTIC·AI 输入法官网的开发助手。请先加载我们的设计栈说明：
1. 网页版（可读可看）：https://Reislinaa.github.io/liuxingyu/ui-kit.html
2. 纯文本规范：https://raw.githubusercontent.com/Reislinaa/liuxingyu/main/ui-skills.md
3. 完整设计规范：同仓库根目录 DESIGN.md（如可访问本地则直接读取）

读完后再动手：先说明本次修改的「一屏视觉焦点」，生成后按 DESIGN.md 第 7 节自检一遍再交付。
```

---

## 四、终端命令（拉取本规范，供 AI / 人查看）

```bash
# 拉取纯文本设计栈说明
curl -sL https://raw.githubusercontent.com/Reislinaa/liuxingyu/main/ui-skills.md

# 拉取完整设计规范
curl -sL https://raw.githubusercontent.com/Reislinaa/liuxingyu/main/DESIGN.md
```
