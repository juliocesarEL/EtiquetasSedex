from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from fastapi.responses import Response

from app.application.gerar_etiqueta import GerarEtiquetaUseCase
from app.config import get_settings
from app.infrastructure.image.layout import ALTURA_TEMPLATE, COR_TEXTO, LARGURA_TEMPLATE, LAYOUT_CAMPOS
from app.presentation.dependencies import obter_gerar_etiqueta_use_case
from app.presentation.rate_limit import limiter
from app.presentation.schemas.etiqueta_schemas import (
    CampoLayoutResponse,
    GerarEtiquetaRequest,
    LayoutEtiquetaResponse,
)

router = APIRouter(prefix="/api/etiquetas", tags=["etiquetas"])


def _cor_hex(cor: tuple[int, int, int]) -> str:
    return "#%02x%02x%02x" % cor


@router.get("/layout", response_model=LayoutEtiquetaResponse)
async def obter_layout() -> LayoutEtiquetaResponse:
    return LayoutEtiquetaResponse(
        largura=LARGURA_TEMPLATE,
        altura=ALTURA_TEMPLATE,
        templateUrl="/static/etiqueta_template.png",
        corTexto=_cor_hex(COR_TEXTO),
        campos={
            chave: CampoLayoutResponse(
                x=campo.x_inicio,
                y=campo.y_topo,
                largura=campo.largura_disponivel,
                altura=campo.y_base - campo.y_topo,
                yCentro=campo.y_centro,
                tamanhoFonteMax=campo.tamanho_fonte_max,
            )
            for chave, campo in LAYOUT_CAMPOS.items()
        },
    )


@router.post("/gerar")
@limiter.limit(get_settings().rate_limit)
async def gerar_etiqueta(
    request: Request,
    dados: GerarEtiquetaRequest,
    use_case: GerarEtiquetaUseCase = Depends(obter_gerar_etiqueta_use_case),
) -> Response:
    imagem_png = use_case.executar(
        destinatario=dados.destinatario,
        endereco=dados.endereco,
        bairro=dados.bairro,
        cidade=dados.cidade,
        cep=dados.cep,
        observacoes=dados.observacoes,
    )
    return Response(
        content=imagem_png,
        media_type="image/png",
        headers={"Content-Disposition": "inline; filename=etiqueta-sedex.png"},
    )
