from __future__ import annotations

import io
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from app.infrastructure.image.layout import (
    CAMINHO_FONTE_BOLD,
    CAMINHO_TEMPLATE,
    COR_TEXTO,
    LAYOUT_CAMPOS,
    CampoLayout,
)

_REENTICENCIAS = "…"


class PillowLabelRenderer:
    """Implementação de RenderizadorEtiquetaPort: desenha os campos sobre
    o template visual oficial da etiqueta BWR usando Pillow."""

    def __init__(self, assets_dir: Path) -> None:
        self._template_path = assets_dir / CAMINHO_TEMPLATE
        self._fonte_path = assets_dir / CAMINHO_FONTE_BOLD
        self._fonte_cache: dict[int, ImageFont.FreeTypeFont] = {}

    def _fonte(self, tamanho: int) -> ImageFont.FreeTypeFont:
        if tamanho not in self._fonte_cache:
            self._fonte_cache[tamanho] = ImageFont.truetype(str(self._fonte_path), tamanho)
        return self._fonte_cache[tamanho]

    def _ajustar_fonte_e_texto(
        self, draw: ImageDraw.ImageDraw, texto: str, campo: CampoLayout
    ) -> tuple[str, ImageFont.FreeTypeFont]:
        tamanho = campo.tamanho_fonte_max
        while tamanho > campo.tamanho_fonte_min:
            fonte = self._fonte(tamanho)
            if draw.textlength(texto, font=fonte) <= campo.largura_disponivel:
                return texto, fonte
            tamanho -= 1

        fonte = self._fonte(campo.tamanho_fonte_min)
        texto_truncado = texto
        while texto_truncado and draw.textlength(texto_truncado + _REENTICENCIAS, font=fonte) > campo.largura_disponivel:
            texto_truncado = texto_truncado[:-1]
        if texto_truncado != texto:
            texto_truncado += _REENTICENCIAS
        return texto_truncado, fonte

    def renderizar(
        self,
        destinatario: str,
        endereco: str,
        bairro: str,
        cidade: str,
        cep: str,
        observacoes: str = "",
    ) -> bytes:
        imagem = Image.open(self._template_path).convert("RGB")
        draw = ImageDraw.Draw(imagem)

        valores = {
            "destinatario": destinatario,
            "endereco": endereco,
            "bairro": bairro,
            "cidade": cidade,
            "cep": cep,
            "observacoes": observacoes,
        }

        for chave, campo in LAYOUT_CAMPOS.items():
            texto = valores[chave]
            if not texto:
                continue
            texto_ajustado, fonte = self._ajustar_fonte_e_texto(draw, texto, campo)
            draw.text((campo.x_inicio, campo.y_centro), texto_ajustado, font=fonte, fill=COR_TEXTO, anchor="lm")

        buffer = io.BytesIO()
        imagem.save(buffer, format="PNG")
        return buffer.getvalue()
