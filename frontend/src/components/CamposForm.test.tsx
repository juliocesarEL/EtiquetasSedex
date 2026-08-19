import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CamposForm } from './CamposForm'
import type { CamposEtiqueta } from '../types'

const CAMPOS_VAZIOS: CamposEtiqueta = {
  destinatario: '',
  endereco: '',
  bairro: '',
  cidade: '',
  cep: '',
  observacoes: '',
}

describe('CamposForm', () => {
  it('mostra os valores atuais em cada campo', () => {
    const campos: CamposEtiqueta = {
      ...CAMPOS_VAZIOS,
      destinatario: 'JOAO DA SILVA',
      cep: '01000-000',
    }

    render(<CamposForm campos={campos} fonteEndereco={null} onAlterarCampo={vi.fn()} />)

    expect(screen.getByPlaceholderText('Nome do cliente')).toHaveValue('JOAO DA SILVA')
    expect(screen.getByPlaceholderText('00000-000')).toHaveValue('01000-000')
  })

  it('chama onAlterarCampo com o campo certo ao digitar', async () => {
    const usuario = userEvent.setup()
    const onAlterarCampo = vi.fn()

    render(<CamposForm campos={CAMPOS_VAZIOS} fonteEndereco={null} onAlterarCampo={onAlterarCampo} />)

    await usuario.type(screen.getByPlaceholderText('Bairro'), 'Centro')

    // input controlado sem estado no teste: cada tecla dispara um onChange
    // isolado (o valor exibido não "acumula" sozinho) — confere que cada
    // chamada foi pro campo certo e que, juntas, reconstroem o texto digitado
    expect(onAlterarCampo.mock.calls.every(([campo]) => campo === 'bairro')).toBe(true)
    expect(onAlterarCampo.mock.calls.map(([, valor]) => valor).join('')).toBe('Centro')
  })

  it('mostra o selo de origem do endereço quando veio da observação', () => {
    render(<CamposForm campos={CAMPOS_VAZIOS} fonteEndereco="observacao" onAlterarCampo={vi.fn()} />)

    expect(screen.getByText('Endereço da observação')).toBeInTheDocument()
  })

  it('não mostra selo de origem quando não há endereço extraído', () => {
    render(<CamposForm campos={CAMPOS_VAZIOS} fonteEndereco={null} onAlterarCampo={vi.fn()} />)

    expect(screen.queryByText('Endereço da observação')).not.toBeInTheDocument()
    expect(screen.queryByText('Endereço padrão do orçamento')).not.toBeInTheDocument()
  })
})
