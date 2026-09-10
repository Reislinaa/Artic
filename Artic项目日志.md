# ARTIC · 项目日志（唯一权威日志）

> ## ⚠️ 强制规则（AI 与开发者同样必须遵守）
>
> 1. **每次完成任务后，必须更新本日志。** 新增一条记录，包含三部分：
>    **① 用户要求 → ② 代码改动痕迹（含文件名）→ ③ 验证与部署结果**。
> 2. 新记录**追加到「七、开发日志」章节的最上方**（倒序排列，最新在最前）。
> 3. 本次若只做咨询 / 答疑、**未改代码**，也要在「八、需求存档」登记，写明结论。
> 4. 修改了**品牌名、仓库名、base 路径、配色、定价**等全局信息时，
>    必须同步更新本文档「一、二、三」章节，**不得只改代码**。
> 5. **未更新本日志的任务，视为未完成。**

最后更新：2026-09-10

---

## 一、项目基本信息

| 项目 | 内容 |
|------|------|
| **产品名** | **ARTIC** |
| **一句话定位** | AI 语音转文字 + 润色，面向高端商务场景的表达效率工具 |
| **Slogan** | 让说出口的话，就是能直接发出去的稿 ／ `Say what you mean, but better.` |
| **官网地址** | https://reislinaa.github.io/Artic/ |
| **GitHub 仓库** | https://github.com/Reislinaa/Artic |
| **仓库用户 / 仓库名** | Reislinaa / **Artic** |
| **默认分支** | `gh-pages`（构建产物）；源码在 `main` |
| **项目目录** | `F:\网站尝试\ai-input-method` |
| **一键启动（本地）** | `F:\网站尝试\启动网站.bat` |
| **一键部署** | `F:\网站尝试\ai-input-method\部署到GitHub.bat` |
| **商业计划书** | `F:\网站尝试\Artic 商业计划书.pptx`（内部资料，勿外传） |

> 仓库改名历史：`luixingyu` → `liuxingyu`（2026-08-27）→ **`Artic`**（2026-09-10）
> 每次改名都必须同步：base 路径、`ui-skills.md`、`public/ui-kit.html`、部署脚本、`网址.txt`、本日志。

---

## 二、品牌与设计规范速查

完整规范见 **`DESIGN.md`**（改动 UI 前必读）。

| 维度 | 现行值 |
|------|--------|
| 基调 | **黑白主导 + 橙色点缀**（依据《万物本相 UI DESIGN REFERENCE》EMI · 2026.09） |
| 点缀色 | 橙 `#FF8A1F`（**偏黄 / 高明度 / 不偏红**；占比 ≤5%~10%，仅 CTA · 核心数字 · 记忆点） |
| 深色区块 | `#0A0A0A` 墨底 + 白字 + 橙色光晕（`.ink` / `.ink-glow` / `.ink-horizon`） |
| 背景（浅色区） | 暖米白 `#F7F5F2` |
| 主文字 | 浅色区 `#0A0A0A`／深色区 `#FFFFFF` |
| 橙色文字（浅底） | `#C2410C`（保证对比度 ≥ 4.5:1） |
| 字体 | **MiSans**（取自商业计划书）→ 回退 `Noto Sans SC` |
| 强调色规则 | 全站**只允许 1 个**强调色；支付渠道图标可用微信绿 / 支付宝蓝（功能色） |
| 品牌标识 | **官方 logo**：`public/artic-logo.png`（由 `logo.jpg` 去底生成）+ `favicon.png` / `favicon.ico` |
| 定价 | ¥29.9/月 · ¥299/年；企业版按人数定价 |

---

## 三、用户核心要求（现行有效）

1. **品牌名**：必须是 **ARTIC**（早期曾叫「流星语」，已废弃）。
2. **定位**：AI 语音成稿工具，**面向高端商务人群**。
   - 已废弃的旧定位：① AI 智能输入法 ② AI 内容推广平台（给初创 AI 公司引流）。
3. **UI 风格**：亮色打底 + 冷调商务极简；参考 Linear / Stripe / typeless。
   配色须与商业计划书一致（MiSans + 冷调），**禁止 AI 味**（多色渐变铺满、发光椭圆、emoji 图标）。
4. **导航**：顶部功能栏，每项是**独立完整页面**（不是滚动跳转）。
5. **移动端**：要适配手机。
6. **动效**：必须"有含义"——滚动展示能力、线条汇聚表达"想法变成文字"；
   GSAP 实现，组件卸载必须清理，尊重 `prefers-reduced-motion`。
7. **图片**：只放**真实产品 UI**（HTML/CSS 绘制或真实截图），禁止 AI 风格装饰图案。
8. **文件位置**：所有文件在 **F 盘，绝不放 C 盘**。
9. **部署**：GitHub Pages 静态版先行，后续买服务器部署完整版（前端 + 后端 + 支付回调）。
10. **支付链路**（当前重点任务）：
    - 现阶段先做**完美展示品页面**；
    - 等微信商户号 / 企业资质办下来后，**填证件号即可直接使用，不改代码**；
    - 仅支持国内：**微信支付 + 支付宝扫码**。
11. **选型要求**：找开源方案**只去 GitHub 找**（不用其他网站），
    优先 stars 多的成熟项目，**不要新发布的、没人看的**。

---

## 四、技术架构与关键文件

### 技术栈
- **前端**：React 19 + Vite 5 + 原生 CSS（无 UI 框架）
- **动画**：GSAP 3（ScrollTrigger）+ IntersectionObserver 的 `Reveal` 组件
- **后端**：Node.js + Express 4（`server/`）
- **存储**：JSON 文件（`server/store.js`，避免 sqlite3 原生编译）
- **支付**：`wechatpay-node-v3`（微信 APIv3）+ `alipay-sdk`（支付宝官方 SDK）

### 关键文件
```
F:\网站尝试\ai-input-method\
├── 部署到GitHub.bat          # 一键部署
├── Artic项目日志.md          # ← 本文件
├── DESIGN.md                 # 设计规范（改 UI 前必读）
├── ui-skills.md              # 设计栈说明（给其他 AI 读）
├── .env.example              # 环境变量模板（含支付参数）
├── vite.config.js            # base 路径、分包配置
├── index.html                # 入口 + 字体加载
├── public/
│   ├── favicon.svg
│   └── ui-kit.html           # 设计栈网页版
├── scripts/
│   ├── build-with-base.mjs   # 按 base 构建
│   ├── deploy-gh-pages.mjs   # 推送 gh-pages
│   └── gen-icons.mjs         # 生成真实品牌图标数据
├── server/
│   ├── index.js              # Express 入口 + API 路由
│   ├── pay.js                # ★ 支付链路（演示/正式双模式）
│   ├── aiService.js          # AI 服务（大模型 + 本地兜底）
│   └── store.js              # JSON 存储
└── src/
    ├── App.jsx               # 页面路由（useState 状态机，非 react-router）
    ├── index.css             # ★ 全局设计令牌（配色/字体都在这）
    ├── components/
    │   ├── ArticLogo.jsx     # ★ 品牌标识
    │   ├── Navbar / Footer / Hero / Reveal
    │   ├── MeteorCanvas.jsx  # 背景光效引擎（Canvas）
    │   └── FeatureShowcase.jsx  # 能力展示（GSAP 滚动叙事）
    └── pages/
        ├── IntroPage.jsx     # 功能页
        ├── PaymentPage.jsx   # ★ 定价/支付页
        ├── DownloadPage.jsx  # 下载页
        └── AboutPage.jsx     # 关于页
```

