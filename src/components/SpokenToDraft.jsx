import { useEffect, useRef, useState } from 'react'
import './SpokenToDraft.css'

const SPEAKING = `嗨，就……我说这话呀，张口就来了
那它最好呀，嗯，能直接就变成一篇能发出去的商务稿……懂我意思吧？
然后这口语嘛它自己得给我换成书面语，我一秃噜说错了它马上就纠正，还有我到哪儿都能用，一个习惯，处处都行。`

const DRAFT = `说出即稿——让说出口的话，直接变成能发出去的商务稿。
口语自动改书面语 · 说错即时纠正 · 一处习惯，处处能用`

/**
 * SpokenToDraft —— 首屏右侧的「口语 -> 成稿」演示。
 *
 * 叙事（用户创意）：
 *   1. 先把一段**口语化、带语气词和冗余**的话「说出来」（打字出现）；
 *   2. 停留约 0.6s 后，中央大图标**立体化并旋转（Siri 式球体）**，同时清空口语；
 *   3. 图标旋转期间，用**打字动画**写出书面定稿。
 *
 * 图标：wireframe 圆环球体 + 居中「ARTIC」字标；
 *       静止时只显示扁平字标，激活后圆环淡入并做 Y 轴旋转，立体可读性仍保留。
 * 所有动效在 prefers-reduced-motion 下关闭，直接展示成稿。
 */
export default function SpokenToDraft() {
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [orbOn, setOrbOn] = useState(false)
  const [phase, setPhase] = useState('speaking')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const intervals = []
    const timeouts = []
    const clearAll = () => {
      intervals.forEach(clearInterval)
      timeouts.forEach(clearTimeout)
    }

    const type = (str, speed, onDone) => {
      setTyping(true)
      let i = 0
      const iv = setInterval(() => {
        i = Math.min(str.length, i + 1)
        setText(str.slice(0, i))
        if (i >= str.length) {
          clearInterval(iv)
          setTyping(false)
          onDone && onDone()
        }
      }, speed)
      intervals.push(iv)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(DRAFT)
      setPhase('clean')
      return clearAll
    }

    // 1) 先说口语化的话
    type(SPEAKING, 24, () => {
      // 2) 停留一下
      timeouts.push(
        setTimeout(() => {
          // 3) 大图标立体化旋转 + 清屏
          setOrbOn(true)
          setPhase('clean')
          setText('')
          timeouts.push(
            setTimeout(() => {
              // 4) 打字写出书面版
              type(DRAFT, 34, () => {})
            }, 1300)
          )
        }, 650)
      )
    })

    return clearAll
  }, [])

  return (
    <div className="spoken-draft-wrap">
      <div className={`td-orb ${orbOn ? 'td-orb-on' : ''}`} aria-hidden="true">
        <span className="td-orb-halo" />
        <div className="td-sphere">
          <span className="td-ring td-ring-1" />
          <span className="td-ring td-ring-2" />
          <span className="td-ring td-ring-3" />
          <span className="td-ring td-ring-4" />
          <span className="td-ring td-ring-5" />
          <span className="td-ring td-ring-6" />
        </div>
        <span className="td-art">ARTIC</span>
      </div>

      <div className="td-panel">
        <span className={`td-badge ${phase}`}>
          {phase === 'speaking' ? '你随口说的' : 'ARTIC 写好的稿'}
        </span>
        <p className={`td-line ${phase}`}>
          {text}
          {typing && <span className="td-caret" aria-hidden="true" />}
        </p>
      </div>
    </div>
  )
}