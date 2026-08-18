import type { CSSProperties } from 'react'
import styles from './Spinner.module.css'

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      className={styles.spinner}
      style={{ '--size': `${size}px` } as CSSProperties}
      role="status"
      aria-label="Carregando"
    />
  )
}
