import styles from './ComoFunciona.module.css'
import { PrinterIcon, SparkleIcon, TruckIcon, UploadCloudIcon } from './icons'

const PASSOS = [
  {
    Icone: UploadCloudIcon,
    titulo: 'Envie o orçamento',
    texto: 'Arraste o PDF gerado pelo sistema interno — é o único arquivo que você precisa ter em mãos.',
  },
  {
    Icone: SparkleIcon,
    titulo: 'Conferimos pra você',
    texto: 'Destinatário, endereço, bairro, cidade e CEP saem extraídos automaticamente. Só ajustar se precisar.',
  },
  {
    Icone: PrinterIcon,
    titulo: 'Gere e imprima',
    texto: 'A etiqueta sai pronta no layout oficial BWR, no tamanho certo pra imprimir e colar direto na caixa.',
  },
]

export function ComoFunciona() {
  return (
    <div className={styles.painel}>
      <h2 className={styles.titulo}>
        <TruckIcon width={16} height={16} />
        Como funciona
      </h2>
      <div className={styles.passos}>
        {PASSOS.map((passo, indice) => (
          <div key={passo.titulo} className={styles.passo}>
            <span className={styles.numero}>
              <passo.Icone width={17} height={17} />
            </span>
            <div className={styles.texto}>
              <h3>
                {indice + 1}. {passo.titulo}
              </h3>
              <p>{passo.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
