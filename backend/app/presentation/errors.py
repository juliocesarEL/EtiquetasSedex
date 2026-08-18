from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("etiquetas_sedex")


class ArquivoInvalidoError(Exception):
    def __init__(self, mensagem: str) -> None:
        self.mensagem = mensagem


class DadosInvalidosError(Exception):
    def __init__(self, mensagem: str) -> None:
        self.mensagem = mensagem


def registrar_handlers_de_erro(app: FastAPI) -> None:
    @app.exception_handler(ArquivoInvalidoError)
    async def _handle_arquivo_invalido(request: Request, exc: ArquivoInvalidoError) -> JSONResponse:
        return JSONResponse(status_code=400, content={"erro": exc.mensagem})

    @app.exception_handler(DadosInvalidosError)
    async def _handle_dados_invalidos(request: Request, exc: DadosInvalidosError) -> JSONResponse:
        return JSONResponse(status_code=422, content={"erro": exc.mensagem})

    @app.exception_handler(Exception)
    async def _handle_erro_inesperado(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Erro inesperado ao processar %s %s", request.method, request.url.path)
        return JSONResponse(status_code=500, content={"erro": "Ocorreu um erro interno. Tente novamente."})
