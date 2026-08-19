import type { TipoEtiqueta } from '../types'

const PADRAO_MARCAS_DIACRITICAS = /[̀-ͯ]/g

// crypto.randomUUID() só existe em contexto seguro (HTTPS ou localhost) —
// no servidor interno o acesso é por IP em HTTP puro, então não dá pra
// contar com ele. Aqui não precisa ser criptograficamente forte, só único
// o bastante pra servir de chave de lista.
export function gerarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function nomeParaArquivo(destinatario: string, tipo: TipoEtiqueta): string {
  const slug = destinatario
    .normalize('NFD')
    .replace(PADRAO_MARCAS_DIACRITICAS, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase()
  return `etiqueta-${tipo}${slug ? `-${slug}` : ''}.png`
}