---

## 五、部署方案与命令

### 当前：GitHub Pages（静态）
- 地址：https://reislinaa.github.io/Artic/
- **base 路径：`/Artic/`**（必须与仓库名大小写一致）
- 可用：全部页面、动效、UI
- **不可用**：登录、AI 接口、**真实支付回调**（静态站无后端）

### 部署命令
```bash
cd F:\ai-im
node scripts/build-with-base.mjs /Artic/          # 构建（base 必须写对，否则白屏）
node scripts/deploy-gh-pages.mjs Reislinaa Artic  # 推送到 gh-pages
```

### 源码同步（main 分支）
```bash
cd F:\网站尝试\ai-input-method
git add -A && git commit -m "..." && git push origin main
```

### 将来：完整版（计划中）
- 腾讯云服务器 + .cn 域名 + ICP 备案（7~20 天）
- 后端需公网 HTTPS，才能接收微信/支付宝支付回调

### 部署记录

| 时间 | 版本要点 | base 路径 | 结果 |
|---|---|---|---|
| 2026-08-26 | 初始深色版（流星语） | `/luixingyu/` | ✅ |
| 2026-08-27 | 亮色简约重构 | `/liuxingyu/` | ✅ |
| 2026-09-10 | ARTIC 品牌 + 冷调商务配色 + 支付双模式 | `/liuxingyu/` | ✅ |
| 2026-09-10 | 仓库改名 **Artic**，base 同步 | **`/Artic/`** | ✅ |

> 每次部署后请在本表追加一行。**旧地址在改名后不再维护**（其页面内的资源路径已失效）。

---

## 六、已知坑（省时间用）

1. **白屏 = base 路径写错**。仓库名大小写必须完全一致，改仓库名后务必重新构建。
2. **cmd 没有 `head` / `tail` / `timeout`**：用 `ping -n N 127.0.0.1 >nul` 做延时。
3. **Python 打印中文会 GBK 报错**：写文件用 `encoding='utf-8'`，再读文件。
4. **中文路径命令行乱码**：用 ASCII 链接 `F:\ai-im` 指向项目目录。
5. **`git push` 提示仓库已重命名**：只是提示，推送仍成功；规范名以 GitHub API 为准。
6. **临时脚本用完必须删除**，且**别提交进仓库**（曾误提交 `_extract.py` 等，已清理）。
7. **JSX 里不能写死绝对资源路径**：`<img src="/x.png">` **不会**被 Vite 按 base 改写，
   子路径部署（`/Artic/`）下会 404。要用 `import.meta.env.BASE_URL` 拼接，或放进 `src/assets/` 用 import。
8. **`simple-icons` v16 已下架一批品牌**（Microsoft 全系 / Slack / OpenAI / Canva / Adobe /
   LinkedIn / 钉钉 / 飞书 / 抖音 / WPS 等）。加图标前先确认该版本是否收录；
   `scripts/gen-icons.mjs` 已加强校验，取不到会直接报错退出。
9. **Pillow 可用**（12.3.0），处理图片/去底可直接用 Python 脚本。
10. **运行时数据绝不能入库**：`server/data/`（用户账号、AI 日志）已加入 `.gitignore`。
    新增任何存储目录都要同步加进 `.gitignore`——已发生过一次用户数据被提交的事故。
11. **提交前先看 `git status` 的输出列表**，确认没有 `server/data/`、`.env`、测试脚本等不该提交的内容。
12. **移动端「页面没居中」优先查网格溢出**：`grid-template-columns: 1fr` 会被子项固有宽度
    撑宽整列导致横向溢出，必须写 `minmax(0, 1fr)`，并给网格子项加 `min-width: 0`。
13. **桌面浏览器窗口有最小宽度（约 500px）**，`resize_page` 压不到手机尺寸；
    测移动端要用 DevTools 的设备模拟（`emulate` 的 `viewport` 参数，如 `390x844x3,mobile,touch`），
    并用 `evaluate_script` 量 `getBoundingClientRect()` 与 `documentElement.scrollWidth` 来确认。
14. **GitHub Pages 的 HTML 被 CDN 强缓存**：换 `?v=` 查询参数**不一定能绕过**，
    部署后若页面还是旧版，先确认「本地 `dist/index.html` 的资源名」与「浏览器实际加载的资源名」，
    再用 DevTools 的**忽略缓存重新加载**验证（不要误判成部署失败）。
15. **图标清单的分组过滤要留意会丢内容**：早期用 `i % 4` 分组导致一半图标永不出现——
    用 `node scripts/gen-icons.mjs` 输出里的「外环 + 内环 = 总数」自查是否全部呈现。

---

## 七、开发日志（倒序，最新在最前）

### 2026-09-10 · 配色重构 v9：修正「暖色互相污染」（用户反馈：太丑、搭配很烂）
**用户要求**：继续修改网页配色界面，太丑了，而且搭配很烂，没有美感。
（附带的 `vue-router-best-practices` 技能与本项目**无关**——本项目是 React + hash 路由，
没有 Vue Router，故未加载。）

**先自查根因（承认上一版是执行问题，而不是再微调）**：

| # | 病根 | 说明 |
|---|---|---|
| 1 | **暖色互相污染** | v8 的底色 `#F7F5F2`(暖米白) + 灰阶(偏暖) + 橙色，**三者都是暖色**，叠在一起互相污染 → 整页发灰发脏、层次糊在一起（**这是「丑」的主因**） |
| 2 | **橙色铺得太散** | 区块英文小标题、步骤序号、功能序号 01–07、定价勾选(3×5=15 个)、导航下划线、标签发光点、每个区块标题下的细线……到处都有橙 |
| 3 | **光晕发褐** | Hero 光晕是「大范围 + 低不透明度」，压在黑底上过渡出一片**褐色雾面** |
| 4 | **色相打架** | 收银台同时出现 **绿(微信) + 蓝(支付宝) + 橙 + 黑白**，是全站最明显的打架点 |

**代码改动痕迹**：
- `src/index.css`（唯一令牌来源，整体重写）
  - 中性色全部改为**纯中性**：`--ink #0A0A0B`、`--paper-2 #F4F4F5`（干净中性浅灰）、
    `--text #0A0A0B` / `--text-2 #52525B` / `--text-light #8A8A93`
  - 橙色去掉蓝通道：`#FF8A1F` → **`#FF8A00`**（减少压黑底时的褐色浑浊）
  - 阴影改**双层结构**（贴地 1px + 扩散），比单层大模糊干净得多
  - `.section-kicker` 橙色 → **中性灰**（不再参与标题装饰）
  - **删除 `.section-subtitle::after`**：v8 每个区块标题下都有一条线，太碎反而更乱
- `Hero.css`：光晕核心缩小、衰减收窄（`blur 46→36`、面积 `920→760px`）；
  地平线光带强度大幅调低（`0.40→0.20`）；删除标签前的橙色发光点；对比箭头改中性灰
