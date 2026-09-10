import { useEffect, useRef } from 'react'

// ============================================================
// LightTrails —— Apple 广告式流动光线动画
// 白色打底 + 品牌渐变光线缓慢流动，周期性一道"流星"亮线划过，
// 保留"ARTIC"的品牌意象，但气质是简约明亮的 Apple 风。
// ============================================================

const COLORS = [
  [79, 70, 229],    // 靛蓝
  [14, 165, 233],   // 天青
  [244, 114, 182],  // 樱粉
  [13, 148, 136]    // 青绿
]

export default function LightTrails() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let H = 0
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let running = true
    let rafId = 0
    let lastTime = performance.now()

    // 慢速流动线
    let trails = []
    // 快速"流星"线
    let meteor = null

    const rand = (a, b) => a + Math.random() * (b - a)
    const randPick = (arr) => arr[Math.floor(Math.random() * arr.length)]

    // 生成一条路径的采样函数：贝塞尔曲线
    const makePath = (pts) => {
      return (t) => {
        const n = pts.length
        const seg = Math.min(n - 2, Math.floor(t * (n - 1)))
        const local = Math.min(1, Math.max(0, t * (n - 1) - seg))
        const p0 = pts[seg]
        const p1 = pts[seg + 1]
        const c0 = pts[Math.max(0, seg - 1)]
        const c1 = pts[Math.min(n - 1, seg + 2)]
        // Catmull-Rom -> Bezier
        const x = 0.5 * ((2 * p0[0]) + (-c0[0] + p1[0]) * local + (2 * c0[0] - 5 * p0[0] + 4 * p1[0] - c1[0]) * local * local + (-c0[0] + 3 * p0[0] - 3 * p1[0] + c1[0]) * local * local * local)
        const y = 0.5 * ((2 * p0[1]) + (-c0[1] + p1[1]) * local + (2 * c0[1] - 5 * p0[1] + 4 * p1[1] - c1[1]) * local * local + (-c0[1] + 3 * p0[1] - 3 * p1[1] + c1[1]) * local * local * local)
        return [x, y]
      }
    }

    const initTrails = () => {
      const count = reducedMotion ? 3 : 6
      trails = []
      for (let i = 0; i < count; i++) {
        const color = COLORS[i % COLORS.length]
        const pts = []
        const segs = 4 + Math.floor(rand(0, 3))
        for (let s = 0; s <= segs; s++) {
          pts.push([rand(0, W), rand(H * 0.15, H * 0.85)])
        }
        trails.push({
          path: makePath(pts),
          t: rand(0, 1),
          speed: rand(0.05, 0.14),
          color,
          trail: [],
          maxTrail: Math.floor(rand(26, 46)),
          width: rand(1.4, 2.6),
          life: rand(0.5, 1)
        })
      }
    }

    const spawnMeteor = () => {
      const fromLeft = Math.random() < 0.5
      const color = randPick(COLORS)
      meteor = {
        fromLeft,
        x: fromLeft ? rand(-0.1, 0.2) * W : rand(0.8, 1.1) * W,
        y: rand(H * 0.05, H * 0.4),
        vx: (fromLeft ? 1 : -1) * rand(W * 0.5, W * 0.9),
        vy: rand(H * 0.25, H * 0.5),
        color,
        trail: [],
        maxTrail: 34,
        width: 2.2,
        life: 0,
        maxLife: rand(0.9, 1.6)
      }
    }

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = W * DPR
      canvas.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      initTrails()
      if (!meteor) spawnMeteor()
    }

    const drawTrail = (tr, alphaMul = 1) => {
      const pts = tr.trail
      const n = pts.length
      if (n < 2) return
      const [cr, cg, cb] = tr.color
      for (let i = 1; i < n; i++) {
        const k = i / n
        const alpha = Math.pow(k, 1.6) * 0.5 * tr.life * alphaMul
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`
        ctx.lineWidth = tr.width * (0.3 + 0.7 * k)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(pts[i - 1][0], pts[i - 1][1])
        ctx.lineTo(pts[i][0], pts[i][1])
        ctx.stroke()
      }
      // 头部亮点
      const head = pts[n - 1]
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${(0.55 * tr.life * alphaMul).toFixed(3)})`
      ctx.beginPath()
      ctx.arc(head[0], head[1], tr.width * 1.8, 0, Math.PI * 2)
      ctx.fill()
    }

    const update = (dt) => {
      // 慢速流动线
      for (const tr of trails) {
        tr.t += tr.speed * dt
        if (tr.t > 1) {
          tr.t = 0
          tr.trail = []
        }
        const p = tr.path(tr.t)
        tr.trail.push(p)
        if (tr.trail.length > tr.maxTrail) tr.trail.shift()
      }
      // 流星
      if (meteor) {
        meteor.x += meteor.vx * dt
        meteor.y += meteor.vy * dt
        meteor.life += dt
        meteor.trail.push([meteor.x, meteor.y])
        if (meteor.trail.length > meteor.maxTrail) meteor.trail.shift()
        // 飞远渐隐
        const fade = Math.pow(Math.max(0, 1 - meteor.life / meteor.maxLife), 0.6)
        if (fade <= 0.02 || meteor.x < -W * 0.2 || meteor.x > W * 1.2 || meteor.y > H * 1.2) {
          meteor = null
        } else {
          meteor._fade = fade
        }
      } else if (!reducedMotion) {
        spawnMeteor()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const tr of trails) drawTrail(tr)
      if (meteor && meteor._fade !== undefined) {
        drawTrail(meteor, meteor._fade)
      }
    }

    const loop = (time) => {
      if (!running) return
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      update(dt)
      draw()
      rafId = requestAnimationFrame(loop)
    }

    const onResize = () => resize()

    resize()
    if (reducedMotion) {
      // 减少动画：只画一帧静态光线
      for (let i = 0; i < trails.length; i++) trails[i].t = rand(0.3, 0.7)
      for (const tr of trails) {
        const p = tr.path(tr.t)
        for (let s = 0; s < 30; s++) {
          const t2 = Math.max(0, tr.t - s * 0.02)
          tr.trail.push(tr.path(t2))
        }
        drawTrail(tr, 0.7)
      }
    } else {
      window.addEventListener('resize', onResize)
      rafId = requestAnimationFrame(loop)
    }

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="light-trails-canvas" aria-hidden="true" />
}
