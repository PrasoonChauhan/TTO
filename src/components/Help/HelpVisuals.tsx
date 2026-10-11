import { gsap } from '../../lib/gsap'

/**
 * Six monochrome scenes, one per discipline, drawn in the same 1px telemetry
 * language as The gap panel. Each scene is a <g> in one 320x320 SVG; buildScene
 * returns a looping timeline that plays only while that discipline is active.
 */

type P = { x: number; y: number }

/* Deterministic pseudo-random so layouts are stable between renders. */
function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const bez = (t: number, a: P, b: P, c: P, d: P): P => {
  const u = 1 - t
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  }
}

/* ---------- 01 Growth strategy: trajectory through milestones ---------- */
const TR = [{ x: 34, y: 262 }, { x: 120, y: 258 }, { x: 176, y: 120 }, { x: 288, y: 62 }] as const
const PLAN = 'M34 262 C 130 240, 210 160, 288 96'
const MILESTONES = [0.28, 0.52, 0.76, 1].map((t) => bez(t, ...TR))

/* ---------- 03 Marketing: audience around an emitter ---------- */
const AUDIENCE = (() => {
  const r = rng(7)
  return Array.from({ length: 30 }, () => {
    const a = r() * Math.PI * 2
    const d = 46 + r() * 98
    return { x: 160 + Math.cos(a) * d, y: 168 + Math.sin(a) * d * 0.82, d }
  })
})()

/* ---------- 04 Sales funnel ---------- */
const FUNNEL_STAGES = [
  { y: 56, label: 'Visits', value: '12.4K' },
  { y: 106, label: 'Leads', value: '1,860' },
  { y: 156, label: 'Demos', value: '420' },
  { y: 206, label: 'Closed', value: '96' },
]
const funnelX = (y: number) => {
  // Left/right edges of the funnel at height y (top 56 → bottom 250).
  const t = Math.min(1, Math.max(0, (y - 56) / 194))
  return { l: 104 + t * 88, r: 296 - t * 88 }
}

/* ---------- 05 Technology: layered network ---------- */
const LAYERS = [3, 4, 4, 2].map((n, li) =>
  Array.from({ length: n }, (_, i) => ({ x: 52 + li * 72, y: 160 + (i - (n - 1) / 2) * 52 })),
)
const EDGES = LAYERS.slice(0, -1).flatMap((layer, li) =>
  layer.flatMap((a) => LAYERS[li + 1].map((b) => ({ a, b }))),
)
const PULSE_ROUTES = [
  [0, 1, 2, 0],
  [1, 3, 0, 1],
  [2, 0, 3, 0],
  [1, 2, 1, 1],
]

/* ---------- 06 Data: bars ---------- */
const BARS = [38, 52, 46, 64, 72, 86, 104]

