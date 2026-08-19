import styles from './Header.module.css'
import { LayersIcon, PrinterIcon, SparkleIcon, TruckIcon } from './icons'

const DESTAQUES = [
  { Icone: SparkleIcon, texto: 'Extração automática' },
  { Icone: LayersIcon, texto: 'SEDEX e PAC' },
  { Icone: PrinterIcon, texto: 'Pronto pra imprimir' },
]

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.linhaPrincipal}>
        <div className={styles.brand}>
          <img src="/LOGO%20LARANJA%201600.png" alt="BWR" className={styles.logo} />
          <div className={styles.titles}>
            <h1>Etiquetas SEDEX</h1>
            <p>Bombas, Serviços e Comércio</p>
          </div>
        </div>

        <div className={styles.destaques}>
          {DESTAQUES.map(({ Icone, texto }, indice) => (
            <span key={texto} className={styles.destaqueItem}>
              {indice > 0 && <span className={styles.separador} aria-hidden="true" />}
              <Icone width={14} height={14} />
              {texto}
            </span>
          ))}
        </div>

        <div className={styles.tag}>
          <TruckIcon width={15} height={15} />
          Geração automática a partir do orçamento
        </div>
      </div>
    </header>
  )
}
