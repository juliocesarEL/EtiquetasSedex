import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TipoEtiquetaToggle } from './TipoEtiquetaToggle'

describe('TipoEtiquetaToggle', () => {
  it('marca a opção atual como selecionada', () => {
    render(<TipoEtiquetaToggle valor="sedex" onAlterar={vi.fn()} />)

    expect(screen.getByRole('radio', { name: 'SEDEX' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'PAC' })).toHaveAttribute('aria-checked', 'false')
  })

  it('chama onAlterar com o novo tipo ao clicar na outra opção', async () => {
    const usuario = userEvent.setup()
    const onAlterar = vi.fn()

    render(<TipoEtiquetaToggle valor="sedex" onAlterar={onAlterar} />)
    await usuario.click(screen.getByRole('radio', { name: 'PAC' }))

    expect(onAlterar).toHaveBeenCalledWith('pac')
    expect(onAlterar).toHaveBeenCalledTimes(1)
  })

  it('ainda dispara onAlterar clicando na opção já selecionada', async () => {
    const usuario = userEvent.setup()
    const onAlterar = vi.fn()

    render(<TipoEtiquetaToggle valor="pac" onAlterar={onAlterar} />)
    await usuario.click(screen.getByRole('radio', { name: 'PAC' }))

    expect(onAlterar).toHaveBeenCalledWith('pac')
  })
})
