// ARTIC 品牌标识：把「语音波形」收敛成「规整的文字行」，
// 直接表达产品做的事——说出口的话，变成能直接发出去的稿。
// 单一渐变（电光蓝 → 紫），与站点 --grad-brand 保持一致。
export default function ArticLogo({ size = 30, id = 'artic' }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2B4BF2" />
          <stop offset="100%" stopColor="#6D4BFF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="9" fill={`url(#${id}-bg)`} />
      {/* 第一行：左半是声波，右半收敛为直线 */}
      <path
        d="M7 14.5c1.4 0 1.8-3 3.2-3s1.8 3 3.2 3 1.8-3 3.2-3"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path
        d="M17.4 14.5 H25"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* 第二行：已成文 */}
      <path d="M7 20 H21" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}
