import { useEffect, useRef } from 'react'
import type { CamposEtiqueta, LayoutEtiqueta } from '../types'

const TAMANHO_FONTE_MINIMO = 14
const REENTICENCIAS = '…'

export function ajustarTextoAoCampo(
  ctx: CanvasRenderingContext2D,
  texto: string,
  largura: number,
  tamanhoMax: number,
): { texto: string; tamanhoFonte: number } {
  for (let tamanho = tamanhoMax; tamanho > TAMANHO_FONTE_MINIMO; tamanho--) {
    ctx.font = `700 ${tamanho}px Arial, sans-serif`
    if (ctx.measureText(texto).width <= largura) {
      return { texto, tamanhoFonte: tamanho }
    }
  }

  ctx.font = `700 ${TAMANHO_FONTE_MINIMO}px Arial, sans-serif`
  let truncado = texto
  while (truncado.length > 0 && ctx.measureText(truncado + REENTICENCIAS).width > largura) {
    truncado = truncado.slice(0, -1)
  }
  return { texto: truncado ? truncado + REENTICENCIAS : '', tamanhoFonte: TAMANHO_FONTE_MINIMO }
}

/** Desenha o template + os campos da etiqueta em um <canvas>, replicando no
 * cliente a mesma lógica de ajuste de fonte usada no backend (Pillow), para
 * que a prévia reflita fielmente o resultado final gerado pelo servidor. */
export function useEtiquetaCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  layout: LayoutEtiqueta | null,
  campos: CamposEtiqueta,
) {
  const imagemRef = useRef<HTMLImageElement | null>(null)
  const imagemProntaRef = useRef(false)

  useEffect(() => {
    if (!layout) return

    const imagem = new Image()
    imagem.src = layout.templateUrl
    imagemProntaRef.current = false
    imagem.onload = () => {
      imagemProntaRef.current = true
      imagemRef.current = imagem
      desenhar()
    }
    imagemRef.current = imagem

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout?.templateUrl])

  function desenhar() {
    const canvas = canvasRef.current
    const imagem = imagemRef.current
    if (!canvas || !imagem || !layout || !imagemProntaRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = layout.largura
    canvas.height = layout.altura

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imagem, 0, 0, layout.largura, layout.altura)

    ctx.fillStyle = layout.corTexto
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'

    const valores: Record<keyof CamposEtiqueta, string> = campos

    ;(Object.keys(layout.campos) as (keyof CamposEtiqueta)[]).forEach((chave) => {
      const texto = valores[chave]?.trim()
      if (!texto) return

      const campo = layout.campos[chave]
      const { texto: textoAjustado, tamanhoFonte } = ajustarTextoAoCampo(
        ctx,
        texto,
        campo.largura,
        campo.tamanhoFonteMax,
      )
      ctx.font = `700 ${tamanhoFonte}px Arial, sans-serif`
      ctx.fillText(textoAjustado, campo.x, campo.yCentro)
    })
  }

  useEffect(() => {
    desenhar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, campos])
}
