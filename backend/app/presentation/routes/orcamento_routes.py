from __future__ import annotations

from fastapi import APIRouter, Depends, File, Request, UploadFile

from app.application.processar_orcamento import ProcessarOrcamentoUseCase
from app.config import Settings, get_settings
from app.presentation.dependencies import obter_processar_orcamento_use_case
from app.presentation.errors import ArquivoInvalidoError
from app.presentation.rate_limit import limiter
from app.presentation.schemas.orcamento_schemas import CamposEtiquetaResponse

router = APIRouter(prefix="/api/orcamentos", tags=["orcamentos"])

_ASSINATURA_PDF = b"%PDF-"


@router.post("/processar", response_model=CamposEtiquetaResponse)
@limiter.limit(get_settings().rate_limit)
async def processar_orcamento(
    request: Request,
    arquivo: UploadFile = File(...),
    settings: Settings = Depends(get_settings),
    use_case: ProcessarOrcamentoUseCase = Depends(obter_processar_orcamento_use_case),
) -> CamposEtiquetaResponse:
    if arquivo.content_type != "application/pdf":
        raise ArquivoInvalidoError("Envie um arquivo PDF válido.")

    conteudo = await arquivo.read()

    if not conteudo:
        raise ArquivoInvalidoError("O arquivo enviado está vazio.")
    if len(conteudo) > settings.max_upload_bytes:
        raise ArquivoInvalidoError(f"O arquivo excede o limite de {settings.max_upload_mb}MB.")
    if not conteudo.startswith(_ASSINATURA_PDF):
        raise ArquivoInvalidoError("O arquivo não parece ser um PDF válido.")

    campos = await use_case.executar(conteudo)

    return CamposEtiquetaResponse(
        destinatario=campos.destinatario,
        endereco=campos.endereco,
        bairro=campos.bairro,
        cidade=campos.cidade,
        cep=campos.cep,
        fonte_endereco=campos.fonte_endereco,
    )
