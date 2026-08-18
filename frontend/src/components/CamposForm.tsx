import styles from './CamposForm.module.css'
import { FonteEnderecoBadge } from './ui/FonteEnderecoBadge'
import type { CamposEtiqueta, FonteEndereco } from '../types'

interface CamposFormProps {
  campos: CamposEtiqueta
  fonteEndereco: FonteEndereco
  onAlterarCampo: (campo: keyof CamposEtiqueta, valor: string) => void
}

export function CamposForm({ campos, fonteEndereco, onAlterarCampo }: CamposFormProps) {
  return (
    <form className={styles.form} onSubmit={(evento) => evento.preventDefault()}>
      <div className={styles.campo}>
        <span className={styles.rotulo}>Destinatário</span>
        <input
          className={styles.input}
          value={campos.destinatario}
          maxLength={200}
          placeholder="Nome do cliente"
          onChange={(evento) => onAlterarCampo('destinatario', evento.target.value)}
        />
      </div>

      <div className={styles.campo}>
        <div className={styles.linhaRotulo}>
          <span className={styles.rotulo}>Endereço</span>
          <FonteEnderecoBadge fonte={fonteEndereco} />
        </div>
        <input
          className={styles.input}
          value={campos.endereco}
          maxLength={200}
          placeholder="Rua, número"
          onChange={(evento) => onAlterarCampo('endereco', evento.target.value)}
        />
      </div>

      <div className={styles.linha}>
        <div className={styles.campo}>
          <span className={styles.rotulo}>Bairro</span>
          <input
            className={styles.input}
            value={campos.bairro}
            maxLength={200}
            placeholder="Bairro"
            onChange={(evento) => onAlterarCampo('bairro', evento.target.value)}
          />
        </div>
        <div className={styles.campo}>
          <span className={styles.rotulo}>CEP</span>
          <input
            className={styles.input}
            value={campos.cep}
            maxLength={20}
            placeholder="00000-000"
            onChange={(evento) => onAlterarCampo('cep', evento.target.value)}
          />
        </div>
      </div>

      <div className={styles.campo}>
        <span className={styles.rotulo}>Cidade</span>
        <input
          className={styles.input}
          value={campos.cidade}
          maxLength={200}
          placeholder="Cidade/UF"
          onChange={(evento) => onAlterarCampo('cidade', evento.target.value)}
        />
      </div>

      <div className={styles.campo}>
        <span className={styles.rotulo}>Observações</span>
        <input
          className={styles.input}
          value={campos.observacoes}
          maxLength={200}
          placeholder="Frágil, entregar pela manhã, etc. (opcional)"
          onChange={(evento) => onAlterarCampo('observacoes', evento.target.value)}
        />
      </div>
    </form>
  )
}
