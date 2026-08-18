from __future__ import annotations

import re
import unicodedata

# Caracteres de controle de direção de texto (bidi override) usados em ataques
# de spoofing visual — nunca devem aparecer em um campo de etiqueta impresso.
_BIDI_CONTROL_CHARS = "‪‫‬‭‮⁦⁧⁨⁩"
_ESPACOS_MULTIPLOS = re.compile(r"\s+")

MAX_LEN_PADRAO = 120


def sanitizar_campo_etiqueta(valor: str | None, max_len: int = MAX_LEN_PADRAO) -> str:
    """Normaliza um valor extraído do PDF/LLM antes de desenhá-lo na etiqueta:
    remove caracteres de controle, remove caracteres de override de direção
    (proteção contra spoofing visual), colapsa espaços e limita o tamanho."""
    if not valor:
        return ""

    texto = unicodedata.normalize("NFKC", valor)
    texto = "".join(ch for ch in texto if ch not in _BIDI_CONTROL_CHARS)
    texto = "".join(ch for ch in texto if unicodedata.category(ch)[0] != "C" or ch == " ")
    texto = _ESPACOS_MULTIPLOS.sub(" ", texto).strip()

    return texto[:max_len]
