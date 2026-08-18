from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class GerarEtiquetaRequest(BaseModel):
    destinatario: str = Field(default="", max_length=200)
    endereco: str = Field(default="", max_length=200)
    bairro: str = Field(default="", max_length=200)
    cidade: str = Field(default="", max_length=200)
    cep: str = Field(default="", max_length=20)
    observacoes: str = Field(default="", max_length=200)
    tipo: Literal["sedex", "pac"] = "sedex"


class CampoLayoutResponse(BaseModel):
    x: int
    y: int
    largura: int
    altura: int
    yCentro: int
    tamanhoFonteMax: int


class LayoutEtiquetaResponse(BaseModel):
    largura: int
    altura: int
    templateUrl: str
    corTexto: str
    campos: dict[str, CampoLayoutResponse]
