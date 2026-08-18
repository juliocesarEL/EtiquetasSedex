import styles from './ConferenciaCard.module.css'
import { CamposForm } from './CamposForm'
import { EtiquetaPreview } from './EtiquetaPreview'
import { TipoEtiquetaToggle } from './TipoEtiquetaToggle'
import { Button } from './ui/Button'
import { Banner } from './ui/Banner'
import { ArrowLeftIcon, SparkleIcon } from './icons'
import type { CamposEtiqueta, FonteEndereco, LayoutEtiqueta, TipoEtiqueta } from '../types'

interface ConferenciaCardProps {
  campos: CamposEtiqueta
  fonteEndereco: FonteEndereco
  layout: LayoutEtiqueta | null
  tipoEtiqueta: TipoEtiqueta
  gerando: boolean
  erro: string | null
  onAlterarCampo: (campo: keyof CamposEtiqueta, valor: string) => void
  onAlterarTipoEtiqueta: (tipo: TipoEtiqueta) => void
  onVoltar: () => void
  onConfirmar: () => void
}

export function ConferenciaCard({
  campos,
  fonteEndereco,
  layout,
  tipoEtiqueta,
  gerando,
  erro,
  onAlterarCampo,
  onAlterarTipoEtiqueta,
  onVoltar,
  onConfirmar,
}: ConferenciaCardProps) {
  const camposPreenchidos = Object.values(campos).some((valor) => valor.trim().length > 0)

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <div className={styles.introTexto}>
          <h2>Confira os dados antes de gerar</h2>
          <p>Os campos abaixo foram extraídos automaticamente. Ajuste o que for preciso — a prévia atualiza na hora.</p>
        </div>
        <TipoEtiquetaToggle valor={tipoEtiqueta} onAlterar={onAlterarTipoEtiqueta} />
      </div>

      <div className={styles.grid}>
        <CamposForm campos={campos} fonteEndereco={fonteEndereco} onAlterarCampo={onAlterarCampo} />
        <div className={styles.previewCol}>
          <EtiquetaPreview layout={layout} campos={campos} />
        </div>
      </div>

      {erro && (
        <div className={styles.bannerWrap}>
          <Banner tone="error">{erro}</Banner>
        </div>
      )}

      <div className={styles.acoes}>
        <Button variant="ghost" icon={<ArrowLeftIcon width={17} height={17} />} onClick={onVoltar} disabled={gerando}>
          Voltar
        </Button>
        <Button
          variant="accent"
          icon={<SparkleIcon width={17} height={17} />}
          loading={gerando}
          disabled={!camposPreenchidos}
          onClick={onConfirmar}
        >
          {gerando ? 'Gerando etiqueta…' : 'Confirmar e gerar etiqueta'}
        </Button>
      </div>
    </div>
  )
}
