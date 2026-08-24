import type { ReactNode } from 'react'

interface GuideSectionProps {
  id: string
  title: string
  intro?: ReactNode
  children: ReactNode
}

export function GuideSection({ id, title, intro, children }: GuideSectionProps) {
  return (
    <section className="guide-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="guide-section__heading">
        <h2 id={`${id}-title`} tabIndex={-1}>{title}</h2>
        {intro ? <div className="guide-section__intro">{intro}</div> : null}
      </div>
      {children}
    </section>
  )
}
