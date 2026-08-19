from __future__ import annotations

from typing import Callable

import pytest
from fpdf import FPDF

from app.domain.entities import Endereco


def _gerar_pdf(linhas: list[str]) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=11)
    for linha in linhas:
        pdf.cell(0, 8, text=linha, new_x="LMARGIN", new_y="NEXT")
    return bytes(pdf.output())


@pytest.fixture
def pdf_orcamento_topo() -> bytes:
    """Orçamento só com endereço no topo — a observação não tem indício
    de endereço, então o LLM nunca deveria ser acionado."""
    return _gerar_pdf(
        [
            "Orcamento no 4521",
            "Cliente: 635 - EMPRESA TESTE LTDA   CNPJ: 12.345.678/0001-90",
            "Endereco: Rua Santa Rosalia, 1411 - Vila Prudente, SAO PAULO/SP  CEP: 03136-000",
            "",
            "Observacao: Entregar com urgencia, cliente prioritario.",
        ]
    )


@pytest.fixture
def pdf_orcamento_com_observacao() -> bytes:
    """Orçamento com endereço alternativo na observação — deve acionar o
    (fake) extrator de LLM e ter prioridade sobre o endereço do topo."""
    return _gerar_pdf(
        [
            "Orcamento no 9001",
            "Cliente: OUTRA EMPRESA LTDA",
            "Endereco: Rua Antiga, 1 - Centro, CIDADE ANTIGA/SP  CEP: 00000-000",
            "",
            "Observacao: ENDERECO DE ENTREGA: Rua Nova, 55, bairro Jardim Novo,",
            "cidade Guarulhos SP, cep 07000-123.",
        ]
    )


class ExtratorEnderecoLLMFalso:
    """Dublê de teste para ExtratorEnderecoLLMPort: determinístico, sem
    chamada de rede — substitui Groq/Gemini nos testes de integração."""

    def __init__(self, endereco: Endereco | None) -> None:
        self._endereco = endereco

    async def extrair(self, texto_observacao: str) -> Endereco | None:
        return self._endereco


@pytest.fixture
def fabrica_llm_falso() -> Callable[[Endereco | None], ExtratorEnderecoLLMFalso]:
    return ExtratorEnderecoLLMFalso


@pytest.fixture
def endereco_observacao_fake() -> Endereco:
    return Endereco(
        logradouro="Rua Nova",
        numero="55",
        bairro="Jardim Novo",
        cidade="Guarulhos",
        uf="SP",
        cep="07000-123",
    )