export function HelpVisuals() {
  return (
    <svg className="hv" viewBox="0 0 320 320" aria-hidden="true">
      {/* 01 Growth strategy */}
      <g className="hv__scene" data-scene="0">
        {[86, 138, 190, 242].map((x) => (
          <line key={x} className="hv__grid" x1={x} y1={40} x2={x} y2={276} />
        ))}
        <line className="hv__axis" x1={34} y1={276} x2={296} y2={276} />
        <path className="hv__plan" d={PLAN} />
        <path className="hv__line hv-s0-draw" d={`M${TR[0].x} ${TR[0].y} C ${TR[1].x} ${TR[1].y}, ${TR[2].x} ${TR[2].y}, ${TR[3].x} ${TR[3].y}`} pathLength={1} />
        {MILESTONES.map((m, i) => (
          <g key={i} className="hv-s0-node">
            <circle className="hv__node" cx={m.x} cy={m.y} r={5} />
            <text className="hv__label" x={m.x} y={m.y - 14} textAnchor="middle">
              Q{i + 1}
            </text>
          </g>
        ))}
        <circle className="hv__moon hv-s0-mover" cx={TR[0].x} cy={TR[0].y} r={6} />
        <text className="hv__label" x={34} y={28}>(Trajectory)</text>
        <text className="hv__label hv__label--dim" x={296} y={28} textAnchor="end">Plan vs actual</text>
      </g>

      {/* 02 Brand: logo construction */}
      <g className="hv__scene" data-scene="1">
        <rect className="hv__guide hv-s1-guide" x={64} y={52} width={192} height={192} />
        <line className="hv__guide hv-s1-guide" x1={64} y1={52} x2={256} y2={244} />
        <line className="hv__guide hv-s1-guide" x1={256} y1={52} x2={64} y2={244} />
        <line className="hv__guide hv-s1-guide" x1={160} y1={40} x2={160} y2={256} />
        <line className="hv__guide hv-s1-guide" x1={52} y1={148} x2={268} y2={148} />
        <circle className="hv__mark hv-s1-ring" cx={160} cy={148} r={72} pathLength={1} />
        <line className="hv__mark hv__mark--thin hv-s1-slash" x1={86} y1={222} x2={226} y2={82} pathLength={1} />
        <circle className="hv__moon hv-s1-dot" cx={232} cy={76} r={8} />
        {['#FAFAFA', '#BDBDBD', '#7A7A7A', '#3A3A3A'].map((c, i) => (
          <g key={c} className="hv-s1-swatch">
            <rect className="hv__swatch" x={64 + i * 50} y={268} width={42} height={22} rx={2} style={{ fill: c }} />
          </g>
        ))}
        <text className="hv__label" x={34} y={28}>(Identity system)</text>
      </g>

      {/* 03 Marketing: broadcast and reach */}
      <g className="hv__scene" data-scene="2">
        {[0, 1, 2].map((i) => (
          <circle key={i} className="hv__ripple hv-s2-ripple" cx={160} cy={168} r={8} />
        ))}
        {AUDIENCE.map((p, i) => (
          <circle key={i} className="hv__dot hv-s2-dot" cx={p.x} cy={p.y} r={3.2} data-d={p.d} />
        ))}
        <circle className="hv__moon" cx={160} cy={168} r={7} />
        {[
          ['SEO', 34, 60, 'start'],
          ['Content', 286, 60, 'end'],
          ['Paid', 34, 296, 'start'],
          ['Social', 286, 296, 'end'],
        ].map(([t, x, y, a], i) => (
          <text key={i} className="hv__label hv__label--dim hv-s2-channel" x={x} y={y} textAnchor={a as 'start' | 'end'}>
            {t}
          </text>
        ))}
        <text className="hv__label" x={34} y={28}>(Reach)</text>
      </g>

      {/* 04 Sales funnel */}
      <g className="hv__scene" data-scene="3">
        <path className="hv__line" d="M104 56 L296 56 L208 250 L208 286 M192 286 L192 250 L104 56" />
        {FUNNEL_STAGES.slice(1).map((s) => {
          const { l, r } = funnelX(s.y)
          return <line key={s.y} className="hv__grid" x1={l} y1={s.y} x2={r} y2={s.y} />
        })}
        {FUNNEL_STAGES.map((s) => (
          <g key={s.label} className="hv-s3-stage">
            <text className="hv__label hv__label--dim" x={20} y={s.y + 18}>{s.label}</text>
            <text className="hv__value" x={20} y={s.y + 36}>{s.value}</text>
          </g>
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} className="hv__dot hv__dot--on hv-s3-lead" cx={200} cy={44} r={3} />
        ))}
        <text className="hv__label" x={34} y={28}>(Pipeline)</text>
      </g>

      {/* 05 Technology & AI: network */}
      <g className="hv__scene" data-scene="4">
        {EDGES.map((e, i) => (
          <line key={i} className="hv__edge" x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} />
        ))}
        {LAYERS.map((layer, li) =>
          layer.map((n, i) => (
            <circle key={`${li}-${i}`} className={`hv__node hv-s4-node hv-s4-l${li}`} cx={n.x} cy={n.y} r={li === 3 ? 9 : 6.5} />
          )),
        )}
        {PULSE_ROUTES.map((_, i) => (
          <circle key={i} className="hv__moon hv-s4-pulse" cx={LAYERS[0][0].x} cy={LAYERS[0][0].y} r={3.6} />
        ))}
        {['Input', 'Model', 'Model', 'Output'].map((t, li) => (
          <text key={li} className="hv__label hv__label--dim" x={52 + li * 72} y={296} textAnchor="middle">
            {t}
          </text>
        ))}
        <text className="hv__label" x={34} y={28}>(Systems)</text>
      </g>

      {/* 06 Data & operations: dashboard */}
      <g className="hv__scene" data-scene="5">
        <rect className="hv__card" x={20} y={44} width={280} height={252} rx={4} />
        <text className="hv__label hv__label--dim" x={38} y={74}>Net revenue retention</text>
        <text className="hv__kpi hv-s5-kpi" x={36} y={120}>+0%</text>
        <path className="hv__line hv-s5-spark" d="M196 112 L214 104 L230 108 L246 92 L262 96 L280 74" pathLength={1} />
        <line className="hv__grid" x1={38} y1={140} x2={282} y2={140} />
        {BARS.map((h, i) => (
          <rect key={i} className="hv__bar hv-s5-bar" x={42 + i * 34} y={262 - h} width={22} height={h} rx={1.5} />
        ))}
        <line className="hv__axis" x1={38} y1={262} x2={282} y2={262} />
        <circle className="hv__moon hv-s5-live" cx={42} cy={281} r={3.2} />
        <text className="hv__label hv__label--dim" x={52} y={284}>14 automations running</text>
        <text className="hv__label" x={34} y={28}>(Live metrics)</text>
      </g>
    </svg>
  )
}

