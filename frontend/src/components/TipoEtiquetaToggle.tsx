import styles from './TipoEtiquetaToggle.module.css'
import type { TipoEtiqueta } from '../types'

const OPCOES: { valor: TipoEtiqueta; rotulo: string }[] = [
  { valor: 'sedex', rotulo: 'SEDEX' },
  { valor: 'pac', rotulo: 'PAC' },
]

interface TipoEtiquetaToggleProps {
  valor: TipoEtiqueta
  onAlterar: (tipo: TipoEtiqueta) => void
}

export function TipoEtiquetaToggle({ valor, onAlterar }: TipoEtiquetaToggleProps) {
  return (
    <div className={styles.grupo} role="radiogroup" aria-label="Tipo de envio">
      {OPCOES.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          role="radio"
          aria-checked={valor === opcao.valor}
          className={`${styles.opcao} ${valor === opcao.valor ? styles.ativo : ''}`}
          onClick={() => onAlterar(opcao.valor)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  )
}
