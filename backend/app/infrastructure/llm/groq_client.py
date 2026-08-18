from __future__ import annotations

import httpx

from app.domain.entities import Endereco
from app.infrastructure.llm.prompt import montar_prompt
from app.infrastructure.llm.resposta_parser import parsear_resposta_endereco

_URL = "https://api.groq.com/openai/v1/chat/completions"
_MODELO_PADRAO = "llama-3.1-8b-instant"


class GroqEnderecoExtractor:
    """Implementação de ExtratorEnderecoLLMPort usando a Groq API (gratuita)."""

    def __init__(self, api_key: str, modelo: str = _MODELO_PADRAO, timeout_segundos: float = 15.0) -> None:
        self._api_key = api_key
        self._modelo = modelo
        self._timeout_segundos = timeout_segundos

    async def extrair(self, texto_observacao: str) -> Endereco | None:
        if not self._api_key or not texto_observacao.strip():
            return None

        payload = {
            "model": self._modelo,
            "messages": [{"role": "user", "content": montar_prompt(texto_observacao)}],
            "temperature": 0,
            "response_format": {"type": "json_object"},
        }
        headers = {"Authorization": f"Bearer {self._api_key}"}

        try:
            async with httpx.AsyncClient(timeout=self._timeout_segundos) as client:
                resposta = await client.post(_URL, json=payload, headers=headers)
                resposta.raise_for_status()
                corpo = resposta.json()
            conteudo = corpo["choices"][0]["message"]["content"]
        except (httpx.HTTPError, KeyError, IndexError, ValueError):
            return None

        return parsear_resposta_endereco(conteudo)