/** Looping timeline for one scene. Built paused; the section plays the active one. */
export function buildScene(i: number, g: SVGGElement): gsap.core.Timeline {
  const q = gsap.utils.selector(g)
  const tl = gsap.timeline({ paused: true })

  switch (i) {
    case 0: {
      const path = q('.hv-s0-draw')[0] as unknown as SVGPathElement
      const mover = q('.hv-s0-mover')[0]
      const len = path.getTotalLength()
      const pos = { t: 0 }
      gsap.set(path, { strokeDasharray: '1 1' })
      tl.set(q('.hv-s0-node'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
        .fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut' }, 0)
        .fromTo(pos, { t: 0 }, {
          t: 1,
          duration: 2.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            const p = path.getPointAtLength(pos.t * len)
            gsap.set(mover, { attr: { cx: p.x, cy: p.y } })
          },
        }, 0)
        .to(q('.hv-s0-node'), { opacity: 1, scale: 1, duration: 0.5, stagger: 0.5, ease: 'back.out(2)' }, 0.55)
        .to({}, { duration: 1.4 })
      tl.repeat(-1).repeatDelay(0)
      break
    }
    case 1: {
      tl.fromTo(q('.hv-s1-guide'), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.08 }, 0)
        .fromTo(q('.hv-s1-ring'), { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.4)
        .fromTo(q('.hv-s1-slash'), { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 1.4)
        .fromTo(q('.hv-s1-dot'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(2.5)' }, 2.0)
        .fromTo(q('.hv-s1-swatch'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, 2.2)
        .to(q('.hv-s1-guide'), { opacity: 0.35, duration: 0.8 }, 2.6)
        .to({}, { duration: 1.8 })
      tl.repeat(-1)
      break
    }
    case 2: {
      const PERIOD = 2.6
      q('.hv-s2-ripple').forEach((c, k) =>
        tl.fromTo(c, { attr: { r: 8 }, opacity: 0.9 }, { attr: { r: 160 }, opacity: 0, duration: PERIOD, ease: 'power1.out' }, k * (PERIOD / 3)),
      )
      q('.hv-s2-dot').forEach((d) => {
        const at = (Number(d.getAttribute('data-d')) / 160) * PERIOD * 0.55
        for (let k = 0; k < 3; k++) {
          tl.fromTo(d, { opacity: 0.22 }, { opacity: 1, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, at + k * (PERIOD / 3))
        }
      })
      tl.fromTo(q('.hv-s2-channel'), { opacity: 0.35 }, { opacity: 1, duration: 0.4, stagger: { each: 0.65, repeat: 1, yoyo: true } }, 0)
      tl.repeat(-1)
      break
    }
    case 3: {
      const r = rng(11)
      q('.hv-s3-lead').forEach((dot, k) => {
        const startX = 120 + r() * 160
        const lost = k % 3 !== 0 // most leads drop out; one in three reaches the close
        const exitY = lost ? 70 + r() * 150 : 296
        const exitX = funnelX(exitY)
        const endX = lost ? (startX < 200 ? exitX.l - 18 : exitX.r + 18) : 200
        const t0 = (k / 16) * 3.2
        tl.fromTo(dot, { attr: { cx: startX, cy: 40 }, opacity: 0 }, { opacity: 1, duration: 0.2 }, t0)
          .to(dot, { attr: { cx: lost ? endX : 200, cy: exitY }, duration: lost ? 1.1 : 1.8, ease: 'power1.in' }, t0 + 0.1)
          .to(dot, { opacity: 0, duration: 0.25 }, t0 + (lost ? 1.0 : 1.75))
      })
      tl.fromTo(q('.hv-s3-stage'), { opacity: 0.4 }, { opacity: 1, duration: 0.4, stagger: { each: 0.5, yoyo: true, repeat: 1 } }, 0)
      tl.repeat(-1)
      break
    }
    case 4: {
      const pulses = q('.hv-s4-pulse')
      PULSE_ROUTES.forEach((route, k) => {
        const pts = route.map((n, li) => LAYERS[li][n])
        const t0 = k * 0.55
        tl.set(pulses[k], { attr: { cx: pts[0].x, cy: pts[0].y }, opacity: 0 }, t0).to(pulses[k], { opacity: 1, duration: 0.15 }, t0)
        pts.slice(1).forEach((p, s) => tl.to(pulses[k], { attr: { cx: p.x, cy: p.y }, duration: 0.5, ease: 'power1.inOut' }, t0 + 0.15 + s * 0.5))
        tl.to(pulses[k], { opacity: 0, duration: 0.2 }, t0 + 1.65)
      })
      tl.fromTo(q('.hv-s4-l3'), { fill: 'rgba(250,250,250,0)' }, { fill: 'rgba(250,250,250,0.9)', duration: 0.3, yoyo: true, repeat: 3, stagger: 0.4 }, 1.4)
      tl.to({}, { duration: 0.6 })
      tl.repeat(-1)
      break
    }
    case 5: {
      const kpi = q('.hv-s5-kpi')[0]
      const n = { v: 0 }
      tl.fromTo(q('.hv-s5-bar'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9, stagger: 0.09, ease: 'power3.out' }, 0)
        .fromTo(q('.hv-s5-spark'), { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.2)
        .fromTo(n, { v: 0 }, { v: 27, duration: 1.4, ease: 'power3.out', onUpdate: () => { kpi.textContent = `+${Math.round(n.v)}%` } }, 0.2)
        .to(q('.hv-s5-live'), { opacity: 0.2, duration: 0.5, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0)
        .to({}, { duration: 0.6 })
      tl.repeat(-1)
      break
    }
  }
  return tl
}