- `Navbar.css`：选中态橙色短横 → **白短横**（黑底上白线本身对比最强，橙留给 CTA）
- `FeatureShowcase.css`：01–07 序号橙色 → 中性灰（7 个橙序号属于「铺色」）
- `StepsSection.css`：删除每格顶部细线（4 条线 + 2×2 排布 = 线条过多）
- `PaymentPage.css`：15 个橙色勾 → **墨黑**（上一版橙色占比最大的来源之一）
- `CheckoutPage.css`：渠道选中态改**中性墨色**，品牌色只留在图标上（消除绿/蓝/橙打架）
- `App.css`：卡片统一默认 `--shadow-sm` + hover `--shadow-md`
  （此前只有 1px 边框，白卡浮不起来，页面显平）
- `pages.css`：8 处橙色图标/次级文字 → 中性灰；场景卡顶条、时间轴节点、
  FAQ 图标底、时间轴连线全部去橙

**验证与部署结果**：
- 构建通过；lint 无错误
- **橙色占地实测**（脚本统计「色相 18–48° 且饱和度 ≥0.55」的元素面积占整页比例）
  = **9.5%**；除两块光晕外，橙色只剩：2 个 CTA、4 个步骤序号、导航 CTA、
  数据「220」、麦克风按钮 → 回到参考文档要求的 **5%~10%** 区间内，且层级明确
- 页面底色 `rgb(244,244,245)` / 卡片 `rgb(255,255,255)`，白卡能从底上分离
- 部署 → https://reislinaa.github.io/Artic/

**遗留（待用户确认）**：还剩一个主观选择——**橙色本身要不要换**。
参考文档给了三套候选（橙 / 偏黄的绿 / 黄）并推荐橙。
由于橙色已全部收敛到 `--accent` 一个令牌，**换色只需改一处**。

### 2026-09-10 · 排版整理：修掉 3 处真实布局缺陷 + CSS 双重来源
**用户要求**：整理排版布局，别重叠，有美感。

**排查方法（先用浏览器实测，不靠猜）**：
- 用 Chrome DevTools 在 1440 / 860 / 768 / 500 / 390（设备模拟）逐档实测：
  脚本遍历可见元素**两两求包围盒交集**，并检测横向溢出
- 再把 7 个路由在手机宽度下全扫一遍
- 结论：**没有真正的元素框体重叠，也没有横向溢出**；但发现 3 处会「看起来乱」的真实缺陷

**代码改动痕迹**：

1. **Hero 速度卡与说明文字被排成一行（真实错位）**
   - 现象：640–900px 区间，`.hero-compare`（x 92→514）与 `.hero-caption`（x 514→753）
     **并排**，说明文字被挤到卡片右侧
   - 根因：`@media (max-width:900px)` 把 `.hero-col-left .reveal` 改成
     `display:flex; flex-wrap:wrap`，而这一块里有**两个**子元素，于是被排成一行
   - 修：`Hero.jsx` 用 `.hero-compare-wrap` 包住「速度卡 + 说明文字」；
     `Hero.css` 新增该容器 `flex-direction:column`，并在 ≤900px 下
     `width:100%; align-items:center`
   - 实测：`capBelowCmp: true`、两行各自居中，问题消除

2. **收银台把技术报错直接渲染给用户（最影响观感）**
   - 现象：线上收银台显示 `下单失败 / Unexpected token '<', "<html> <he"... is not valid JSON`
   - 根因：GitHub Pages 是纯静态托管，`/api/order/create` 返回的是 HTML 页面，
     而 `await r.json()` 直接抛解析错误，`e.message` 被原样展示成错误文案
   - 修：`CheckoutPage.jsx` 新增 `requestJSON()` 网络层——先校验 `content-type`，
     非 JSON 一律转成 `BACKEND_UNAVAILABLE`；`createOrder` / `handleForcePaid`
     捕获该情况后切到新的 `offline` 状态
   - 新增 `offline` 友好态：「演示环境 · 支付通道待开启」+ 说明正式部署后自动开启 +
     「返回选择方案」按钮；`CheckoutPage.css` 新增 `.co-offline-note`
   - 后端可用时（`npm run dev`）真实下单与演示流程完全不受影响

3. **`.step-num` 被两份 CSS 同时定义，橙色序号外残留 56px 圆底**
   - 现象：步骤区数字外面还有一圈橙色圆底（设计意图是 PDF 风格的**纯橙色大数字**）
   - 根因：`pages.css` 与 `StepsSection.css` **各定义了一份 `.step-num`**；
     两份都生效——`StepsSection.css` 后加载赢得了 `color/font-size`，
     而 `pages.css` 独有的 `width/height/border-radius/background` 仍然奏效，
     于是出现「橙色数字 + 旧圆底」的混合体
   - 修：删除 `pages.css` 里那段**完全重复**的步骤样式
     （`.steps-grid` / `.step-card` / `.step-num` / `.step-title` / `.step-desc`），
     样式单一来源收敛到 `StepsSection.css`
   - 顺带做了一次全量重复选择器扫描（22 个 CSS 文件、18 处重复）：其余均为
     `App.css` 的「多卡片共用 hover 钩子」与响应式覆盖，属有意设计；
     `Features.css` 未被打进产物（组件已是死代码），不会串味

4. **深色区垂直节奏偏空**：`FeatureShowcase.css` 头部 `110px→100px`、
   副标题下边距 `64px→48px`、功能条 `90px→72px`

5. **橙底白字对比度不达标**：`.plan-badge`（最受欢迎徽章）白字 → **黑字**（约 8:1）

**验证与部署结果**：
- 构建通过；lint 无错误
- 线上实测：`.hero-compare-wrap` 为 `column / center`，说明文字在卡片**下方**；
  步骤区同排卡片 `top` 完全一致、高度一致（182px）；
  收银台显示**友好态**而非技术报错
- 部署 → https://reislinaa.github.io/Artic/

**备注**：本次未发现「元素框体互相压住」的情况。若用户看到的是别处的错位，
需要指出**具体页面 + 浏览器宽度**，可继续按同样方法实测定位。

### 2026-09-10 · 依据《EMI UI Design Reference》重构视觉：黑白主导 + 橙色点缀
**用户要求**：按照 `EMI_UI_Design_Reference.pdf` 设计 UI，**保留现在好的部分**，
更改配色以及文字等视觉效果。

**先读参考文档（没有凭印象猜）**：
- 用 PyMuPDF 解析 `F:\网站尝试\EMI_UI_Design_Reference.pdf`（14 页）：
  提取全文 + 逐页渲染成图 + 量化各页主色
- 该文档是「万物本相」的品牌配色/视觉方向参考合集，
  **权威结论在第 07 节「EMI 的建议」**：
  1. 基础品牌色 = **黑与白**，在界面中**大面积主导**，标识系统亦为黑白
  2. 第三色**一律小面积、点缀式**使用，仅作视觉记忆点
  3. 点缀色 = **橙**：**色相偏黄、明度偏高**，避免偏红（太橘）或偏暗
  4. 橙色以**渐变 / 光晕**形式呈现，只用于①关键行动按钮②核心数据高亮③品牌记忆点
  5. 单界面橙色占比建议 **5%~10% 以内**
