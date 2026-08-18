from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class FonteEndereco(str, Enum):
    OBSERVACAO = "observacao"
    TOPO = "topo"


@dataclass(frozen=True, slots=True)
class Endereco:
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    uf: str
    cep: str

    def linha_endereco(self) -> str:
        partes = [self.logradouro.strip()]
        if self.numero.strip():
            partes[0] = f"{partes[0]}, {self.numero.strip()}"
        return partes[0]

    def linha_cidade(self) -> str:
        cidade = self.cidade.strip()
        uf = self.uf.strip()
        return f"{cidade}/{uf}" if uf else cidade


@dataclass(frozen=True, slots=True)
class Orcamento:
    texto_bruto: str
    destinatario: str | None
    endereco_topo: Endereco | None
    observacao_texto: str | None


@dataclass(frozen=True, slots=True)
class Etiqueta:
    destinatario: str
    endereco: str
    bairro: str
    cidade: str
    cep: str
