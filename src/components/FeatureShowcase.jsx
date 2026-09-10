import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'
import './FeatureShowcase.css'

gsap.registerPlugin(ScrollTrigger)

/* 顺序即优先级（v15 调整）：
   第一屏已经用「口语 → 商务稿」演示过产品的核心差异，这里必须**接着它讲**，
   所以把「口语直接改成书面语」放在 01；其余按「独特性」递减排，
   转写、词库、隐私这些**通用能力**放到后面。
   上一版是按功能流水线排的（转写→纠正→格式化→编辑…），
   结果最独家的能力被压在中间，和第 7 条长得一模一样 —— 用户看不出特色。 */
const features = [
  {
    id: 'edit',
    label: '01',
    en: 'Speak to Edit',
    title: '口语直接改成书面语',
    desc: '说一句「改正式一点」，「这个方案我觉得还可以」就变成「该方案具备可行性」。不用手动选字删改，开口即可改稿——这是 ARTIC 和普通语音输入最本质的区别。',
    mockup: 'edit',
    featured: true
  },
  {
    id: 'correct',
    label: '02',
    en: 'Self-Correction',
    title: '自我纠正识别',
    desc: '嘴瓢、重复、自我纠正都会被智能过滤。你说"不对，改成..."，它只保留最终想表达的意思。',
    mockup: 'cleanup'
  },
  {
    id: 'format',
    label: '03',
    en: 'Auto Format',
    title: '自动格式化',
    desc: '口述的清单、步骤、要点会被自动整理成结构化文本。告别手动排版，开口就是成品。',
    mockup: 'format'
  },
  {
    id: 'tone',
    label: '04',
    en: 'Personal Tone',
    title: '个性化文风',
    desc: '学习你的语气、习惯和表达偏好。给朋友轻松，给客户正式，让输出始终像你自己写的。',
    mockup: 'tone'
  },
  {
    id: 'voice',
    label: '05',
    en: 'Voice to Text',
    title: 'AI 语音转写',
    desc: '自然说话即可生成准确文字。长句与专业术语都能被清晰识别，超长音频稳定 3 秒内出稿——说完即所得。',
    mockup: 'phone'
  },
  {
    id: 'vocab',
    label: '06',
    en: 'Custom Vocabulary',
    title: '个人词库',
    desc: '添加专业名词、品牌名、缩写或生僻词，越用越准，避免反复纠正同一个人名或术语。',
    mockup: 'vocab'
  },
  {
    id: 'privacy',
    label: '07',
    en: 'Privacy First',
    title: '隐私优先',
    desc: '语音与文本优先在本地处理，敏感内容无需上传云端，你的表达只属于你。',
    mockup: 'privacy'
  }
]

function PhoneMockup() {
  return (
    <div className="mockup-chatbox">
      <div className="mockup-chatbox-header">
        <div className="mockup-chatbox-avatar">A</div>
        <div className="mockup-chatbox-info">
          <div className="mockup-chatbox-name">阿明</div>
          <div className="mockup-chatbox-status">在线</div>
        </div>
      </div>
      <div className="mockup-chatbox-body">
        {/* 内容必须是商务场景：全站定位是「商务写作」，演示却是约饭聊天，
            是上一版「看不出产品特色」最直接的原因。 */}
        <div className="mockup-chatbox-bubble mockup-chatbox-bubble-them">
          周五的评审会你能来吗？
        </div>
        <div className="mockup-chatbox-bubble mockup-chatbox-bubble-me mockup-chatbox-bubble-voice">
          <div className="mockup-chatbox-wave" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                style={{
                  '--h': (Math.sin(i * 0.7) * 0.45 + 0.55).toFixed(2),
                  '--d': `${(i * 0.05).toFixed(2)}s`
                }}
              />
            ))}
          </div>
          <span className="mockup-chatbox-voice-time">0:03</span>
        </div>
        <div className="mockup-chatbox-bubble mockup-chatbox-bubble-me">
          可以，我把方案和排期一起带过去。
        </div>
      </div>
      <div className="mockup-chatbox-footer">
        <div className="mockup-chatbox-input">
          <span className="mockup-chatbox-input-text">按住说话</span>
          <span className="mockup-chatbox-input-mic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

function CleanupMockup() {
  return (
    <div className="mockup-text-editor">
      <div className="mockup-editor-header">
        <div className="mockup-editor-dot" />
        <div className="mockup-editor-dot" />
        <div className="mockup-editor-dot" />
      </div>
      <div className="mockup-editor-body">
        <p className="mockup-line mockup-line-strike">我们那个嗯明天的会议改成下午两点吧，不对，改成三点。</p>
        <p className="mockup-line mockup-line-final">明天的会议改成下午三点。</p>
        <div className="mockup-cleanup-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          已清理 6 个冗余词
        </div>
      </div>
    </div>
  )
}

