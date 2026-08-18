import styles from './StepIndicator.module.css'
import { CheckCircleIcon } from './icons'

export type Etapa = 'upload' | 'conferencia' | 'pronta'

const PASSOS: { chave: Etapa; rotulo: string }[] = [
  { chave: 'upload', rotulo: 'Enviar orçamento' },
  { chave: 'conferencia', rotulo: 'Conferir dados' },
  { chave: 'pronta', rotulo: 'Etiqueta pronta' },
]

export function StepIndicator({ etapaAtual }: { etapaAtual: Etapa }) {
  const indiceAtual = PASSOS.findIndex((p) => p.chave === etapaAtual)

  return (
    <ol className={styles.trilha}>
      {PASSOS.map((passo, indice) => {
        const concluido = indice < indiceAtual
        const ativo = indice === indiceAtual

        return (
          <li key={passo.chave} style={{ display: 'contents' }}>
            {indice > 0 && (
              <span className={`${styles.linha} ${indice <= indiceAtual ? styles.linhaConcluida : ''}`} />
            )}
            <div className={`${styles.passo} ${ativo ? styles.ativo : ''} ${concluido ? styles.concluido : ''}`}>
              <span className={styles.numero}>{concluido ? <CheckCircleIcon width={14} height={14} /> : indice + 1}</span>
              <span className={styles.rotulo}>{passo.rotulo}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
