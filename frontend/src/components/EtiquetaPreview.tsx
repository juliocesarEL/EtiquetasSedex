import { useRef } from 'react'
import styles from './EtiquetaPreview.module.css'
import { useEtiquetaCanvas } from '../hooks/useEtiquetaCanvas'
import { Spinner } from './ui/Spinner'
import type { CamposEtiqueta, LayoutEtiqueta } from '../types'

interface EtiquetaPreviewProps {
  layout: LayoutEtiqueta | null
  campos: CamposEtiqueta
}

export function EtiquetaPreview({ layout, campos }: EtiquetaPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEtiquetaCanvas(canvasRef, layout, campos)

  return (
    <div>
      <span className={styles.legenda}>
        <span className={styles.pontoVivo} />
        Prévia em tempo real
      </span>
      <div className={styles.wrap}>
        {layout ? (
          <canvas ref={canvasRef} className={styles.canvas} aria-label="Prévia da etiqueta SEDEX" />
        ) : (
          <div className={styles.placeholder}>
            <Spinner size={22} />
          </div>
        )}
      </div>
    </div>
  )
}
