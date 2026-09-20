import { useState } from 'react'
import Reveal from './Reveal'
import './FeatureShowcase.css'

/* 顺序即优先级（v15 调整）：
   第一屏已经用「口语 → 商务稿」演示过产品的核心差异，这里必须**接着它讲**，
   所以把「口语直接改成书面语」放在首位（专项大卡）。
   结构上不再「7 条左右交替、每条一张聊天框」的流水账（用户反馈：单一又枯燥），
   改为三种不同版式交替，做到「简洁但丰富」：
     ① 聚焦大卡（核心能力）—— 唯一的大演示
     ② 左交互面板 + 右侧三枚极简能力卡（文风是活的，其余做成卡片）
     ③ 收尾双栏（转写看数据 / 隐私看示意图）
   通用能力按调研结论降为「图标 + 一句话」，不占整张聊天框。 */

const EDIT_PROOFS = [
  { k: '3 秒', v: '超长音频出稿' },
  { k: '1 句', v: '口语 → 书面语' },
  { k: '所有', v: '应用内可用' }
]

const CARD_FEATURES = [
  {
    id: 'correct',
    label: '02',
    en: 'Self-Correction',
    title: '自我纠正识别',
    desc: '嘴瓢、重复、自我纠正，自动过滤，只保留你想说的。',
    icon: 'check'
  },
  {
    id: 'format',
    label: '03',
    en: 'Auto Format',
    title: '自动格式化',
    desc: '口述的清单、步骤、要点，自动整理成结构化文本。',
    icon: 'list'
  },
  {
    id: 'vocab',
    label: '06',
    en: 'Custom Vocabulary',
    title: '个人词库',
    desc: '专业名词、品牌、生僻词，越用越准。',
    icon: 'book'
  }
]

const ICONS = {
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  )
}

function EditMockup() {
  return (
    <div className="mockup-editor-card">
      <div className="mockup-editor-toolbar">
        <span>B</span>
        <span>I</span>
        <span>U</span>
        <span className="mockup-toolbar-divider" />
        <span>⋯</span>
      </div>
      <div className="mockup-editor-content">
        <p className="mockup-edit-old">这个方案我觉得还可以，再改改吧。</p>
        <p className="mockup-edit-new">该方案具备可行性，建议进一步完善后推进。</p>
      </div>
      <div className="mockup-command-chip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        </svg>
        "改正式一点"
      </div>
    </div>
  )
}

const TONE_PRESETS = [
  {
    key: 'casual',
    label: '轻松',
    text: '嘿，方案我看了，感觉不错，咱们再细化一下？'
  },
  {
    key: 'formal',
    label: '正式',
    text: '该方案整体可行，建议进一步细化后推进实施。'
  },
  {
    key: 'warm',
    label: '亲切',
    text: '这个方案我觉得挺好的，咱们一起再打磨打磨，让它更完善～'
  }
]

