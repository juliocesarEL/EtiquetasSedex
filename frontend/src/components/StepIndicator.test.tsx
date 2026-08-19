import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StepIndicator } from './StepIndicator'

describe('StepIndicator', () => {
  it('mostra os três passos do fluxo', () => {
    render(<StepIndicator etapaAtual="upload" />)

    expect(screen.getByText('Enviar orçamento')).toBeInTheDocument()
    expect(screen.getByText('Conferir dados')).toBeInTheDocument()
    expect(screen.getByText('Etiqueta pronta')).toBeInTheDocument()
  })

  it('mostra o número do passo enquanto ele não foi concluído', () => {
    render(<StepIndicator etapaAtual="upload" />)

    // no primeiro passo, nenhum concluído ainda — todos mostram número
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('troca o número pelo ícone de check nos passos já concluídos', () => {
    const { container } = render(<StepIndicator etapaAtual="pronta" />)

    // com etapaAtual="pronta", os passos 1 e 2 já foram concluídos —
    // seus números viram ícone, só sobra o "3" do passo atual como texto
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('2')).not.toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2)
  })
})
