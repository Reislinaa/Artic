import Reveal from './Reveal'
import './StepsSection.css'

const steps = [
  { num: '1', title: '下载安装', desc: '选择你的平台，一键安装ARTIC' },
  { num: '2', title: '授权输入', desc: '在系统设置中启用ARTIC输入法' },
  { num: '3', title: '按住说话', desc: '在任意文本框按住语音键，开口即输入' },
  { num: '4', title: '享受表达', desc: '让每一次开口都变成可用的文字' }
]

export default function StepsSection() {
  return (
    <section className="section steps-section" id="steps">
      <div className="container">
        <Reveal variant="fade">
          <span className="section-kicker">Get started</span>
        </Reveal>
        <Reveal variant="blur">
          <h2 className="section-title">四步开始</h2>
        </Reveal>
        <Reveal delay={1} variant="fade">
          <p className="section-subtitle">零学习成本，像使用普通输入法一样简单</p>
        </Reveal>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) + 1} variant={['up', 'scale', 'blur', 'fade'][i % 4]}>
              <div className="step-card">
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
