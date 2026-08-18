import type { ReactNode } from 'react'
import styles from './Banner.module.css'
import { AlertTriangleIcon, CheckCircleIcon, SparkleIcon } from '../icons'

interface BannerProps {
  tone: 'error' | 'info' | 'success'
  children: ReactNode
}

const ICONS = {
  error: AlertTriangleIcon,
  info: SparkleIcon,
  success: CheckCircleIcon,
}

export function Banner({ tone, children }: BannerProps) {
  const Icon = ICONS[tone]
  return (
    <div className={`${styles.banner} ${styles[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon width={18} height={18} className={styles.icon} />
      <div>{children}</div>
    </div>
  )
}
