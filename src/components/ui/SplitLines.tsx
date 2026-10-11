import type { ElementType } from 'react'

type Props = {
  lines: string[]
  as?: ElementType
  className?: string
}

/**
 * Line-mask text (PRD §3). Structure per line:
 *   .line-mask (overflow hidden) > .line-shell > .line-inner
 * `.line-inner` is used for reveals (yPercent 100 → 0).
 * `.line-shell` is used for exits, so reveal and exit tweens never fight.
 */
export function SplitLines({ lines, as: Tag = 'h2', className }: Props) {
  return (
    <Tag className={className} aria-label={lines.join(' ')}>
      {lines.map((line, i) => (
        <span className="line-mask" aria-hidden="true" key={i}>
          <span className="line-shell">
            <span className="line-inner">{line}</span>
          </span>
        </span>
      ))}
    </Tag>
  )
}
