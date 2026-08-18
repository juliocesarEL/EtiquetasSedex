from __future__ import annotations

from typing import Protocol

from app.domain.entities import Endereco


class ExtratorTextoPdfPort(Protocol):
    """Extrai o texto bruto de um PDF de orçamento."""

    def extrair_texto(self, conteudo_pdf: bytes) -> str: ...


class ParserEnderecoTopoPort(Protocol):
    """Extrai o endereço padrão (topo do orçamento), formato fixo."""

    def extrair_endereco_topo(self, texto: str) -> Endereco | None: ...


class ParserDestinatarioPort(Protocol):
    """Extrai o nome do destinatário/cliente do orçamento."""

    def extrair_destinatario(self, texto: str) -> str | None: ...


class ParserObservacaoPort(Protocol):
    """Extrai o texto bruto do campo Observação do orçamento."""

    def extrair_observacao(self, texto: str) -> str | None: ...


class ExtratorEnderecoLLMPort(Protocol):
    """Extrai um endereço de um texto livre (observação) usando um LLM."""

    async def extrair(self, texto_observacao: str) -> Endereco | None: ...


class RenderizadorEtiquetaPort(Protocol):
    """Desenha os campos de uma etiqueta sobre o template visual e retorna a imagem."""

    def renderizar(
        self, destinatario: str, endereco: str, bairro: str, cidade: str, cep: str, observacoes: str = ""
    ) -> bytes: ...
