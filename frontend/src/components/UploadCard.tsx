import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import styles from './UploadCard.module.css'
import { Button } from './ui/Button'
import { Banner } from './ui/Banner'
import { FileTextIcon, UploadCloudIcon } from './icons'

const TAMANHO_MAXIMO_MB = 10
const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024

interface UploadCardProps {
  processando: boolean
  erro: string | null
  onProcessar: (arquivo: File) => void
}

export function UploadCard({ processando, erro, onProcessar }: UploadCardProps) {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [arrastando, setArrastando] = useState(false)
  const [erroValidacao, setErroValidacao] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function validarESelecionar(candidato: File | undefined) {
    if (!candidato) return

    if (candidato.type !== 'application/pdf') {
      setErroValidacao('Envie um arquivo no formato PDF.')
      setArquivo(null)
      return
    }
    if (candidato.size > TAMANHO_MAXIMO_BYTES) {
      setErroValidacao(`O arquivo excede o limite de ${TAMANHO_MAXIMO_MB}MB.`)
      setArquivo(null)
      return
    }

    setErroValidacao(null)
    setArquivo(candidato)
  }

  function aoSoltarArquivo(evento: DragEvent<HTMLDivElement>) {
    evento.preventDefault()
    setArrastando(false)
    validarESelecionar(evento.dataTransfer.files[0])
  }

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <h2>Envie o orçamento em PDF</h2>
        <p>Vamos extrair automaticamente o destinatário e o endereço de entrega para montar a etiqueta.</p>
      </div>

      <div
        className={`${styles.dropzone} ${arrastando ? styles.ativo : ''}`}
        onDragOver={(evento) => {
          evento.preventDefault()
          setArrastando(true)
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={aoSoltarArquivo}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(evento) => {
          if (evento.key === 'Enter' || evento.key === ' ') inputRef.current?.click()
        }}
      >
        <input
          ref={inputRef}
          className={styles.input}
          type="file"
          accept="application/pdf"
          onChange={(evento) => validarESelecionar(evento.target.files?.[0])}
          aria-label="Selecionar arquivo PDF do orçamento"
        />
        <div className={styles.iconeWrap}>
          <UploadCloudIcon width={26} height={26} />
        </div>
        <p className={styles.instrucao}>Arraste o PDF aqui ou clique para escolher</p>
        <p className={styles.detalhe}>Apenas PDF · até {TAMANHO_MAXIMO_MB}MB</p>
      </div>

      {arquivo && (
        <div className={styles.acoes}>
          <div className={styles.arquivoSelecionado}>
            <FileTextIcon width={20} height={20} />
            <span className={styles.nomeArquivo}>{arquivo.name}</span>
          </div>
        </div>
      )}

      {(erroValidacao || erro) && (
        <div className={styles.bannerWrap}>
          <Banner tone="error">{erroValidacao ?? erro}</Banner>
        </div>
      )}

      <div className={styles.acoes}>
        <Button
          variant="primary"
          fullWidth
          disabled={!arquivo}
          loading={processando}
          onClick={() => arquivo && onProcessar(arquivo)}
        >
          {processando ? 'Extraindo dados do orçamento…' : 'Processar orçamento'}
        </Button>
      </div>
    </div>
  )
}
