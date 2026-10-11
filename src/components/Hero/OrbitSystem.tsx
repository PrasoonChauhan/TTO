import { forwardRef, type Ref } from 'react'

/** Orbit radii in planet radii (R). The moon graduates outward, one ring per revolution. */
export const RINGS = [1.45, 1.95, 2.45] as const
/** Vertical squash of each ellipse: the "camera" sits slightly above the orbital plane. */
export const FLATTEN = 0.26
/** Tilt of the orbital plane, in degrees. */
export const TILT_DEG = -14

const LABELS = ['01', '02', '03']
/** SVG user units per planet radius. */
const U = 100

/**
 * Back half of the system (full ellipses, painted behind the planet)
 * and front half (lower arcs, painted over the planet).
 */
function Rings({ layer }: { layer: 'back' | 'front' }) {
  const a = (TILT_DEG * Math.PI) / 180
  return (
    <svg className={`orbits orbits--${layer}`} viewBox="-300 -300 600 600" overflow="visible" aria-hidden="true">
      <g transform={`rotate(${TILT_DEG})`}>
        {RINGS.map((r, i) => {
          const rx = r * U
          const ry = r * FLATTEN * U
          return layer === 'back' ? (
            <path
              key={i}
              className={`ring ring-${i + 1}`}
              d={`M ${-rx} 0 A ${rx} ${ry} 0 1 1 ${rx} 0 A ${rx} ${ry} 0 1 1 ${-rx} 0`}
              pathLength={1}
            />
          ) : (
            <path
              key={i}
              className={`ring ring-${i + 1}`}
              d={`M ${-rx} 0 A ${rx} ${ry} 0 0 0 ${rx} 0`}
              pathLength={1}
            />
          )
        })}
      </g>
      {layer === 'front' && (
        <g className="ring-labels">
          {RINGS.map((r, i) => {
            // Index label sits just outside the left-most point of each tilted ring.
            const d = (r + 0.07) * U
            return (
              <text
                key={i}
                className={`ring-label ring-label-${i + 1}`}
                x={-d * Math.cos(a)}
                y={-d * Math.sin(a) + 4}
                textAnchor="end"
              >
                {LABELS[i]}
              </text>
            )
          })}
        </g>
      )}
    </svg>
  )
}

/**
 * The planet, its rings and the moon, all centred on the planet.
 * The moon's position is written every frame by the hero timeline.
 */
export const OrbitSystem = forwardRef<HTMLDivElement, { moonRef: Ref<HTMLDivElement> }>(function OrbitSystem(
  { moonRef },
  ref,
) {
  return (
    <div className="system" ref={ref} aria-hidden="true">
      <svg className="halo" viewBox="-100 -100 200 200" overflow="visible">
        <circle className="halo__line" r="99" pathLength={360} />
        <path className="halo__ticks" d="M 99 0 A 99 99 0 1 1 -99 0 A 99 99 0 1 1 99 0" pathLength={360} />
        <circle className="halo__node" cx="99" cy="0" r="0.9" />
      </svg>

      <Rings layer="back" />

      <div className="planet">
        <div className="planet__atmo" />
        <div className="planet__body">
          <div className="planet__surface" />
          <div className="planet__shade" />
        </div>
      </div>

      <Rings layer="front" />

      <div className="moon" ref={moonRef}>
        <div className="moon__body" />
      </div>
    </div>
  )
})