function ToneMockup() {
  const [active, setActive] = useState('formal')
  const current = TONE_PRESETS.find((t) => t.key === active)

  return (
    <div className="mockup-tone">
      <div className="mockup-tone-tabs">
        {TONE_PRESETS.map((t) => (
          <button
            key={t.key}
            className={`mockup-tone-tab ${active === t.key ? 'mockup-tone-active' : ''}`}
            onClick={() => setActive(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mockup-tone-chat">
        <div className="mockup-tone-bubble mockup-tone-bubble-them">
          <span className="mockup-tone-label">原始表达</span>
          <p className="mockup-tone-text mockup-tone-raw">方案我看了，还可以，再改改吧。</p>
        </div>
        <div className="mockup-tone-bubble mockup-tone-bubble-me">
          <span className="mockup-tone-label">{current.label}版</span>
          <p className="mockup-tone-text mockup-tone-polished" key={active}>{current.text}</p>
        </div>
      </div>
    </div>
  )
}

function PrivacyMockup() {
  return (
    <div className="mockup-privacy">
      <div className="mockup-shield">
        <svg viewBox="0 0 80 90" fill="none">
          <path d="M40 5 L70 20 V45 Q70 70 40 85 Q10 70 10 45 V20 Z" />
          <rect x="32" y="40" width="16" height="18" rx="2" />
          <path d="M32 40 V34 Q32 26 40 26 Q48 26 48 34 V40" />
        </svg>
        <div className="mockup-shield-badge">本地</div>
      </div>
      <div className="mockup-privacy-flow">
        <div className="mockup-privacy-node">
          <div className="mockup-privacy-icon mockup-privacy-mic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          </div>
          <span>语音输入</span>
        </div>
        <div className="mockup-privacy-arrow">
          <svg viewBox="0 0 40 8" fill="none">
            <path d="M0 4 H36 M32 1 L36 4 L32 7" />
          </svg>
        </div>
        <div className="mockup-privacy-node">
          <div className="mockup-privacy-icon mockup-privacy-device">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12" y2="18.01" />
            </svg>
          </div>
          <span>本地处理</span>
        </div>
        <div className="mockup-privacy-arrow">
          <svg viewBox="0 0 40 8" fill="none">
            <path d="M0 4 H36 M32 1 L36 4 L32 7" />
          </svg>
        </div>
        <div className="mockup-privacy-node">
          <div className="mockup-privacy-icon mockup-privacy-done">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <span>输出文字</span>
        </div>
      </div>
    </div>
  )
}

export default function FeatureShowcase() {
  return (
    <section className="feature-showcase" id="features">
      <div className="feature-showcase-header">
        <div className="container-wide">
          <Reveal variant="fade">
            <span className="section-kicker">Capabilities</span>
          </Reveal>
          <Reveal variant="blur">
            <h2 className="section-title">
              润色质量，才是分水岭
            </h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="section-subtitle">
              识别准只是及格线，写得好才是付费理由——从转写到成稿，每一步都为"说出来即成文"而设计
            </p>
          </Reveal>
        </div>
      </div>

      {/* —— Act 1 · 聚焦大卡：唯一的大演示（核心能力） —— */}
      <div className="fs-act fs-act-core">
        <div className="container-wide">
          <Reveal>
            <div className="core-layout">
              <div className="core-copy">
                <span className="feature-text-line fs-label">
                  01<em className="fs-chip">核心能力</em>
                </span>
                <span className="feature-text-line fs-en">Speak to Edit</span>
                <h3 className="feature-text-line fs-title">口语直接改成书面语</h3>
                <p className="feature-text-line fs-desc">
                  说一句「改正式一点」，「这个方案我觉得还可以」就变成「该方案具备可行性」。
                  开口即可改稿，不用手动选字删改——这是 ARTIC 与普通语音输入最本质的区别。
                </p>
                <ul className="fs-proofs">
                  {EDIT_PROOFS.map((p) => (
                    <li key={p.v}>
                      <span className="fs-proof-num">{p.k}</span>
                      <span className="fs-proof-label">{p.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="core-demo">
                <div className="core-demo-frame">
                  <EditMockup />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* —— Act 2 · 左交互面板 + 右侧能力卡（文风是活的，其余做卡片） —— */}
      <div className="fs-act fs-act-panel">
        <div className="container-wide">
          <Reveal>
            <div className="panel-layout">
              <div className="panel-lead">
                <span className="fs-en">Personal Tone</span>
                <h3 className="fs-title">个性化文风，越写越像你</h3>
                <p className="fs-desc">
                  学习你的语气与表达偏好。给朋友轻松、给客户正式，让输出始终像你自己写的。
                </p>
                <div className="panel-lead-demo">
                  <ToneMockup />
                </div>
              </div>
              <div className="panel-cards">
                {CARD_FEATURES.map((c) => (
                  <div className="panel-card" key={c.id}>
                    <div className="panel-card-icon">{ICONS[c.icon]}</div>
                    <div className="panel-card-body">
                      <span className="panel-card-en">
                        {c.label} · {c.en}
                      </span>
                      <h4 className="panel-card-title">{c.title}</h4>
                      <p className="panel-card-desc">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* —— Act 3 · 收尾双栏：转写看数据 / 隐私看示意图 —— */}
      <div className="fs-act fs-act-edge">
        <div className="container-wide">
          <div className="edge-layout">
            <Reveal>
              <div className="edge-block edge-voice">
                <span className="fs-en">Voice to Text</span>
                <h3 className="fs-title">AI 语音转写，说完即所得</h3>
                <p className="fs-desc">
                  自然说话即出准确文字，长句与专业术语都能清晰识别，超长音频稳定 3 秒内出稿。
                </p>
                <div className="edge-stat">
                  <span className="edge-stat-num">3s</span>
                  <span className="edge-stat-label">超长音频出稿时长</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="edge-block edge-privacy">
                <span className="fs-en">Privacy First</span>
                <h3 className="fs-title">隐私优先</h3>
                <p className="fs-desc">
                  语音与文本优先在本地处理，敏感内容无需上传云端，你的表达只属于你。
                </p>
                <div className="edge-demo">
                  <PrivacyMockup />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}