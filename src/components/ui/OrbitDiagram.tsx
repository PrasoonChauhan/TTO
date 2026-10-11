import './OrbitDiagram.css'
import { forwardRef, useId } from 'react'

/**
 * A planet with concentric orbits seen from slightly above the orbital plane.
 * Each ring is split in two: the far half is painted behind the planet and the
 * near half in front of it, so the rings read as circling the planet in 3D.
 * The moon lives in its own layer; callers move it with `placeMoon`.
 */

export type OrbitGeometry = {
  /** viewBox width and height */
  w: number
  h: number
  /** ring radii (major axis) in user units */
  rings: number[]
  /** minor/major ratio: smaller = flatter = camera closer to the plane */
  flatten: number
  /** tilt of the orbital plane in degrees */
  tilt: number
  planet: number
  moon: number
}

type Props = {
  g: OrbitGeometry
  /** Ring that is highlighted and carries the moon. */
  active: number
  /** Starting moon angle in radians. 0 = right, PI/2 = nearest the viewer. */
  moonAngle?: number
  /** Show 01/02/03 labels beside each ring. */
  labels?: boolean
  className?: string
}

/** Position on ring `r` at angle `a`, after tilt; `front` when on the near half. */
export function orbitPoint(g: OrbitGeometry, r: number, a: number) {
  const t = (g.tilt * Math.PI) / 180
  const ex = r * Math.cos(a)
  const ey = r * g.flatten * Math.sin(a)
  return {
    x: g.w / 2 + ex * Math.cos(t) - ey * Math.sin(t),
    y: g.h / 2 + ex * Math.sin(t) + ey * Math.cos(t),
    front: Math.sin(a) > 0,
  }
}

/** Move the moon of an OrbitDiagram, switching it behind/in front of the planet. */
export function placeMoon(svg: SVGSVGElement, g: OrbitGeometry, r: number, a: number) {
  const moon = svg.querySelector<SVGCircleElement>('.orbd__moon')
  const back = svg.querySelector('.orbd__moon-back')
  const front = svg.querySelector('.orbd__moon-front')
  if (!moon || !back || !front) return
  const p = orbitPoint(g, r, a)
  moon.setAttribute('cx', p.x.toFixed(2))
  moon.setAttribute('cy', p.y.toFixed(2))
  // Slightly larger on the near side for depth.
  moon.setAttribute('r', (g.moon * (p.front ? 1.12 : 0.88)).toFixed(2))
  const layer = p.front ? front : back
  if (moon.parentNode !== layer) layer.appendChild(moon)
}

export const OrbitDiagram = forwardRef<SVGSVGElement, Props>(function OrbitDiagram(
  { g, active, moonAngle = Math.PI * 0.32, labels = false, className = '' },
  ref,
) {
  const id = useId().replace(/:/g, '')
  const cx = g.w / 2
  const cy = g.h / 2
  const half = (r: number, front: boolean) => {
    const ry = r * g.flatten
    // Far half passes over the top (sweep 1), near half under the bottom (sweep 0).
    return `M ${cx - r} ${cy} A ${r} ${ry} 0 0 ${front ? 0 : 1} ${cx + r} ${cy}`
  }
  const moon = orbitPoint(g, g.rings[active], moonAngle)
  const t = `rotate(${g.tilt} ${cx} ${cy})`

  const rings = (front: boolean) =>
    g.rings.map((r, i) => (
      <path
        key={r}
        className={`orbd__ring orbd__ring--${front ? 'front' : 'back'}${i === active ? ' is-on' : ''}`}
        d={half(r, front)}
        pathLength={1}
      />
    ))

  const moonEl = (
    <circle className="orbd__moon" cx={moon.x} cy={moon.y} r={g.moon * (moon.front ? 1.12 : 0.88)} />
  )

  return (
    <svg ref={ref} className={`orbd ${className}`} viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-planet`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" className="orbd__stop-1" />
          <stop offset="38%" className="orbd__stop-2" />
          <stop offset="100%" className="orbd__stop-3" />
        </radialGradient>
      </defs>

      <g transform={t}>{rings(false)}</g>
      <g className="orbd__moon-back">{!moon.front && moonEl}</g>

      <circle className="orbd__planet" cx={cx} cy={cy} r={g.planet} fill={`url(#${id}-planet)`} />

      <g transform={t}>{rings(true)}</g>
      <g className="orbd__moon-front">{moon.front && moonEl}</g>

      {labels &&
        g.rings.map((r, i) => {
          // Upright label just outside the far-right point of each ring, away from page copy.
          const p = orbitPoint(g, r + 8, 0)
          return (
            <text key={r} className={`orbd__label${i === active ? ' is-on' : ''}`} x={p.x + 4} y={p.y + 3} textAnchor="start">
              0{i + 1}
            </text>
          )
        })}
    </svg>
  )
})
