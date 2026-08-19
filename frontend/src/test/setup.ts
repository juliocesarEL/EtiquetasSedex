import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Sem `globals: true` no vitest.config, o cleanup automático do Testing
// Library não se registra sozinho — sem isso, componentes de um teste
// continuam no DOM quando o próximo teste roda.
afterEach(() => {
  cleanup()
})
