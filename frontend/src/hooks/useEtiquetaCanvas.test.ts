import { describe, expect, it } from 'vitest'
import { ajustarTextoAoCampo } from './useEtiquetaCanvas'

/** Simula um CanvasRenderingContext2D real o suficiente pro algoritmo:
 * a largura medida depende do tamanho de fonte atualmente setado em
 * `ctx.font`, igual ao canvas de verdade faria. */
function criarContextoFalso(pxPorCaractere = 0.6): CanvasRenderingContext2D {
  const ctx = {
    font: '',
    measureText(texto: string) {
      const tamanhoFonte = Number(/(\d+)px/.exec(ctx.font)?.[1] ?? 26)
      return { width: texto.length * tamanhoFonte * pxPorCaractere } as TextMetrics
    },
  }
  return ctx as unknown as CanvasRenderingContext2D
}

describe('ajustarTextoAoCampo', () => {
  it('mantém o texto e o tamanho máximo quando já cabe na largura', () => {
    const ctx = criarContextoFalso()

    const resultado = ajustarTextoAoCampo(ctx, 'ABC', 100, 26)

    expect(resultado).toEqual({ texto: 'ABC', tamanhoFonte: 26 })
  })

  it('reduz a fonte até caber, sem truncar o texto', () => {
    const ctx = criarContextoFalso()

    const resultado = ajustarTextoAoCampo(ctx, 'UM TEXTO MEDIO AQUI', 200, 26)

    expect(resultado.texto).toBe('UM TEXTO MEDIO AQUI')
    expect(resultado.tamanhoFonte).toBeLessThan(26)
    expect(resultado.tamanhoFonte).toBeGreaterThan(14)
  })

  it('trunca com reticências quando nem o tamanho mínimo cabe', () => {
    const ctx = criarContextoFalso()
    const textoBemLongo = 'ESTE TEXTO É MUITO MAIOR DO QUE O CAMPO CONSEGUE MOSTRAR'

    const resultado = ajustarTextoAoCampo(ctx, textoBemLongo, 50, 26)

    expect(resultado.tamanhoFonte).toBe(14)
    expect(resultado.texto.endsWith('…')).toBe(true)
    expect(resultado.texto.length).toBeLessThan(textoBemLongo.length)
  })

  it('não quebra com texto vazio', () => {
    const ctx = criarContextoFalso()

    const resultado = ajustarTextoAoCampo(ctx, '', 100, 26)

    expect(resultado.texto).toBe('')
  })
})
