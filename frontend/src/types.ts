export interface CamposEtiqueta {
  destinatario: string
  endereco: string
  bairro: string
  cidade: string
  cep: string
  observacoes: string
}

export type FonteEndereco = 'observacao' | 'topo' | null

export type TipoEtiqueta = 'sedex' | 'pac'

export interface CamposEtiquetaExtraidos extends CamposEtiqueta {
  fonteEndereco: FonteEndereco
}

export interface CampoLayout {
  x: number
  y: number
  largura: number
  altura: number
  yCentro: number
  tamanhoFonteMax: number
}

export interface LayoutEtiqueta {
  largura: number
  altura: number
  templateUrl: string
  corTexto: string
  campos: Record<keyof CamposEtiqueta, CampoLayout>
}

export interface ItemFilaImpressao {
  id: string
  url: string
  nomeArquivo: string
  destinatario: string
}