- 从参考图（Harness / ArteDante / Vapi / Contact 页）提炼出可复用手法：
  **大面积黑底 + 白字 + 巨大柔和橙色光斑**、**中央橙色「地平线」光带**、
  **橙色序号 + 细分割线**的标题版式、**黑底 + 白色卡片**的对比

**代码改动痕迹**：
- `src/index.css`（唯一令牌来源，整体重写）
  - 墨/纸体系：`--ink #0A0A0A`、`--paper-2 #F7F5F2`（**暖米白**，弃用冷调 `#F7F8FA`）
  - 点缀橙：`--accent #FF8A1F`（偏黄高明度）、`--accent-bright`、`--accent-soft`、
    `--accent-deep #C2410C`（浅色底文字用，保证 ≥4.5:1）、`--grad-accent`
  - 黑底语义：`--on-ink` / `--on-ink-2` / `--on-ink-3` / `--hairline-ink`
  - 新原语：`.ink`（深色区块）、`.ink-glow`（柔和大光斑）、`.ink-horizon`（地平线光带）、
    `.hairline`、`.section-rule`；`.section-subtitle::after` 全站加细分割线
  - 旧变量名（`--primary` / `--grad-brand` …）映射到橙色系，避免大面积重写组件
- `src/App.css`：主 CTA 改**橙底黑字**（对比度约 8:1）；新增 `.btn-on-ink`（黑底白描边）
- **`src/components/Hero.css` 重写**：黑底 + 右上巨大橙色光斑 + 底部橙色地平线光带；
  白字 + 橙渐变「即成文」；速度对比卡改黑玻璃卡、`220` 用橙色高亮
  - **同时删掉该文件里重复定义的 `:root` 令牌块** —— 它因 CSS 全局作用域 + 加载顺序
    **静默覆盖**了 index.css 的 `--bg/--primary/--text`，是「改了令牌却没生效」的真实隐患
- `Navbar.{css,jsx}` / `Footer.css`：改**黑底白字**；选中态橙色短横；头像橙色渐变；
  登录按钮改 `.btn-on-ink`；页脚顶部加极淡橙色余光
- `FeatureShowcase.{css,jsx}` / `StepsSection.css`：功能展示区整块改黑（`ink` 类），
  白卡在黑底上形成对比；序号 `01–07` 用橙色；步骤序号由色块圆点改成橙色大数字
- `InputMockup.css`：气泡与头像改**墨黑**，**橙色只保留麦克风按钮**，
  把橙色占比拉回 5%~10% 规范内；并显式声明 `color`，防止在深色区块里继承成白字
- 批量把残留冷色改暖：`rgba(43,75,242,*)` → `rgba(255,138,31,*)`（8 个文件）；
  二维码颜色 `#0F172A` → `#0A0A0A`；弹窗遮罩与图标卡阴影改中性黑
- `DESIGN.md`：第 1/2/3/4 节按 PDF 规范重写（黑白主导规则、橙色使用细则、
  字级对比、细线节奏、深色区块组件规范）

**验证与部署结果**：
- `npm run build` 通过；lint 无错误
- 线上实测（Chrome DevTools 读取计算样式）：
  `hero` 背景 `rgb(10,10,10)`；光晕核心 `rgba(255,173,71,0.88)`；
  聊天气泡 `rgb(10,10,10)`；麦克风 `rgb(255,138,31)`；
  页面底色 `rgb(247,245,242)`；功能展示区 `rgb(10,10,10)`、标题白、序号橙
- 部署 → https://reislinaa.github.io/Artic/

**备注**：参考文档是「万物本相」的品牌方向稿，其中「Logo 方向」一节的问题
（图形语义、橙色占比）与 ARTIC 无关，**未套用**；本次只落地其**配色与视觉语言**。

### 2026-09-10 · 飞书/钉钉官方 logo + 平台区块去 AI 化 + 图标环换主流 App
**用户要求**：
1. 下载飞书和钉钉的 logo，替换当前的占位图标；
2. 登录入口**不要 GitHub、Google、Apple 三个选项**（但**代码保留**）；
3. 平台区块（截图 1）**「AI 味太重」**，要求参考简约网站与主流 App 的布局与文案；
4. 图标环（截图 2）里图标大多不常见，换成 **2025 年热度前 100 的办公 / 社交 App**
   （海内外、合法、能找到正版 logo），并要求**上网核验 logo 正确性**。

**先调研再动手**：
- GitHub 检索正版图标库：`simple-icons`(25.8k★)、`lobehub/lobe-icons`(2.5k★)、
  `glincker/thesvg`(2.7k★)、`dheereshag/coloured-icons`(335★)
- 设计调研（SUUR《2026 最佳 SaaS 网站设计》对 Linear / Stripe / Vercel / PostHog / Retool 的拆解），
  提炼出可照抄的规律：**统一容器承载异质 logo、三行信息结构（图标→名称→状态标签）、
  一行一平台一句能力、网格做概览+列表做细节、用数字与状态替代形容词、层级靠留白与字号而非分割线**

**代码改动痕迹**：
- **飞书 / 钉钉官方 logo（下载 + 核验）**
  - 先回溯 `simple-icons` 的 **v10~v15 全部 tag，两者均不存在**（该库从未收录或已彻底下架）
  - 改用 **App Store 官方接口**（`itunes.apple.com/search`）取回 512px 官方 App 图标，
    开发者署名分别为 **DingTalk Technology Co., Ltd.** / **Beijing Feishu Technology Co., Ltd.**
  - 下载后**逐张目视核验**（钉钉＝蓝底白羽翼标；飞书＝白底蓝青双色标）→ 确认正版
  - Pillow 转存 256px 自托管资源：`public/brand/dingtalk.png`(21KB) / `feishu.png`(10KB)
  - `AuthModal.jsx` 新增 `IMG_MAP`：飞书 / 钉钉用官方位图渲染，其余渠道仍用矢量 glyph
- **登录入口精简（代码保留）**
  - `server/oauth.js`：GitHub / Google / Apple 加 `hidden: true`，
    `getProvidersStatus()` 过滤 hidden —— **定义与代码完整保留，去掉 hidden 即可恢复**
  - `src/data/auth-providers.js`：兜底列表同步为 6 个渠道（微信/QQ/飞书/钉钉/企业微信/支付宝）
- **平台区块重做（去掉卡片墙）**
  - **删除** `AdapterCarousel.jsx` / `.css`（6 张大卡片 + 下方重复的平台列表）
  - **新建** `PlatformSpecs.jsx` / `.css`：改为**规格表**，桌面三列 `168px | 88px | 1fr`
    （图标+名称 / 状态标签 / 一句话能力），移动端单列；层级只靠留白、字号与极细分隔线
  - iOS 行图标改用 **App Store** 图标：`simple-icons` 的 iOS 图标本身就是「iOS」字形，
    放在「iOS」文字前会重复成「iOS iOS」（该版本没有 iphone / ipad 图标）
  - `PlatformSection.jsx`：副标题改「同一套热键与词库，跟着你在六个平台上工作」，
    CTA 改「选择你的平台下载」
