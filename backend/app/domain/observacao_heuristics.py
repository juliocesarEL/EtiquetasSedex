from __future__ import annotations

import re

_PADRAO_CEP = re.compile(r"\d{5}-?\d{3}")
_PALAVRAS_INDICATIVAS = re.compile(
    r"\b(endere[cç]o|entrega|rua|r\.|av|av\.|avenida|rodovia|estrada|travessa|"
    r"alameda|bairro|km|cep|cidade|n[ºo°]?\s*\d)\b",
    re.IGNORECASE,
)


def possui_indicio_de_endereco(texto: str | None) -> bool:
    """Pré-filtro barato (sem custo de API) para decidir se vale a pena
    chamar o LLM: só chamamos se houver algum indício textual de endereço."""
    if not texto or not texto.strip():
        return False
    return bool(_PADRAO_CEP.search(texto) or _PALAVRAS_INDICATIVAS.search(texto))
