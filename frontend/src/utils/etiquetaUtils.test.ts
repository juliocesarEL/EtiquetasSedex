import { describe, expect, it } from 'vitest'
import { gerarId, nomeParaArquivo } from './etiquetaUtils'

describe('nomeParaArquivo', () => {
  it('monta o nome incluindo o tipo e um slug do destinatário', () => {
    expect(nomeParaArquivo('João da Silva Ltda', 'sedex')).toBe('etiqueta-sedex-joao-da-silva-ltda.png')
  })

  it('remove acentos e caracteres especiais do slug', () => {
    expect(nomeParaArquivo('Empresa Baiana de Águas & Saneamento S/A', 'pac')).toBe(
      'etiqueta-pac-empresa-baiana-de-aguas-saneamento-s-a.png',
    )
  })

  it('não deixa hífen sobrando no início/fim do slug', () => {
    expect(nomeParaArquivo('  -Nome Estranho-  ', 'sedex')).toBe('etiqueta-sedex-nome-estranho.png')
  })

  it('cai para um nome genérico quando o destinatário está vazio', () => {
    expect(nomeParaArquivo('', 'sedex')).toBe('etiqueta-sedex.png')
  })
})

describe('gerarId', () => {
  it('gera valores diferentes a cada chamada', () => {
    const ids = new Set(Array.from({ length: 50 }, () => gerarId()))
    expect(ids.size).toBe(50)
  })

  it('retorna uma string não vazia', () => {
    expect(gerarId().length).toBeGreaterThan(0)
  })
})