- **图标环换成主流办公社交 App**
  - `scripts/gen-icons.mjs`：清单重构为 **44 个主流 App**（国内 10 + 国际 34，国内外交替排列）
  - **修掉一个隐藏缺陷**：原 `i % 4` 分组导致**一半图标永远不会出现**（飞书正好被丢掉），
    改为「偶数索引→外环 / 奇数索引→内环」→ **44 个全部呈现**（22 + 22）
  - `Rinner` 由 `0.22w` 调至 `0.24w`，避免内环图标变多后拥挤
  - `EverywhereSection.jsx` 支持 `img` 与 `path` 两种图标来源；新增 `.ev-icon img` 样式（72%）

**验证（线上实测，Chrome DevTools）**：
- 登录弹窗：6 个渠道；飞书 / 钉钉图片 `naturalWidth=256` **加载成功**；
  GitHub / Google / Apple **已不出现**
- 平台区块：`.pspec` 6 行，`grid-template-columns: 168px 88px 588px`
- 图标环：`.ev-icon` **44 个**（外环 22 + 内环 22）；`brand/dingtalk.png` 与 `brand/feishu.png` 均 256px 加载成功
- `npm run build` 通过，lint 无错误；部署 → https://reislinaa.github.io/Artic/

**踩坑**：GitHub Pages 的 CDN 对 HTML 缓存很顽固，`?v=` 查询参数**不一定能绕过**；
验证新版必须用 DevTools 的「忽略缓存重新加载」（已记入已知坑）。

### 2026-09-10 · 密码改哈希存储 + 修复移动端首页不居中
**用户要求**：① 同意把密码改成哈希存储；② 手机端打开首页没居中，其他页面正常。

**代码改动痕迹**：
- **新增 `server/password.js`**：用 Node 内置 `crypto.scrypt` 实现（零依赖）
  - 存储格式 `scrypt$N$r$p$salt$hash`，参数 N=16384 / r=8 / p=1 / keylen=32
  - `verifyPassword()` 返回 `{ ok, needsRehash }`：命中**历史明文数据**时提示调用方迁移
- `server/store.js`：`createUser` 改为只存哈希；新增 `setPasswordHash(userId, 明文)`（内部哈希）
- `server/index.js`：登录改用 `verifyPassword`；命中明文老数据时**登录成功后立即改存哈希**（用户无感）
- **移动端首页不居中（含根因）**：
  - 现象：其他页面都正常，只有首页整块偏右
  - 定位：用 Chrome DevTools 以 390×844 **真机视口**量取，发现 `.hero-content`
    的单列被撑到 **374px**，而内容区只有 **342px**（390 − 48 padding），
    子元素右边界跑到 **398** → 溢出 8px
  - 根因：CSS Grid 子项默认 `min-width: auto`，右侧 mockup 的固有宽度把整列撑宽
  - 修复 `src/components/Hero.css`：移动端 `grid-template-columns: minmax(0, 1fr)`，
    并给 `.hero-col-left` / `.hero-col-right` 加 `min-width: 0; max-width: 100%`
  - 顺带修 `.hero-compare`（原宽 374px，比容器还宽）：移动端收紧 padding/gap、
    `.compare-item { min-width: 0 }`、`.compare-bar { width: 96px }` → 宽度降到 **277px**
- `DESIGN.md`：布局原则补充「网格必须用 `minmax(0,1fr)`」；账号章节补充密码哈希要求

**验证与部署结果**：
- **密码**：注册后 `users.json` 中为 `scrypt$16384$8$1$…` ✅；正确密码 200 ✅；错误密码 401 ✅；
  手工写入的**明文老账号登录成功并自动迁移为哈希** ✅；迁移后再登录仍成功 ✅
- **移动端**（Chrome DevTools 设备模拟实测）：
  - 390px：两列均 **342px**，左右各 **24px** 完全对称；标题居中；`scrollWidth == 390` 无横向溢出
  - 360px：列宽 312px，左右各 24px；速度对比条 277px 居中；无溢出
- `npm run build` 通过；部署 → https://reislinaa.github.io/Artic/

### 2026-09-10 · 新增第三方登录框架（飞书 / 钉钉 / 微信 / QQ 预留式接入）
**用户要求**：在登录界面做好预留窗口，未来可能要接入飞书、钉钉、微信、QQ 等办公与社交软件，
**提前写好相应代码**。

**代码改动痕迹**：
- **新增 `server/oauth.js`** —— 统一的 OAuth 2.0 实现层
  - `PROVIDERS` 注册表，**已实现 4 个渠道的真实流程**（端点与字段映射按各家官方文档书写）：
    微信开放平台「网站应用」扫码登录 / QQ 互联 / 飞书开放平台 / 钉钉新版 OAuth2
  - `RESERVED_PROVIDERS` 预留占位：企业微信 / 支付宝 / GitHub / Google / Apple
  - 每个渠道只需声明 `envKeys` + `authorizeUrl` + `exchange` + `user`；
    并处理各家「坑」：QQ 的 token 返回 **urlencoded 而非 JSON**、openid 需单独取且是 **JSONP**、
    微信 authorize 必须带 `#wechat_redirect`、飞书与钉钉用的是**新版 OAuth2 端点**
  - 会话与 state 用 **HMAC 签名**（`SESSION_SECRET`）：无状态、防篡改、防 CSRF
- **`server/store.js`**：新增 `findUserById` / `upsertOAuthUser`（按 openId / unionId 查找，
  同邮箱自动绑定，避免重复注册）/ `safeUser`（**剥离密码**）
- **`server/index.js`**：新增
  `GET /api/auth/providers`（渠道状态）、`GET /api/auth/:provider/start`（302 到授权页）、
  `GET /api/auth/:provider/callback`（换 token → 落库 → 签发会话 → 跳回站点）、
  `GET /api/auth/me`、`POST /api/auth/logout`；密码登录改为返回 token + `safeUser`
- **`src/context/AuthContext.jsx`**：改为 **token 会话**（不再把明文用户存 localStorage），
  启动时恢复会话、消费第三方回跳 token 并**立即从地址栏清除**
- **`src/components/AuthModal.jsx` / `AuthModal.css`**：新增第三方登录区块
  （3 列网格 + 「或使用以下方式」分隔线），未配置渠道灰显为预留位
- **新增 `src/data/auth-providers.js`**：前端兜底渠道列表 ——
  **GitHub Pages 是静态站没有后端，靠它保证线上也能看到预留窗口**
- `.env.example`：新增会话密钥与 4 个渠道凭据段，并写明各渠道要登记的回调地址格式

**验证与部署结果**（本地起服务实测）：
- 渠道状态：4 个已实现渠道正确列出缺失 env；5 个预留渠道标记为「即将支持」
- 注册 → 登录返回 token；`/api/auth/me` 用 token 正确取回用户，且**响应中无密码字段**
- 防篡改：伪造 token / 篡改 token 均返回 **401**；伪造 `state` 的回调被拒并回跳错误提示
- 未配置渠道 `/start` 返回 **400 + 明确缺少的环境变量**；未知渠道 **404**
- `npm run build` 通过（145 模块），lint 无错误
- 部署 → https://reislinaa.github.io/Artic/

**说明**：飞书、钉钉的官方图标在 `simple-icons` v16 已下架，当前用**品牌色首字占位**；
拿到官方 SVG 后替换 `AuthModal.jsx` 的 `ICON_MAP` 即可，其余逻辑无需改动。

