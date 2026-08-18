from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

# Coordenadas medidas diretamente sobre os templates oficiais da BWR
# (assets/etiqueta_template*.png). Se algum template visual mudar, só este
# arquivo precisa ser recalibrado.

TipoEtiqueta = Literal["sedex", "pac"]

COR_TEXTO = (0, 0, 0)  # preto, para destacar os dados preenchidos dos rótulos do template
CAMINHO_FONTE_BOLD = "fonts/arialbd.ttf"


@dataclass(frozen=True, slots=True)
class CampoLayout:
    x_inicio: int
    x_fim: int
    y_topo: int
    y_base: int
    tamanho_fonte_max: int
    tamanho_fonte_min: int

    @property
    def y_centro(self) -> int:
        return (self.y_topo + self.y_base) // 2

    @property
    def largura_disponivel(self) -> int:
        return self.x_fim - self.x_inicio


@dataclass(frozen=True, slots=True)
class TemplateEtiqueta:
    caminho_arquivo: str
    largura: int
    altura: int
    campos: dict[str, CampoLayout] = field(default_factory=dict)


TEMPLATES: dict[TipoEtiqueta, TemplateEtiqueta] = {
    "sedex": TemplateEtiqueta(
        caminho_arquivo="etiqueta_template.png",
        largura=1000,
        altura=667,
        campos={
            "destinatario": CampoLayout(306, 890, 181, 214, tamanho_fonte_max=26, tamanho_fonte_min=14),
            "endereco": CampoLayout(262, 890, 230, 270, tamanho_fonte_max=26, tamanho_fonte_min=14),
            "bairro": CampoLayout(224, 890, 289, 322, tamanho_fonte_max=26, tamanho_fonte_min=14),
            "cidade": CampoLayout(222, 890, 340, 372, tamanho_fonte_max=26, tamanho_fonte_min=14),
            "cep": CampoLayout(181, 890, 389, 422, tamanho_fonte_max=26, tamanho_fonte_min=14),
            "observacoes": CampoLayout(110, 890, 477, 513, tamanho_fonte_max=26, tamanho_fonte_min=14),
        },
    ),
    "pac": TemplateEtiqueta(
        caminho_arquivo="etiqueta_template_pac.png",
        largura=1264,
        altura=843,
        campos={
            "destinatario": CampoLayout(388, 1130, 230, 270, tamanho_fonte_max=33, tamanho_fonte_min=18),
            "endereco": CampoLayout(332, 1130, 291, 341, tamanho_fonte_max=33, tamanho_fonte_min=18),
            "bairro": CampoLayout(284, 1130, 365, 406, tamanho_fonte_max=33, tamanho_fonte_min=18),
            "cidade": CampoLayout(281, 1130, 430, 470, tamanho_fonte_max=33, tamanho_fonte_min=18),
            "cep": CampoLayout(230, 1130, 493, 533, tamanho_fonte_max=33, tamanho_fonte_min=18),
            "observacoes": CampoLayout(116, 1130, 604, 649, tamanho_fonte_max=33, tamanho_fonte_min=18),
        },
    ),
}

TIPO_PADRAO: TipoEtiqueta = "sedex"
