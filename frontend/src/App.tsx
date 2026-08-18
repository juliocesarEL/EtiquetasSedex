import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { TruckIcon } from './components/icons'
import { StepIndicator } from './components/StepIndicator'
import type { Etapa } from './components/StepIndicator'
import { UploadCard } from './components/UploadCard'
import { ConferenciaCard } from './components/ConferenciaCard'
import { ResultCard } from './components/ResultCard'
import { FilaImpressao } from './components/FilaImpressao'
import { ComoFunciona } from './components/ComoFunciona'
import { Banner } from './components/ui/Banner'
import { ApiError, gerarEtiqueta, obterLayoutEtiqueta, processarOrcamento } from './api/client'
import { imprimirFolhaComEtiquetas } from './utils/imprimir'
import type { CamposEtiqueta, FonteEndereco, ItemFilaImpressao, LayoutEtiqueta, TipoEtiqueta } from './types'

const CAMPOS_VAZIOS: CamposEtiqueta = {
  destinatario: '',
  endereco: '',
  bairro: '',
  cidade: '',
  cep: '',
  observacoes: '',
}

const LIMITE_FILA = 4
const TIPOS_ETIQUETA: TipoEtiqueta[] = ['sedex', 'pac']

function mensagemDeErro(erro: unknown, padrao: string): string {
  return erro instanceof ApiError ? erro.message : padrao
}

const PADRAO_MARCAS_DIACRITICAS = /[̀-ͯ]/g