**附带修复（运行时数据误入库）**：
- 发现 `server/data/users.json`（含测试账号**明文密码**）随本次提交进入仓库
- `.gitignore` 增加 `server/data/`；执行 `git rm -r --cached server/data` 取消跟踪；本地测试数据已删除
- ⚠️ **git 历史（commit `d14906b`）中仍留有该测试数据**。因其仅为本机联调用的假账号
  （密码是固定测试值、非真实用户），未做历史重写；若后续清理可考虑 `git filter-repo`

### 2026-09-10 · 启用官方 logo + 修正品牌图标（换常用软件、修错误项、放大 20%）
**用户要求**：
1. 文件夹里放了 ARTIC 的 logo，要求网站改用这个 logo；
2. 「全场景通用」区块：① 图标改成常用软件（国内外）；② 现有图标**有错误项**；③ 图标偏小，**调大 20%**。

**代码改动痕迹**：
- **官方 logo 接入**
  - 用 Pillow 写脚本把 `logo.jpg`（浅灰圆角底 + 黑色笔画）**去底转透明**：
    按亮度映射 alpha（亮 → 透明、暗 → 不透明），裁到笔画外框后居中放到正方形画布
  - 输出 `public/artic-logo.png`(512) / `public/favicon.png`(192) / `public/favicon.ico`(16/32/48)
  - `Navbar.jsx`、`Footer.jsx`：改用 `<img className="brand-mark">`；
    路径用 `import.meta.env.BASE_URL` 拼接，保证子路径部署（`/Artic/`）下正确加载
    （**注意**：JSX 里写死 `/xxx.png` 不会被 Vite 改写 base，会 404）
  - `index.html`：站点图标由 `/favicon.svg` 改为 png + ico + apple-touch-icon
  - `index.css`：新增 `.brand-mark` 全局样式
  - **删除** `src/components/ArticLogo.jsx`（自绘图形方案废弃）与 `public/favicon.svg`（旧流星图标）
- **品牌图标修正**
  - 重写 `scripts/gen-icons.mjs`：国内 + 国际两组**交替排列**，并对每个条目**强校验**
    （`simple-icons` 取不到即报错退出）；脚本顶部写明已下架品牌清单，防止后人再踩坑
  - 重新生成 `src/data/app-icons.js`：**75 个全部验证通过**
    （国内 13：微信 / QQ / 搜狗 / 知乎 / 小红书 / B站 / 微博 / 百度 / 支付宝 / 淘宝 / 掘金 / CSDN / Gitee；
      国际 62：Discord / Telegram / WhatsApp / Zoom / Gmail / Notion / Obsidian / DeepL / Grammarly /
      GitHub / Cursor / Chrome / Safari / Claude / Gemini / X / YouTube 等）
  - **移除**旧列表中的错误项与不相关项
  - `EverywhereSection.css`：图标卡片**整体放大 20%**
    （外环 52 → **62px**、内环 44 → **53px**；响应式同步 38→46、30→36、32→38、26→31）

**根因（为什么之前会混入错误图标）**：
`simple-icons` **v16 因商标原因下架了一批品牌**，而旧脚本对这些名字「取不到就静默跳过」，
于是列表里混入了错误或不相关的图标。已下架且**不可用**的品牌包括：
Microsoft 全系（Windows / Word / Excel / PowerPoint / Outlook / Teams / Edge / OneNote）、
Slack、OpenAI、Canva、Adobe 全系、LinkedIn、钉钉、飞书、抖音、WPS、阿里云、腾讯系、有道等。
**新增品牌前必须先确认该版本是否收录。**

**验证与部署结果**：
- `node scripts/gen-icons.mjs` → ✅ 75 个图标，圆环实际展示 38 个（外 19 + 内 19）
- `node scripts/build-with-base.mjs /Artic/` 通过；产物含 `artic-logo.png` / `favicon.png` / `favicon.ico`，
  `index.html` 图标路径已正确改写为 `/Artic/...`
- lint 无错误
- 部署 → https://reislinaa.github.io/Artic/

### 2026-09-10 · 支付改为独立收银台页面 + 引入 hash 路由
**用户要求**：不能做成点击支付按钮，跳转到另一个支付页面吗？

**代码改动痕迹**：
- 新建 `src/pages/CheckoutPage.jsx` / `CheckoutPage.css` —— **独立收银台页面**：
  - 顶部：返回定价 + 「收银台」标题 + 安全标识 + 订单号
  - 左栏：渠道切换（微信 / 支付宝）+ 二维码 + 扫码提示 + **15 分钟失效倒计时** + 轮询状态
  - 右栏：订单摘要（方案 / 周期 / 单价 / 数量 / 应付金额）+ 权益列表 + 订阅说明
  - 状态机：`creating` / `pending` / `paid` / `expired` / `failed`；超时可「重新下单」
  - 直接访问未带方案时显示引导页，避免产生空订单
- `src/pages/PaymentPage.jsx`：**移除**内嵌支付面板与订单逻辑，只负责方案选择；
  点「订阅月付 / 订阅年付」→ `onNavigate('checkout', { plan })`
- `src/pages/PaymentPage.css`：收银台样式拆出，只保留方案卡片相关
- `src/App.jsx`：引入**极简 hash 路由**（`#/pricing`、`#/checkout?plan=pro-yearly`…），
  支持手改地址与浏览器前进 / 后退；收银台隐藏页脚、导航高亮保持「定价」
- `DESIGN.md`：页面结构表新增「收银台页」，补充路由说明

**验证与部署结果**：
- `npm run build` 通过（146 模块），lint 无错误
- 部署 → https://reislinaa.github.io/Artic/ ；源码推送 `main`

**备注**：收银台的 15 分钟倒计时为**前端展示**；后端订单仍是内存实现且无服务端过期，
正式上线前需落库并补服务端过期与幂等（已记入待办）。

### 2026-09-10 · 仓库改名 Artic + 全局同步 + 建立本日志
**用户要求**：
1. 仓库名已改为 `Artic`，要求把所有相应名称都改成 `Artic`；
2. 写一个日志放到文件夹里，记录每次的要求与代码改动痕迹；
3. 日志里必须写明「强制每次完成任务后都要修改日志」。

**代码改动痕迹**：
- 新建 `Artic项目日志.md`（本文件），置顶写入 5 条强制规则；删除旧的 `流星语项目日志.md`
- `部署到GitHub.bat`：标题「流星语」→「ARTIC」；示例参数 → `Reislinaa Artic`
- `scripts/deploy-gh-pages.mjs`：示例参数与提交者信息 → `Artic` / `deploy@artic.local`
- `ui-skills.md`、`public/ui-kit.html`：全部 URL `liuxingyu` → `Artic`
- `README.md`：按 ARTIC 定位重写，补充支付接口说明
- `package.json`：`name` → `artic`
- `F:\网站尝试\网址.txt`：更新为 `https://reislinaa.github.io/Artic/`
- `F:\网站尝试\启动网站.bat`：标题「AI 智能输入法」→「ARTIC」
- 用新 base `/Artic/` 重新构建并部署

