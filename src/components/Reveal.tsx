import type { ReactNode } from 'react'
import { useScrollReveal } from '../lib/useScrollReveal'

interface Props {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
  delay?: number
}

export default function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }: Props) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  return (
    <Tag
      ref={ref as any}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
