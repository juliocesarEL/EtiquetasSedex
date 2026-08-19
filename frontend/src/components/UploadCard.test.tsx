import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UploadCard } from './UploadCard'

function selecionarInput() {
  return screen.getByLabelText('Selecionar arquivo PDF do orçamento')
}

/** userEvent.upload() simula o seletor de arquivos do navegador, que já
 * filtra pelo `accept="application/pdf"` do input — não chega a exercitar
 * a validação do próprio componente. fireEvent dispara o evento de troca
 * direto, do jeito que também aconteceria soltando o arquivo via
 * arrastar-e-soltar (que ignora o atributo accept). */
function selecionarArquivoIgnorandoAccept(input: HTMLElement, arquivo: File) {
  Object.defineProperty(input, 'files', { value: [arquivo], configurable: true })
  fireEvent.change(input)
}

describe('UploadCard', () => {
  it('aceita um PDF válido e habilita o botão de processar', async () => {
    const usuario = userEvent.setup()
    const arquivo = new File(['%PDF-1.4 conteudo'], 'orcamento.pdf', { type: 'application/pdf' })

    render(<UploadCard processando={false} erro={null} onProcessar={vi.fn()} />)
    await usuario.upload(selecionarInput(), arquivo)

    expect(screen.getByText('orcamento.pdf')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Processar orçamento/i })).toBeEnabled()
  })

  it('rejeita arquivo que não é PDF, com mensagem clara', () => {
    const arquivo = new File(['conteudo'], 'orcamento.txt', { type: 'text/plain' })

    render(<UploadCard processando={false} erro={null} onProcessar={vi.fn()} />)
    selecionarArquivoIgnorandoAccept(selecionarInput(), arquivo)

    expect(screen.getByText('Envie um arquivo no formato PDF.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Processar orçamento/i })).toBeDisabled()
  })

  it('rejeita PDF maior que o limite de 10MB', () => {
    const conteudoGrande = new Uint8Array(11 * 1024 * 1024)
    const arquivo = new File([conteudoGrande], 'orcamento-grande.pdf', { type: 'application/pdf' })

    render(<UploadCard processando={false} erro={null} onProcessar={vi.fn()} />)
    selecionarArquivoIgnorandoAccept(selecionarInput(), arquivo)

    expect(screen.getByText('O arquivo excede o limite de 10MB.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Processar orçamento/i })).toBeDisabled()
  })

  it('chama onProcessar com o arquivo ao clicar em processar', async () => {
    const usuario = userEvent.setup()
    const onProcessar = vi.fn()
    const arquivo = new File(['%PDF-1.4'], 'orcamento.pdf', { type: 'application/pdf' })

    render(<UploadCard processando={false} erro={null} onProcessar={onProcessar} />)
    await usuario.upload(selecionarInput(), arquivo)
    await usuario.click(screen.getByRole('button', { name: /Processar orçamento/i }))

    expect(onProcessar).toHaveBeenCalledWith(arquivo)
  })

  it('mostra o texto de carregamento enquanto processando=true', () => {
    render(<UploadCard processando erro={null} onProcessar={vi.fn()} />)

    expect(screen.getByText('Extraindo dados do orçamento…')).toBeInTheDocument()
  })

  it('mostra erro vindo do servidor quando não há erro de validação local', () => {
    render(<UploadCard processando={false} erro="Não foi possível processar o orçamento." onProcessar={vi.fn()} />)

    expect(screen.getByText('Não foi possível processar o orçamento.')).toBeInTheDocument()
  })
})
