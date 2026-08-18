from __future__ import annotations

from functools import lru_cache

from app.application.gerar_etiqueta import GerarEtiquetaUseCase
from app.application.processar_orcamento import ProcessarOrcamentoUseCase
from app.config import ASSETS_DIR, Settings, get_settings
from app.domain.ports import ExtratorEnderecoLLMPort
from app.infrastructure.image.label_renderer import PillowLabelRenderer
from app.infrastructure.llm.gemini_client import GeminiEnderecoExtractor
from app.infrastructure.llm.groq_client import GroqEnderecoExtractor
from app.infrastructure.llm.null_client import ExtratorEnderecoLLMNulo
from app.infrastructure.pdf.orcamento_regex_parser import OrcamentoRegexParser
from app.infrastructure.pdf.pdfplumber_text_extractor import PdfPlumberTextExtractor


def _criar_extrator_llm(settings: Settings) -> ExtratorEnderecoLLMPort:
    if settings.llm_provider == "groq" and settings.groq_api_key:
        return GroqEnderecoExtractor(api_key=settings.groq_api_key)
    if settings.llm_provider == "gemini" and settings.gemini_api_key:
        return GeminiEnderecoExtractor(api_key=settings.gemini_api_key)
    return ExtratorEnderecoLLMNulo()


def obter_processar_orcamento_use_case() -> ProcessarOrcamentoUseCase:
    settings = get_settings()
    parser = OrcamentoRegexParser()
    return ProcessarOrcamentoUseCase(
        extrator_texto=PdfPlumberTextExtractor(),
        parser_endereco_topo=parser,
        parser_destinatario=parser,
        parser_observacao=parser,
        extrator_endereco_llm=_criar_extrator_llm(settings),
    )


@lru_cache
def _renderer() -> PillowLabelRenderer:
    return PillowLabelRenderer(ASSETS_DIR)


def obter_gerar_etiqueta_use_case() -> GerarEtiquetaUseCase:
    return GerarEtiquetaUseCase(renderizador=_renderer())
