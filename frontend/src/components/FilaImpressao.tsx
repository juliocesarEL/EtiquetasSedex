import styles from './FilaImpressao.module.css'
import { Button } from './ui/Button'
import { LayersIcon, PrinterIcon, XIcon } from './icons'
import type { ItemFilaImpressao } from '../types'

interface FilaImpressaoProps {
  itens: ItemFilaImpressao[]
  onRemover: (id: string) => void
  onLimpar: () => void
  onImprimir: () => void
}

export function FilaImpressao({ itens, onRemover, onLimpar, onImprimir }: FilaImpressaoProps) {
  if (itens.length === 0) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.cabecalho}>
        <span className={styles.titulo}>
          <LayersIcon width={16} height={16} />
          Folha de impressão
          <span className={styles.contagem}>({itens.length}/4)</span>
        </span>
      </div>

      <div className={styles.lista}>
        {itens.map((item, indice) => (
          <div key={item.id} className={styles.item}>
            <img src={item.url} alt="" className={styles.miniatura} />
            <span className={styles.nome}>
              {indice + 1}. {item.destinatario || 'Sem nome'}
            </span>
            <button
              type="button"
              className={styles.remover}
              onClick={() => onRemover(item.id)}
              aria-label={`Remover etiqueta ${indice + 1} da folha`}
            >
              <XIcon width={14} height={14} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.acoes}>
        <Button variant="accent" icon={<PrinterIcon width={16} height={16} />} onClick={onImprimir}>
          Imprimir folha ({itens.length})
        </Button>
        <Button variant="ghost" onClick={onLimpar}>
          Limpar folha
        </Button>
      </div>
    </div>
  )
}
