// Mesma largura/altura física usada na etiqueta original em Word (11,55 x
// 7,70cm, medidas a partir do arquivo .docx original) — sem isso, o
// navegador estica a imagem para ocupar a folha inteira na impressão.
const LARGURA_ETIQUETA_CM = 11.55
const ALTURA_ETIQUETA_CM = 7.7
const MARGEM_PAGINA_CM = 0.5
const ESPACO_ENTRE_ETIQUETAS_CM = 0.3

// Reserva de segurança: navegadores costumam imprimir cabeçalho/rodapé
// (data, título, URL) por padrão, o que consome espaço além da margem
// pedida aqui — sem essa reserva, 4 etiquetas podem estourar para uma
// segunda página. O ideal é o usuário também desativar "Cabeçalhos e
// rodapés" nas opções de impressão do navegador.
const RESERVA_SEGURANCA_CM = 2.5
const ALTURA_UTIL_A4_CM = 29.7 - MARGEM_PAGINA_CM * 2 - RESERVA_SEGURANCA_CM

function abrirJanelaDeImpressao(corpoHtml: string, estiloExtra: string) {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const documento = iframe.contentWindow?.document
  if (!documento) {
    document.body.removeChild(iframe)
    return
  }

  documento.open()
  documento.write(
    `<!doctype html><html><head><title>Etiqueta SEDEX</title><style>
      html,body{margin:0;padding:0;}
      @page{size:auto;margin:${MARGEM_PAGINA_CM}cm;}
      ${estiloExtra}
    </style></head><body>${corpoHtml}</body></html>`,
  )
  documento.close()

  const imprimirQuandoPronto = () => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
  }

  const imagens = Array.from(documento.images)
  if (imagens.length === 0) {
    imprimirQuandoPronto()
  } else {
    let carregadas = 0
    imagens.forEach((img) => {
      const marcarCarregada = () => {
        carregadas += 1
        if (carregadas === imagens.length) imprimirQuandoPronto()
      }
      if (img.complete) marcarCarregada()
      else img.addEventListener('load', marcarCarregada)
    })
  }

  iframe.contentWindow?.addEventListener('afterprint', () => {
    document.body.removeChild(iframe)
  })
}

export function imprimirEtiquetaUnica(url: string) {
  abrirJanelaDeImpressao(
    `<img src="${url}">`,
    `img{width:${LARGURA_ETIQUETA_CM}cm;display:block;}`,
  )
}

/** Imprime de 1 a 4 etiquetas empilhadas em uma única folha A4, com uma
 * linha tracejada entre elas para facilitar o corte. Até 3 etiquetas saem
 * no tamanho normal; com 4, o tamanho reduz levemente para caber na folha. */
export function imprimirFolhaComEtiquetas(urls: string[]) {
  const total = urls.length
  if (total === 0) return

  const gapsTotalCm = (total - 1) * ESPACO_ENTRE_ETIQUETAS_CM
  const alturaPorEtiquetaCm = Math.min(ALTURA_ETIQUETA_CM, (ALTURA_UTIL_A4_CM - gapsTotalCm) / total)
  const larguraPorEtiquetaCm = alturaPorEtiquetaCm * (LARGURA_ETIQUETA_CM / ALTURA_ETIQUETA_CM)

  const corpo = urls
    .map((url, indice) => {
      const temLinhaDeCorte = indice < total - 1
      const estiloLinha =
        'page-break-inside:avoid;' +
        (temLinhaDeCorte
          ? `border-bottom:1px dashed #999;padding-bottom:${ESPACO_ENTRE_ETIQUETAS_CM / 2}cm;margin-bottom:${ESPACO_ENTRE_ETIQUETAS_CM / 2}cm;`
          : '')
      return `<div style="${estiloLinha}"><img src="${url}" style="width:${larguraPorEtiquetaCm}cm;display:block;"></div>`
    })
    .join('')

  abrirJanelaDeImpressao(corpo, '')
}
