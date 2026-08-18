import type { CamposEtiqueta, CamposEtiquetaExtraidos, LayoutEtiqueta, TipoEtiqueta } from '../types'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function extrairMensagemDeErro(resposta: Response): Promise<string> {
  try {
    const corpo = await resposta.json()
    if (corpo && typeof corpo.erro === 'string') return corpo.erro
  } catch {
    // resposta sem corpo JSON legível — mantém a mensagem genérica
  }
  return resposta.status === 429
    ? 'Muitas requisições em pouco tempo. Aguarde um instante e tente novamente.'
    : 'Ocorreu um erro ao comunicar com o servidor.'
}

async function tratarResposta<T>(resposta: Response): Promise<T> {
  if (!resposta.ok) {
    throw new ApiError(await extrairMensagemDeErro(resposta), resposta.status)
  }
  return resposta.json() as Promise<T>
}

interface CamposEtiquetaApi {
  destinatario: string
  endereco: string
  bairro: string
  cidade: string
  cep: string
  fonte_endereco: 'observacao' | 'topo' | null
}

export async function processarOrcamento(arquivo: File): Promise<CamposEtiquetaExtraidos> {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  const resposta = await fetch('/api/orcamentos/processar', { method: 'POST', body: formData })
  const dados = await tratarResposta<CamposEtiquetaApi>(resposta)

  return {
    destinatario: dados.destinatario,
    endereco: dados.endereco,
    bairro: dados.bairro,
    cidade: dados.cidade,
    cep: dados.cep,
    observacoes: '',
    fonteEndereco: dados.fonte_endereco,
  }
}

export async function obterLayoutEtiqueta(tipo: TipoEtiqueta): Promise<LayoutEtiqueta> {
  const resposta = await fetch(`/api/etiquetas/layout?tipo=${tipo}`)
  return tratarResposta<LayoutEtiqueta>(resposta)
}

export async function gerarEtiqueta(campos: CamposEtiqueta, tipo: TipoEtiqueta): Promise<Blob> {
  const resposta = await fetch('/api/etiquetas/gerar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...campos, tipo }),
  })

  if (!resposta.ok) {
    throw new ApiError(await extrairMensagemDeErro(resposta), resposta.status)
  }
  return resposta.blob()
}
