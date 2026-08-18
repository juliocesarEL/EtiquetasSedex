from __future__ import annotations

from dataclasses import dataclass

# Coordenadas medidas diretamente sobre o template oficial da etiqueta BWR
# (assets/etiqueta_template.png, 1000x667px). Se o template visual mudar,
# só este arquivo precisa ser recalibrado.

LARGURA_TEMPLATE = 1000
ALTURA_TEMPLATE = 667

COR_TEXTO = (0, 0, 0)  # preto, para destacar os dados preenchidos dos rótulos do template
CAMINHO_TEMPLATE = "etiqueta_template.png"
CAMINHO_FONTE_BOLD = "fonts/arialbd.ttf"


@dataclass(frozen=True, slots=True)
class CampoLayout:
    x_inicio: int
    x_fim: int
    y_topo: int
    y_base: int
    tamanho_fonte_max: int = 26
    tamanho_fonte_min: int = 14

    @property
    def y_centro(self) -> int:
        return (self.y_topo + self.y_base) // 2

    @property
    def largura_disponivel(self) -> int:
        return self.x_fim - self.x_inicio


LAYOUT_CAMPOS: dict[str, CampoLayout] = {
    "destinatario": CampoLayout(x_inicio=306, x_fim=890, y_topo=181, y_base=214),
    "endereco": CampoLayout(x_inicio=262, x_fim=890, y_topo=230, y_base=270),
    "bairro": CampoLayout(x_inicio=224, x_fim=890, y_topo=289, y_base=322),
    "cidade": CampoLayout(x_inicio=222, x_fim=890, y_topo=340, y_base=372),
    "cep": CampoLayout(x_inicio=181, x_fim=890, y_topo=389, y_base=422),
    "observacoes": CampoLayout(x_inicio=110, x_fim=890, y_topo=477, y_base=513),
}
