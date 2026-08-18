from __future__ import annotations

from app.domain.entities import Endereco


class ExtratorEnderecoLLMNulo:
    """Implementação nula de ExtratorEnderecoLLMPort, usada quando nenhum
    provedor de LLM está configurado. Mantém o fluxo funcionando (cai
    para o endereço do topo) em vez de quebrar a aplicação."""

    async def extrair(self, texto_observacao: str) -> Endereco | None:
        return None
