import Reveal from './Reveal'

const apps = [
  { name: '微信', desc: '聊天中直接语音输入，秒出文字' },
  { name: '飞书', desc: '会议纪要与工作消息一气呵成' },
  { name: 'Notion', desc: '边想边写，文档从不卡壳' },
  { name: 'VS Code', desc: '注释、Commit 信息随口说' },
  { name: '邮件', desc: '正式邮件张口就来' },
  { name: '浏览器', desc: '任何文本框都能用' }
]

export default function Showcase() {
  return (
    <section className="section showcase" id="showcase">
      <div className="container">
        <Reveal variant="fade">
          <span className="section-kicker">Works everywhere you type</span>
        </Reveal>
        <Reveal variant="blur">
          <h2 className="section-title">在哪写，都能用</h2>
        </Reveal>
        <Reveal delay={1} variant="fade">
          <p className="section-subtitle">
            ARTIC不是另一个聊天机器人，它生活在每一个文本框里
          </p>
        </Reveal>

        <div className="showcase-grid">
          {apps.map((app, i) => (
            <Reveal key={app.name} delay={(i % 3) + 1} variant={['up', 'scale', 'blur'][i % 3]}>
              <div className="showcase-card">
                <div className="showcase-card-dot" aria-hidden="true" />
                <h3 className="showcase-card-name">{app.name}</h3>
                <p className="showcase-card-desc">{app.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