**验证与部署结果（2026-09-10）**：
- 全局检索确认：`src/` 下 **0 处**残留旧名；仅本日志保留历史名称作记录
- 构建：`node scripts/build-with-base.mjs /Artic/` → `build ok, base=/Artic/`
- 部署：推送 `gh-pages` 成功 → https://reislinaa.github.io/Artic/
- 核验：读取 `gh-pages` 分支 `index.html`，确认资源路径已是 `/Artic/assets/...`、
  favicon 为 `/Artic/favicon.svg`（浏览器首次访问若见旧内容属 Pages CDN 缓存，稍后自愈）
- 源码推送 `main`：commit `03c097c`
- ⚠️ GitHub 仓库描述仍是旧文案，需在网页手动修改（AI 无仓库设置权限）

### 2026-09-10 · 品牌升级 ARTIC + 配色重构 + 支付链路双模式（大改）
**用户要求**：
1. 最终产品名是 **Artic**，按文件夹里的**商业计划书**的风格与产品任务调整网页（细调即可），配色可适当更改；
2. 当前任务是做好**支付链路**：还没有微信商户号、企业银行卡，先做一个**完美的展示品页面**，
   等手续办下来后**直接给证件号就能用**；
3. 所有工作先去 **GitHub** 找能用的、stars 多（或一般多）的开源方案，**不要新发的没人看的**，**别去其他网站找**。

**代码改动痕迹**：
- **解析商业计划书**：从 `Artic 商业计划书.pptx` 提取全文 21 页 + 主题色 → 得到品牌信息
  （字体 **MiSans**、冷调中性底、定价 ¥29.9/月与 ¥299/年、两大核心功能、目标人群、10/15 上线）
- **设计令牌**（`src/index.css`）：珊瑚 `#E85D4E` → **电光蓝 `#2B4BF2`**；
  底色 `#FAFAF8` → `#F7F8FA`；文字 `#1C1C1E` → `#0F172A`；渐变 → `#2B4BF2 → #6D4BFF`；字体 → **MiSans 优先**
- **全局换色**：`Hero.css`（含本地 `--primary` 重定义）、`pages.css`、`App.css`、`Features.css`、
  `StepsSection.css`、`Showcase.css`、`FeatureShowcase.css`、`Navbar.css`、`PaymentPage.css`、`index.css`
- **品牌标识**：新建 `src/components/ArticLogo.jsx`（声波收敛为文字行），替换 `Navbar.jsx`、`Footer.jsx` 里的流星 SVG
- **品牌改名**：`Navbar` / `Footer` / `Hero` / `IntroPage` / `DownloadPage` / `AboutPage` / `StepsSection` /
  `Showcase` / `PlatformSection` / `Features` / `LightTrails` 共 17 个文件的「流星语」→「ARTIC」；邮箱域名 → `artic.cn`
- **文案对齐 BP**：Hero 增「超长音频稳定 3 秒内出稿」；FeatureShowcase 标题改「**润色质量，才是分水岭**」；
  IntroPage 六大场景改为商务场景（客户沟通/工作汇报/商务邮件/会议记录/跨语言沟通/内容创作）；
  AboutPage 按 BP 重写（**刻意未发布**财务预测、股东履历、竞品实测等内部资料）
- **支付链路**（新建 `server/pay.js`）：
  - 定价改为 BP 口径：`pro-monthly` ¥29.9 / `pro-yearly` ¥299 / 企业版按人数
  - **演示 / 正式自动双模式**：未配置商户参数→演示（8 秒模拟到账）；配齐后自动走真实通道
  - 微信 APIv3 Native 下单（`code_url`）+ 回调 AES-256-GCM 解密 + 平台证书验签
  - 支付宝当面付 `alipay.trade.precreate`（`qrCode`）+ `checkNotifySign` 验签 + 金额核对
  - 路由：`GET /api/pay/status`、`POST /api/order/create`、`GET /api/order/status`、
    `POST /api/order/forcepaid`（**正式模式 403 拒绝**）、`POST /api/pay/wechat/notify`、`POST /api/pay/alipay/notify`
  - `server/index.js`：保留 raw body 用于验签、新增 urlencoded 解析、启动日志打印支付模式与缺失字段
- **支付页**（`PaymentPage.jsx/css`）：三档方案 + 支付模式提示条 + 公众号二维码 + 订单轮询 + 成功态
- **配置模板**：重写 `.env.example`（微信 7 项 + 支付宝 4 项 + 部署项，标注获取位置）
- **文档**：重写 `DESIGN.md`（新增品牌定位与支付架构章节）；`ui-skills.md`、`public/ui-kit.html` 品牌名同步

**GitHub 选型结论（只用了 GitHub 检索）**：
- Node 栈可用：`alipay-sdk` 4.14.0（官方）、`wechatpay-node-v3` 2.2.1、`wechatpay-axios-plugin` 0.9.6（TheNorthMemory，302★）
- 高星支付库多为其他语言：`binarywang/WxJava` 33.1k、`go-pay/gopay` 5.7k、`yansongda/pay` 5.4k、`minibear2021/wechatpayv3` 1.3k —— 与本项目 Node 栈不通用

**验证**：本地起服务实测通过 ——
```
支付模式: demo
微信待配置: WECHAT_MCHID, WECHAT_APPID, WECHAT_APIV3_KEY, WECHAT_SERIAL_NO, ...
下单: pro-yearly ¥299 → pending → paid ✓
非法方案 → 400 ✓（服务端价格校验）
```
`npm run build` 通过（144 模块），lint 无错误。

### 2026-09-06 · 支付页初版 + 支付参数模板
**用户要求**：做一个支付页面（国内：微信 + 支付宝扫码，需二维码 + 订单轮询）。
**代码改动痕迹**：
- 新建 `src/pages/PaymentPage.jsx` / `PaymentPage.css`（方案选择 + 渠道切换 + 二维码 + 轮询 + 成功态）
- `App.jsx` 增加 `case 'pricing'`；`Navbar.jsx` 增加「会员」入口（后改为「定价」）
- `server/index.js` 增加 mock 订单接口；安装 `qrcode` 用于前端生成二维码
- 新建 `.env.example`；`.gitignore` 增加 `!.env.example` 例外（否则模板被 `.env.*` 规则挡住）
**验证**：创建订单 / 状态轮询 / 模拟支付全部通过；已部署。

### 2026-09-04 前后 · 设计栈说明书（让其他 AI 复用全套能力）
**用户要求**：把所有 UI 设计插件和 skill 总结成**一个命令**（网址或代码都行），
一定要让**另一个 AI 明白我们用了什么**，并且能通过这个命令找到。
**代码改动痕迹**：
- 新建 `ui-skills.md`（7 个 skill 清单 + 用途 + 来源 + 浓缩设计语言 + 加载命令）
- 新建 `public/ui-kit.html`（自包含网页版，部署到 `/ui-kit.html`）
**验证**：线上可访问，AI 抓取后能读到技能清单与加载指令。

### 2026-08-28 ~ 09-03 · 定位转型：改为 AI 输入法「流星语」（仿 typeless 亮色极简）
**用户要求**：不再做 AI 公司推广，改做 AI 输入法，叫「流星语」；仿 typeless 的简约风格，
要有自己的特点；主色调亮色、白色打底；加类似苹果广告的线条动画；可参考以设计出名的公司网站。
**代码改动痕迹**：整体重构为**亮色简约**（弃深色）；引入 `PageGlow` / `LightTrails` / `MindToText`（线条汇聚成文字）；
新建 `pages/`（IntroPage / DownloadPage / AboutPage）；`LegalPage`；`AuthModal`。
**备注**：此阶段的「流星雨 / 珊瑚暖色」视觉在 2026-09-10 被 ARTIC 冷调商务版取代。