function nomeParaArquivo(destinatario: string, tipo: TipoEtiqueta): string {
  const slug = destinatario
    .normalize('NFD')
    .replace(PADRAO_MARCAS_DIACRITICAS, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase()
  return `etiqueta-${tipo}${slug ? `-${slug}` : ''}.png`
}

function App() {
  const [etapa, setEtapa] = useState<Etapa>('upload')
  const [layouts, setLayouts] = useState<Partial<Record<TipoEtiqueta, LayoutEtiqueta>>>({})
  const [erroLayout, setErroLayout] = useState<string | null>(null)
  const [tipoEtiqueta, setTipoEtiqueta] = useState<TipoEtiqueta>('sedex')

  const [processando, setProcessando] = useState(false)
  const [erroUpload, setErroUpload] = useState<string | null>(null)

  const [campos, setCampos] = useState<CamposEtiqueta>(CAMPOS_VAZIOS)
  const [fonteEndereco, setFonteEndereco] = useState<FonteEndereco>(null)

  const [gerando, setGerando] = useState(false)
  const [erroGeracao, setErroGeracao] = useState<string | null>(null)
  const [imagemFinalUrl, setImagemFinalUrl] = useState<string | null>(null)

  const [filaImpressao, setFilaImpressao] = useState<ItemFilaImpressao[]>([])

  useEffect(() => {
    Promise.all(TIPOS_ETIQUETA.map((tipo) => obterLayoutEtiqueta(tipo).then((layout) => [tipo, layout] as const)))
      .then((resultados) => setLayouts(Object.fromEntries(resultados)))
      .catch((erro) => setErroLayout(mensagemDeErro(erro, 'Não foi possível carregar o layout da etiqueta.')))
  }, [])

  // Um resultado gerado pode ter sido "movido" para a folha de impressão —
  // nesse caso a URL passa a pertencer à fila e não deve ser revogada aqui.
  function urlPertenceAFila(url: string | null): boolean {
    return url !== null && filaImpressao.some((item) => item.url === url)
  }

  async function handleProcessar(arquivo: File) {
    setProcessando(true)
    setErroUpload(null)
    try {
      const resultado = await processarOrcamento(arquivo)
      setCampos({
        destinatario: resultado.destinatario,
        endereco: resultado.endereco,
        bairro: resultado.bairro,
        cidade: resultado.cidade,
        cep: resultado.cep,
        observacoes: resultado.observacoes,
      })
      setFonteEndereco(resultado.fonteEndereco)
      setEtapa('conferencia')
    } catch (erro) {
      setErroUpload(mensagemDeErro(erro, 'Não foi possível processar o orçamento. Tente novamente.'))
    } finally {
      setProcessando(false)
    }
  }

  function handleAlterarCampo(campo: keyof CamposEtiqueta, valor: string) {
    setCampos((atual) => ({ ...atual, [campo]: valor }))
  }

  function handleVoltar() {
    setEtapa('upload')
    setErroGeracao(null)
    setCampos(CAMPOS_VAZIOS)
    setFonteEndereco(null)
  }

  async function handleConfirmar() {
    setGerando(true)
    setErroGeracao(null)
    try {
      const blob = await gerarEtiqueta(campos, tipoEtiqueta)
      if (imagemFinalUrl && !urlPertenceAFila(imagemFinalUrl)) URL.revokeObjectURL(imagemFinalUrl)
      setImagemFinalUrl(URL.createObjectURL(blob))
      setEtapa('pronta')
    } catch (erro) {
      setErroGeracao(mensagemDeErro(erro, 'Não foi possível gerar a etiqueta. Tente novamente.'))
    } finally {
      setGerando(false)
    }
  }

  function handleNovaEtiqueta() {
    if (imagemFinalUrl && !urlPertenceAFila(imagemFinalUrl)) URL.revokeObjectURL(imagemFinalUrl)
    setImagemFinalUrl(null)
    setCampos(CAMPOS_VAZIOS)
    setFonteEndereco(null)
    setErroUpload(null)
    setErroGeracao(null)
    setEtapa('upload')
  }

  function handleAdicionarAFila() {
    if (!imagemFinalUrl || filaImpressao.length >= LIMITE_FILA) return
    const novoItem: ItemFilaImpressao = {
      id: crypto.randomUUID(),
      url: imagemFinalUrl,
      nomeArquivo: nomeParaArquivo(campos.destinatario, tipoEtiqueta),
      destinatario: campos.destinatario,
    }
    setFilaImpressao((atual) => [...atual, novoItem])
  }

  function handleRemoverDaFila(id: string) {
    setFilaImpressao((atual) => {
      const item = atual.find((i) => i.id === id)
      if (item && item.url !== imagemFinalUrl) URL.revokeObjectURL(item.url)
      return atual.filter((i) => i.id !== id)
    })
  }

  function handleLimparFila() {
    filaImpressao.forEach((item) => {
      if (item.url !== imagemFinalUrl) URL.revokeObjectURL(item.url)
    })
    setFilaImpressao([])
  }

  function handleImprimirFolha() {
    imprimirFolhaComEtiquetas(filaImpressao.map((item) => item.url))
  }

  const itemAtualNaFila = filaImpressao.find((item) => item.url === imagemFinalUrl)

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <TruckIcon width={340} height={340} className={styles.marcaDagua} />

        <div className={styles.camadaConteudo}>
          <div className={styles.colunaLateral}>
            <ComoFunciona />
          </div>

          <div className={styles.areaTopo}>
            {etapa === 'upload' && (
              <div className={styles.hero}>
                <h1>Etiquetas de envio, prontas em segundos</h1>
                <p>
                  Suba o PDF do orçamento e deixe o resto com a gente — extração automática dos dados, layout
                  oficial BWR, pronta pra imprimir e colar.
                </p>
              </div>
            )}

            <StepIndicator etapaAtual={etapa} />

            {erroLayout && (
              <div className={styles.avisoLayout}>
                <Banner tone="error">{erroLayout}</Banner>
              </div>
            )}
          </div>

          <div className={styles.colunaPrincipal}>
            <FilaImpressao
              itens={filaImpressao}
              onRemover={handleRemoverDaFila}
              onLimpar={handleLimparFila}
              onImprimir={handleImprimirFolha}
            />

            <div className={styles.conteudo}>
              {etapa === 'upload' && (
                <UploadCard processando={processando} erro={erroUpload} onProcessar={handleProcessar} />
              )}

              {etapa === 'conferencia' && (
                <ConferenciaCard
                  campos={campos}
                  fonteEndereco={fonteEndereco}
                  layout={layouts[tipoEtiqueta] ?? null}
                  tipoEtiqueta={tipoEtiqueta}
                  gerando={gerando}
                  erro={erroGeracao}
                  onAlterarCampo={handleAlterarCampo}
                  onAlterarTipoEtiqueta={setTipoEtiqueta}
                  onVoltar={handleVoltar}
                  onConfirmar={handleConfirmar}
                />
              )}

              {etapa === 'pronta' && imagemFinalUrl && (
                <ResultCard
                  imagemUrl={imagemFinalUrl}
                  nomeArquivo={nomeParaArquivo(campos.destinatario, tipoEtiqueta)}
                  naFila={Boolean(itemAtualNaFila)}
                  filaCheia={filaImpressao.length >= LIMITE_FILA}
                  onNovaEtiqueta={handleNovaEtiqueta}
                  onAdicionarAFila={handleAdicionarAFila}
                  onRemoverDaFila={() => itemAtualNaFila && handleRemoverDaFila(itemAtualNaFila.id)}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
