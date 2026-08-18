import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'
import { Button } from './ui/Button'
import { AlertTriangleIcon, RefreshIcon } from './icons'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  comErro: boolean
  detalhe: string | null
}

/** Evita que uma falha inesperada em qualquer tela deixe a página
 * inteiramente em branco: mostra uma mensagem recuperável em vez de
 * quebrar o app sem explicação (ex.: backend fora do ar no momento). */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { comErro: false, detalhe: null }

  static getDerivedStateFromError(erro: Error): ErrorBoundaryState {
    return { comErro: true, detalhe: `${erro.name}: ${erro.message}` }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('Erro inesperado na aplicação:', erro, info.componentStack)
  }

  render() {
    if (!this.state.comErro) return this.props.children

    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.icone}>
            <AlertTriangleIcon width={24} height={24} />
          </div>
          <h2>Algo deu errado</h2>
          <p>
            Não foi possível continuar nesta tela. Isso costuma acontecer quando o servidor foi reiniciado
            enquanto a página estava aberta — recarregue e tente de novo.
          </p>
          {this.state.detalhe && <pre className={styles.detalhe}>{this.state.detalhe}</pre>}
          <Button variant="primary" icon={<RefreshIcon width={17} height={17} />} onClick={() => window.location.reload()}>
            Recarregar página
          </Button>
        </div>
      </div>
    )
  }
}
