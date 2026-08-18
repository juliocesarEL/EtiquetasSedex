from __future__ import annotations

from pydantic import BaseModel


class CamposEtiquetaResponse(BaseModel):
    destinatario: str
    endereco: str
    bairro: str
    cidade: str
    cep: str
    fonte_endereco: str | None
