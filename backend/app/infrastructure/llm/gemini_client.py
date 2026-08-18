from __future__ import annotations

import httpx

from app.domain.entities import Endereco
from app.infrastructure.llm.prompt import montar_prompt
from app.infrastructure.llm.resposta_parser import parsear_resposta_endereco

_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent"
_MODELO_PADRAO = "gemini-flash-lite-latest"


class GeminiEnderecoExtractor:
    """Implementação de ExtratorEnderecoLLMPort usando a Google Gemini API (gratuita)."""

    def __init__(self, api_key: str, modelo: str = _MODELO_PADRAO, timeout_segundos: float = 15.0) -> None:
        self._api_key = api_key
        self._modelo = modelo
        self._timeout_segundos = timeout_segundos

    async def extrair(self, texto_observacao: str) -> Endereco | None:
        if not self._api_key or not texto_observacao.strip():
            return None

        url = _URL_TEMPLATE.format(modelo=self._modelo)
        payload = {
            "contents": [{"parts": [{"text": montar_prompt(texto_observacao)}]}],
            "generationConfig": {"temperature": 0, "responseMimeType": "application/json"},
        }
        headers = {"x-goog-api-key": self._api_key, "Content-Type": "application/json"}

        try:
            async with httpx.AsyncClient(timeout=self._timeout_segundos) as client:
                resposta = await client.post(url, json=payload, headers=headers)
                resposta.raise_for_status()
                corpo = resposta.json()
            conteudo = corpo["candidates"][0]["content"]["parts"][0]["text"]
        except (httpx.HTTPError, KeyError, IndexError, ValueError):
            return None

        return parsear_resposta_endereco(conteudo)
