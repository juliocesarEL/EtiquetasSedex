import styles from './ResultCard.module.css'
import { Button } from './ui/Button'
import { CheckCircleIcon, DownloadIcon, LayersIcon, PrinterIcon, RefreshIcon } from './icons'
import { imprimirEtiquetaUnica } from '../utils/imprimir'

interface ResultCardProps {
  imagemUrl: string
  nomeArquivo: string
  naFila: boolean
  filaCheia: boolean
  onNovaEtiqueta: () => void
  onAdicionarAFila: () => void
  onRemoverDaFila: () => void
}

export function ResultCard({
  imagemUrl,
  nomeArquivo,
  naFila,
  filaCheia,
  onNovaEtiqueta,
  onAdicionarAFila,
  onRemoverDaFila,
}: ResultCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.selo}>
        <CheckCircleIcon width={26} height={26} />
      </div>
      <h2>Etiqueta pronta!</h2>
      <p>A etiqueta foi gerada no layout oficial BWR, pronta para imprimir e colar.</p>

      <div className={styles.imagemWrap}>
        <img src={imagemUrl} alt="Etiqueta SEDEX gerada" className={styles.imagem} />
      </div>

      <div className={styles.acoes}>
        <Button variant="secondary" icon={<RefreshIcon width={17} height={17} />} onClick={onNovaEtiqueta}>
          Nova etiqueta
        </Button>
        <Button
          variant={naFila ? 'accent' : 'secondary'}
          icon={<LayersIcon width={17} height={17} />}
          disabled={!naFila && filaCheia}
          onClick={naFila ? onRemoverDaFila : onAdicionarAFila}
        >
          {naFila ? 'Adicionada à folha ✓' : filaCheia ? 'Folha cheia (4/4)' : 'Adicionar à folha'}
        </Button>
        <Button variant="secondary" icon={<PrinterIcon width={17} height={17} />} onClick={() => imprimirEtiquetaUnica(imagemUrl)}>
          Imprimir
        </Button>
        <Button
          variant="primary"
          icon={<DownloadIcon width={17} height={17} />}
          onClick={() => {
            const link = document.createElement('a')
            link.href = imagemUrl
            link.download = nomeArquivo
            link.click()
          }}
        >
          Baixar PNG
        </Button>
      </div>
    </div>
  )
}
