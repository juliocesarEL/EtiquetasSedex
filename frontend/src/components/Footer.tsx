import styles from './Footer.module.css'
import { ArrowsUpIcon, GlassIcon, HandsIcon, MapPinIcon, PhoneIcon, UmbrellaIcon } from './icons'

const CUIDADOS = [
  { Icone: GlassIcon, rotulo: 'Frágil' },
  { Icone: ArrowsUpIcon, rotulo: 'Este lado para cima' },
  { Icone: HandsIcon, rotulo: 'Manuseie com cuidado' },
  { Icone: UmbrellaIcon, rotulo: 'Proteger da chuva' },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.conteudo}>
        <div className={styles.marca}>
          <img src="/LOGO%20LARANJA%201600.png" alt="" className={styles.logo} />
          <div>
            <h3>BWR Bombas, Serviços e Comércio</h3>
            <p>Geração automática de etiquetas SEDEX e PAC a partir dos orçamentos da empresa.</p>
          </div>
        </div>

        <div>
          <h4 className={styles.colunaTitulo}>Contato</h4>
          <div className={styles.linha}>
            <PhoneIcon width={15} height={15} />
            SAC: (11) 97675-6832
          </div>
          <div className={styles.linha}>
            <MapPinIcon width={15} height={15} />
            Rua Santa Rosália, 1411
          </div>
        </div>

        <div>
          <h4 className={styles.colunaTitulo}>Cuidados no transporte</h4>
          <div className={styles.cuidados}>
            {CUIDADOS.map(({ Icone, rotulo }) => (
              <span key={rotulo} className={styles.cuidadoItem} title={rotulo}>
                <Icone width={16} height={16} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.baixo}>© {new Date().getFullYear()} BWR Bombas, Serviços e Comércio — Etiquetas SEDEX</div>
    </footer>
  )
}
