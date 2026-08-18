from __future__ import annotations

from app.application.dto import CamposEtiquetaExtraidos
from app.domain.address_prioritizer import priorizar_endereco
from app.domain.observacao_heuristics import possui_indicio_de_endereco
from app.domain.ports import (
    ExtratorEnderecoLLMPort,
    ExtratorTextoPdfPort,
    ParserDestinatarioPort,
    ParserEnderecoTopoPort,
    ParserObservacaoPort,
)
from app.domain.sanitization import sanitizar_campo_etiqueta


class ProcessarOrcamentoUseCase:
    """Caso de uso: recebe o PDF do orçamento e retorna os campos já
    prontos para conferência na tela de edição da etiqueta."""

    def __init__(
        self,
        extrator_texto: ExtratorTextoPdfPort,
        parser_endereco_topo: ParserEnderecoTopoPort,
        parser_destinatario: ParserDestinatarioPort,
        parser_observacao: ParserObservacaoPort,
        extrator_endereco_llm: ExtratorEnderecoLLMPort,
    ) -> None:
        self._extrator_texto = extrator_texto
        self._parser_endereco_topo = parser_endereco_topo
        self._parser_destinatario = parser_destinatario
        self._parser_observacao = parser_observacao
        self._extrator_endereco_llm = extrator_endereco_llm

    async def executar(self, conteudo_pdf: bytes) -> CamposEtiquetaExtraidos:
        texto = self._extrator_texto.extrair_texto(conteudo_pdf)

        destinatario = self._parser_destinatario.extrair_destinatario(texto)
        endereco_topo = self._parser_endereco_topo.extrair_endereco_topo(texto)
        observacao_texto = self._parser_observacao.extrair_observacao(texto)

        endereco_observacao = None
        if possui_indicio_de_endereco(observacao_texto):
            endereco_observacao = await self._extrator_endereco_llm.extrair(observacao_texto or "")

        endereco, fonte = priorizar_endereco(endereco_observacao, endereco_topo)

        return CamposEtiquetaExtraidos(
            destinatario=sanitizar_campo_etiqueta(destinatario),
            endereco=sanitizar_campo_etiqueta(endereco.linha_endereco()) if endereco else "",
            bairro=sanitizar_campo_etiqueta(endereco.bairro) if endereco else "",
            cidade=sanitizar_campo_etiqueta(endereco.linha_cidade()) if endereco else "",
            cep=sanitizar_campo_etiqueta(endereco.cep, max_len=12) if endereco else "",
            fonte_endereco=fonte.value if fonte else None,
        )