function FormatMockup() {
  return (
    <div className="mockup-email">
      <div className="mockup-email-header">
        <div className="mockup-email-avatar">李</div>
        <div>
          <div className="mockup-email-from">李经理</div>
          <div className="mockup-email-subj">下周工作计划</div>
        </div>
      </div>
      <div className="mockup-email-body">
        <p className="mockup-email-p">已完成本周复盘，下周重点：</p>
        <div className="mockup-list">
          <div className="mockup-list-item"><span className="mockup-bullet" />完成产品需求评审</div>
          <div className="mockup-list-item"><span className="mockup-bullet" />输出 UI 设计稿</div>
          <div className="mockup-list-item"><span className="mockup-bullet" />召开技术对齐会</div>
        </div>
      </div>
    </div>
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

const VOCAB_WORDS = ['ARTIC', '张凯伦', 'LLM', '多模态']

function VocabMockup() {
  return (
    <div className="mockup-vocab">
      <div className="mockup-vocab-chat">
        <div className="mockup-vocab-header">
          <div className="mockup-vocab-title">个人词库</div>
          <div className="mockup-vocab-count">{VOCAB_WORDS.length} 个词条</div>
        </div>

        <div className="mockup-vocab-bubble">
          <span className="mockup-vocab-label">语音转写</span>
          <p className="mockup-vocab-text">
            这次{' '}
            <span className="mockup-vocab-highlight">ARTIC</span>{' '}
            接入了{' '}
            <span className="mockup-vocab-highlight">LLM</span>{' '}
            多模态能力，{' '}
            <span className="mockup-vocab-highlight">张凯伦</span>{' '}
            正在做最后验收。
          </p>
        </div>

        <div className="mockup-vocab-words">
          {VOCAB_WORDS.map((word) => (
            <span key={word} className="mockup-vocab-chip">
              {word}
            </span>
          ))}
          <span className="mockup-vocab-chip mockup-vocab-chip-add">+ 添加</span>
        </div>
      </div>
    </div>
  )
}

const APP_ICONS = {
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  ),
  notes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  ),
  table: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  )
}

function EverywhereMockup() {
  return (
    <div className="mockup-devices">
      <div className="mockup-device mockup-device-phone">
        <div className="mockup-device-screen">
          <div className="mockup-device-app">{APP_ICONS.chat}</div>
        </div>
      </div>
      <div className="mockup-device mockup-device-laptop">
        <div className="mockup-device-screen-lg">
          <div className="mockup-device-row">
            <div className="mockup-device-app">{APP_ICONS.mail}</div>
            <div className="mockup-device-app">{APP_ICONS.notes}</div>
            <div className="mockup-device-app">{APP_ICONS.code}</div>
          </div>
        </div>
      </div>
      <div className="mockup-device mockup-device-tablet">
        <div className="mockup-device-screen">
          <div className="mockup-device-app">{APP_ICONS.table}</div>
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

const mockups = {
  phone: PhoneMockup,
  cleanup: CleanupMockup,
  format: FormatMockup,
  edit: EditMockup,
  tone: ToneMockup,
  vocab: VocabMockup,
  privacy: PrivacyMockup
}

export default function FeatureShowcase() {
  const sectionRef = useRef(null)
  const bandsRef = useRef([])
  const triggersRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      bandsRef.current.forEach((band, i) => {
        if (!band) return
        const visual = band.querySelector('.feature-mockup')
        const texts = band.querySelectorAll('.feature-text-line')
        /* v11：这里原本还会对 mockup 内部的气泡/列表项逐个做 stagger 入场，
           意味着它们初始 opacity: 0 —— 一旦某个滚动触发器没及时触发，
           用户看到的就是一张「空白产品卡」（实测确实出现过）。
           现在只对整块 mockup 做一次淡入，卡内内容始终可见。 */
        const strikeWords = band.querySelectorAll('.mockup-line-strike')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: band,
            start: 'top 82%',
            /* v11：`once: true` —— 播完即销毁该触发器。
               原来用 'play none none reverse'，向上滚动会把内容倒放消失，
               容易被误认为「内容没加载出来」；而且 7 个 band 反复重建时间线会拖慢。
               `once` 之后既不会倒放，也不再重复计算。 */
            once: true
          }
        })

        /* v11：三条入场都去掉 scale 与回弹缓动。
           「缩放淡入 + back.out 回弹」是 AI 生成页面最典型的动效签名，
           这里统一成「轻微上移 + 淡入 + power2.out」。 */
        tl.fromTo(
          visual,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }
        )
          .fromTo(
            texts,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' },
            '-=0.6'
          )

        if (strikeWords.length) {
          tl.fromTo(
            strikeWords,
            { opacity: 1 },
            { opacity: 0.75, duration: 0.8, ease: 'power2.out' },
            '-=0.2'
          )
        }

        triggersRef.current.push(tl.scrollTrigger)
      })
    }, sectionRef)

    return () => {
      triggersRef.current.forEach((st) => st?.kill())
      triggersRef.current = []
      ctx.revert()
    }
  }, [])

  return (
    <section className="feature-showcase" id="features" ref={sectionRef}>
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

      <div className="feature-bands">
        {features.map((f, i) => {
          const Mockup = mockups[f.mockup]
          const isEven = i % 2 === 0
          return (
            <div
              key={f.id}
              className={`feature-band ${isEven ? 'feature-band-left' : 'feature-band-right'}${
                f.featured ? ' feature-band-featured' : ''
              }`}
              ref={(el) => (bandsRef.current[i] = el)}
            >
              <div className="feature-band-inner">
                <div className="feature-band-content">
                  <span className="feature-text-line feature-label">
                    {f.label}
                    {f.featured && <em className="feature-chip">核心能力</em>}
                  </span>
                  <span className="feature-text-line feature-en">{f.en}</span>
                  <h3 className="feature-text-line feature-title">{f.title}</h3>
                  <p className="feature-text-line feature-desc">{f.desc}</p>
                </div>
                <div className="feature-mockup">
                  <div className="feature-mockup-frame">
                    <Mockup />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
