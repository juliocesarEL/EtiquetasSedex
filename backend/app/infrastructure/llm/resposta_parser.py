from __future__ import annotations

import json
import re

from app.domain.entities import Endereco

_BLOCO_JSON = re.compile(r"\{.*\}", re.DOTALL)


def _extrair_bloco_json(texto: str) -> dict | None:
    match = _BLOCO_JSON.search(texto)
    if not match:
        return None
    try:
        dados = json.loads(match.group(0))
    except json.JSONDecodeError:
        return None
    return dados if isinstance(dados, dict) else None


def parsear_resposta_endereco(resposta_llm: str) -> Endereco | None:
    """Converte a resposta em texto do LLM em um Endereco, validando o
    formato esperado. Usada por qualquer provedor de LLM, evitando
    duplicar a lógica de parsing/validação entre eles."""
    dados = _extrair_bloco_json(resposta_llm)
    if not dados or not dados.get("tem_endereco"):
        return None

    logradouro = str(dados.get("logradouro") or "").strip()
    cep = str(dados.get("cep") or "").strip()
    if not logradouro and not cep:
        return None

    return Endereco(
        logradouro=logradouro,
        numero=str(dados.get("numero") or "").strip(),
        bairro=str(dados.get("bairro") or "").strip(),
        cidade=str(dados.get("cidade") or "").strip(),
        uf=str(dados.get("uf") or "").strip().upper()[:2],
        cep=cep,
    )
