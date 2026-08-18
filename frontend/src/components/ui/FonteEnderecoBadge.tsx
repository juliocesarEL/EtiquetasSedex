import styles from './Badge.module.css'
import type { FonteEndereco } from '../../types'

export function FonteEnderecoBadge({ fonte }: { fonte: FonteEndereco }) {
  if (!fonte) return null

  const texto = fonte === 'observacao' ? 'Endereço da observação' : 'Endereço padrão do orçamento'

  return (
    <span className={`${styles.badge} ${styles[fonte]}`}>
      <span className={styles.dot} />
      {texto}
    </span>
  )
}
