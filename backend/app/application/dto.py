from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class CamposEtiquetaExtraidos:
    destinatario: str
    endereco: str
    bairro: str
    cidade: str
    cep: str
    fonte_endereco: str | None
