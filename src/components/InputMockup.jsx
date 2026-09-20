import { useEffect, useState } from 'react'
import './InputMockup.css'

/**
 * 首屏产品演示：**口语 → 商务稿**。
 *
 * 为什么是这一幕：
 *   产品的核心差异不是「把语音变成文字」（那是转写，谁都能做），
 *   而是「把口语直接写成能发出去的稿」。所以首屏演示必须**完整演一遍这个改写过程**，
 *   而不是展示一段聊天。上一版这里放的是「晚上吃饭吗？」的约饭对话 ——
 *   和「商务写作工具」的定位自相矛盾，用户看了当然看不出产品特色。
 *
 * 动效原则：**只让「产品本身在动」**。
 *   逐字出现（模拟转写 / 打字）→ 停顿 → 「正在改写」→ 成稿逐字出现 → 口语原句被划掉。
 *   没有任何跟随鼠标的效果。
 *
 * 无障碍：prefers-reduced-motion 下直接呈现最终结果，不循环。
 */

/* 演示脚本。刻意选了「口语冗长 → 书面精简」最典型的一对句子。 */
const RAW = '这个方案我觉得还可以，回头再改改吧'
const POLISHED = '该方案具备可行性，建议进一步完善后推进'

const SPEED_RAW = 64 // 转写节奏 ms/字
const SPEED_OUT = 48 // 成稿输出节奏 ms/字
const HOLD_START = 520
const HOLD_BEFORE_POLISH = 760
const HOLD_POLISHING = 1000
const HOLD_END = 3600

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const onChange = (e) => setReduce(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduce
}

export default function InputMockup() {
  const reduce = usePrefersReducedMotion()
  const [rawCount, setRawCount] = useState(0)
  const [outCount, setOutCount] = useState(0)
  // raw 转写 → polishing 改写 → out 成稿输出 → done 完成
  const [phase, setPhase] = useState('raw')

  useEffect(() => {
    if (reduce) {
      setRawCount(RAW.length)
      setOutCount(POLISHED.length)
      setPhase('done')
      return
    }

    let cancelled = false
    const timers = []
    const wait = (ms) =>
      new Promise((resolve) => {
        timers.push(setTimeout(resolve, ms))
      })

    const run = async () => {
      while (!cancelled) {
        setPhase('raw')
        setRawCount(0)
        setOutCount(0)
        await wait(HOLD_START)

        // ① 转写：把你说的逐字打出来
        for (let i = 1; i <= RAW.length; i++) {
          if (cancelled) return
          setRawCount(i)
          await wait(SPEED_RAW)
        }
        await wait(HOLD_BEFORE_POLISH)
        if (cancelled) return

        // ② 改写：明确告诉用户「这一步在做什么」
        setPhase('polishing')
        await wait(HOLD_POLISHING)
        if (cancelled) return

        // ③ 成稿：书面语逐字输出
        setPhase('out')
        for (let i = 1; i <= POLISHED.length; i++) {
          if (cancelled) return
          setOutCount(i)
          await wait(SPEED_OUT)
        }
        setPhase('done')
        await wait(HOLD_END)
      }
    }

    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reduce])

  const speaking = phase === 'raw' && rawCount < RAW.length
  const done = phase === 'done'

  return (
    <div className="demo">
      <div className="demo-header">
        <span className="demo-window-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="demo-header-title">给客户的回复 · 微信</span>
      </div>

      <div className="demo-body">
        {/* 第一段：你说的（口语，结尾会被划掉） */}
        <div className="demo-block">
          <div className="demo-block-head">
            <span className="demo-label">你说的</span>
            <span className="demo-rec" data-on={speaking}>
              <span className="demo-rec-dot" aria-hidden="true" />
              语音 0:03
            </span>
          </div>
          <p className="demo-text demo-text-raw" data-done={done}>
            {RAW.slice(0, rawCount)}
            {speaking && <span className="demo-caret" aria-hidden="true" />}
          </p>
        </div>

        {/* 改写中 */}
        <div className="demo-process" data-visible={phase === 'polishing'}>
          <span className="demo-process-text">正在改写为书面语</span>
          <span className="demo-dots" aria-hidden="true">
            <i /><i /><i />
          </span>
        </div>

        {/* 第二段：ARTIC 成稿 */}
        <div className="demo-block demo-block-out" data-visible={phase === 'out' || done}>
          <div className="demo-block-head">
            <span className="demo-label demo-label-strong">ARTIC 稿</span>
            <span className="demo-badge" data-visible={done}>
              可直接发送
            </span>
          </div>
          <p className="demo-text demo-text-out">
            {POLISHED.slice(0, outCount)}
            {phase === 'out' && <span className="demo-caret" aria-hidden="true" />}
          </p>
        </div>
      </div>

      <div className="demo-footer">
        <div className="demo-input">
          <span className="demo-input-text">按住说话</span>
          {/* 全站唯一的橙色：核心动作 */}
          <span className="demo-mic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            <span className="demo-mic-ring" data-on={speaking} />
          </span>
        </div>
      </div>
    </div>
  )
}
