import styles from './Header.module.css'
import { TruckIcon } from './icons'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img src="/LOGO%20LARANJA%201600.png" alt="BWR" className={styles.logo} />
        <div className={styles.titles}>
          <h1>Etiquetas SEDEX</h1>
          <p>Bombas, Serviços e Comércio</p>
        </div>
      </div>
      <div className={styles.tag}>
        <TruckIcon width={15} height={15} />
        Geração automática a partir do orçamento
      </div>
    </header>
  )
}
