from __future__ import annotations

import io

import pdfplumber


class PdfPlumberTextExtractor:
    """Implementação de ExtratorTextoPdfPort usando pdfplumber."""

    def extrair_texto(self, conteudo_pdf: bytes) -> str:
        paginas_texto: list[str] = []
        with pdfplumber.open(io.BytesIO(conteudo_pdf)) as pdf:
            for pagina in pdf.pages:
                paginas_texto.append(pagina.extract_text() or "")
        return "\n".join(paginas_texto)