### 2026-08-27 · 仓库改名 luixingyu → liuxingyu
**代码改动痕迹**：`vite.config.js` 注释、`scripts/deploy-gh-pages.mjs` 示例、
`ui-skills.md`、`public/ui-kit.html`、本日志 URL 全部同步；用新 base 重新构建部署。

### 2026-08-27 · 139 个真实品牌图标 + 双圈对转
**用户要求**：全场景通用展示 100+ 真实软件图标做双圈对转；垂直线需贯穿文字段；
所有自生成品牌图标必须替换为真实 SVG。
**代码改动痕迹**：装 `simple-icons`，写 `scripts/gen-icons.mjs` 生成 `src/data/app-icons.js`（139 个真实 path）；
`EverywhereSection` 重写（外圈 70 顺时针 / 内圈 69 逆时针）；`MindToText` 加粗放大 + 延长垂直线。

### 2026-08-27 · 首页大重构
**代码改动痕迹**：新建 `EverywhereSection`（旋转圆盘）、`StepsSection`（四步上移）；删除 `Showcase`；
`MindToText` 6 圆减至 3 圆；`Hero` 改 1200px 宽屏双栏。

### 2026-08-27 · 图标与性能优化
**用户要求**：中文字符方块是垃圾图；转盘效果差；网页加载过慢。
**代码改动痕迹**：中文字符方块 → Lucide SVG；`AdapterCarousel` 删转盘改卡片网格；
字体加载改 preconnect + 异步；`vite.config.js` 加 `manualChunks` 分包。请求数 20+ → 7 条。

### 2026-08-27 · 修复白屏（base 路径拼写错误）
**根因**：base 误写 `/liuxingyu/` 而仓库名是 `luixingyu`，资源 404。
**代码改动痕迹**：修正 base；`build-with-base.mjs` 增加后处理自动剥离 `crossorigin`。

### 2026-08-26 · 流星动画 v1 → v4（多轮迭代）
**用户要求**：流星要有快慢之分与 4~5 种等级；轨迹真实（斜向下）；火流星尾迹是**一条线**而非泡泡；
节奏随机；不要极光改飘动的云；首屏 1 秒内必出大流星；地面黑色剪影（建筑/人/山）并由流星**局部照亮**、越大照得越远。
**代码改动痕迹**：`MeteorCanvas.jsx` 重写（五级流星 faint/normal/bright/slow/fireball，速度 700~150）；
`initCloud`/`drawCloud` 飘云半遮盖；`drawGround` 黑色剪影 + `lightR` 随 size 缩放的局部照亮；窗户常亮。

### 2026-08-26 · 首页与流星综合调整
**代码改动痕迹**：`index.html` 标题去「AI 输入法」字样；流星整体调慢并分级；极光低亮度回归；
首页标题重写（去掉「太土」的统计数字）；加鼠标跟随光效 `.hero-mouse-glow` 与按钮高光。

### 2026-08-26 · 初始搭建（含重大坑排查）
**代码改动痕迹**：React + Vite + Express 框架；sqlite3 编译失败改为 **JSON 存储**；
白屏根因是 `react`/`react-dom` 未正确安装（转换 3 → 44 模块）；中文路径乱码 → 建 `F:\ai-im` ASCII 链接；
本地预览始终打不开，改用 **GitHub Pages** 公网验证。

---

## 八、需求存档（咨询类，未改代码）

| 日期 | 用户问题 | 结论 |
|------|----------|------|
| 2026-09-06 | 别的软件只有一个窗口，为什么我们要开 napcat 黑窗口？ | NapCat 是独立进程，黑框只是它的控制台。三种单窗口方案：① 主程序用 `child_process.spawn(..., { windowsHide: true })` 隐藏启动；② 用 `NapCat.Service.exe` 注册成 Windows 服务（完全无窗口、开机自启，推荐）；③ 用 NapCat 自带 WebUI 版。用户选择"暂时不做"。 |
| 2026-09-06 | 支付页面 GitHub 上有没有现成的？ | 前端壳有（SK5190/payment-landing-page 等），但真正能收款的成品极少；关键在于后端下单+回调，且必须有自己的商户号。最终改为在项目内自建。 |
| 2026-09-10 | 上线要提供什么，比如微信账号？ | 微信：商户号 mchid（需营业执照）+ 已认证小程序/服务号 AppID（300 元/年）+ APIv3 密钥 + 商户证书 + 公网 HTTPS 回调域名。支付宝：个人实名可签「当面付」但额度受限，企业额度更高。商户号收款进**对公账户**，不存在"商户微信号"这种概念。支付宝不需要公众号。 |
| 2026-09-10 | 是不是要新建一个公众号？ | 若公司名下没有已认证的服务号/小程序，就需要新建一个拿 AppID。**建议注册小程序**（更适合工具类产品，后续可做工具入口/会员中心），而非服务号。 |
| 2026-09-10 | 支付模块需要我提供什么信息？ | 三类：① 平台账号资质（微信支付商户号 / 支付宝应用）② 密钥文件（放入 `server/certs/`）③ 一个公网 HTTPS 域名（后端需公网可达才能收回调）。精确字段见 `.env.example`：**微信 7 项必填 + 1 项建议，支付宝 4 项必填**。要点：支付账号申请**不依赖域名**（`notify_url` 下单时传入，无需预先登记）；但真实收款必须先把 `server/` 部署到公网。另可加支付宝**沙箱开关**（`ALIPAY_SANDBOX=true`）用于正式资质下来前跑通全链路。 |

---

## 九、待办事项

- [ ] 办理**微信支付商户号**（营业执照 + 对公账户）
- [ ] 注册并认证**企业小程序**（拿 AppID）
- [ ] 签约支付宝**当面付**
- [ ] 服务器 + 域名 + ICP 备案 + HTTPS（接收支付回调的前提）
- [ ] 证件号到手后：填入 `.env` → 部署后端 → 支付页自动切换正式模式（**无需改代码**）
- [ ] GitHub 仓库描述仍是旧文案「流星语 - AI 智能输入法」，需在网页手动改
- [ ] 确认正式邮箱域名（当前暂用 `artic.cn`：support@ / business@ / feedback@）
- [ ] 订单存储改为数据库 + 幂等处理（当前为内存实现，重启即丢）
- [x] ~~账号安全：明文密码改哈希~~ ✅ **已完成**（2026-09-10，scrypt + 历史数据透明迁移）
- [ ] 申请第三方登录凭据：微信开放平台「网站应用」/ QQ 互联 / 飞书开放平台 / 钉钉开放平台
      （各自需登记回调地址 `https://域名/api/auth/<渠道id>/callback`）
- [ ] 补飞书 / 钉钉官方图标 SVG（当前为品牌色首字占位，替换 `AuthModal.jsx` 的 `ICON_MAP`）
- [ ] 订单落库 + 服务端过期与幂等（当前为内存实现，收银台倒计时仅为前端展示）
- [ ] 接入真实大模型 API（需 API Key）
