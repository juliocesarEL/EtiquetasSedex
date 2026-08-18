from __future__ import annotations

from app.domain.entities import Endereco, FonteEndereco


def priorizar_endereco(
    endereco_observacao: Endereco | None,
    endereco_topo: Endereco | None,
) -> tuple[Endereco | None, FonteEndereco | None]:
    """Regra de negócio: o endereço da Observação, quando presente, sempre
    tem prioridade sobre o endereço padrão do topo do orçamento."""
    if endereco_observacao is not None:
        return endereco_observacao, FonteEndereco.OBSERVACAO
    if endereco_topo is not None:
        return endereco_topo, FonteEndereco.TOPO
    return None, None
