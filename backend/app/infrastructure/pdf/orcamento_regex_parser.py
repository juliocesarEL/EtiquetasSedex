from __future__ import annotations

import re

from app.domain.entities import Endereco

# Formato fixo gerado pelo sistema interno, sempre no topo do orçamento:
# "Endereço: {logradouro}, {número} - {complemento/bairro}, {CIDADE}/{UF}  CEP: {cep}"
_PADRAO_ENDERECO_TOPO = re.compile(
    r"Endere[cç]o:\s*"
    r"(?P<logradouro>[^,\n]+),\s*"
    r"(?P<numero>[^-\n]+?)\s*-\s*"
    r"(?P<bairro>[^,\n]+),\s*"
    r"(?P<cidade>[^/\n]+)/(?P<uf>[A-Za-z]{2})\s+"
    r"CEP:\s*(?P<cep>\d{5}-?\d{3})",
    re.IGNORECASE,
)

_PADROES_DESTINATARIO = [
    re.compile(r"Cliente:\s*(?P<nome>[^\n]+)", re.IGNORECASE),
    re.compile(r"Raz[aã]o\s+Social:\s*(?P<nome>[^\n]+)", re.IGNORECASE),
    re.compile(r"Nome\s+do\s+Cliente:\s*(?P<nome>[^\n]+)", re.IGNORECASE),
    re.compile(r"Destinat[aá]rio:\s*(?P<nome>[^\n]+)", re.IGNORECASE),
]

# Rótulos de outros campos que costumam vir na mesma linha do nome do
# cliente em orçamentos gerados por sistemas de gestão (ex: "Cliente: FULANO  CNPJ: 000").
_ROTULOS_SEGUINTES = re.compile(
    r"\s+(CNPJ|CPF|Telefone|Fone|Celular|E-?mail|Endere[cç]o|Data|IE|RG)\s*:",
    re.IGNORECASE,
)

# Código interno do cliente antes do nome (ex: "635 - EMPRESA X LTDA") —
# não faz parte do nome e não deve ir para a etiqueta.
_CODIGO_CLIENTE_PREFIXO = re.compile(r"^\d+\s*-\s*")

# O campo "Endereço de Entrega" tem rótulo dedicado e, na prática, vem
# sempre vazio — não deve ser extraído.
_PADRAO_OBSERVACAO = re.compile(
    r"Observa[cç][^:\n]*:\s*(?P<texto>.+?)(?:\n\s*\n|\Z)",
    re.IGNORECASE | re.DOTALL,
)


def _cortar_antes_do_proximo_rotulo(valor: str) -> str:
    corte = _ROTULOS_SEGUINTES.search(valor)
    return valor[: corte.start()] if corte else valor


class OrcamentoRegexParser:
    """Implementação de ParserEnderecoTopoPort, ParserDestinatarioPort e
    ParserObservacaoPort baseada nos rótulos de formato fixo do orçamento."""

    def extrair_endereco_topo(self, texto: str) -> Endereco | None:
        match = _PADRAO_ENDERECO_TOPO.search(texto)
        if not match:
            return None
        return Endereco(
            logradouro=match.group("logradouro").strip(),
            numero=match.group("numero").strip(),
            bairro=match.group("bairro").strip(),
            cidade=match.group("cidade").strip(),
            uf=match.group("uf").strip().upper(),
            cep=match.group("cep").strip(),
        )

    def extrair_destinatario(self, texto: str) -> str | None:
        for padrao in _PADROES_DESTINATARIO:
            match = padrao.search(texto)
            if match:
                nome = _cortar_antes_do_proximo_rotulo(match.group("nome")).strip()
                nome = _CODIGO_CLIENTE_PREFIXO.sub("", nome).strip()
                if nome:
                    return nome
        return None

    def extrair_observacao(self, texto: str) -> str | None:
        match = _PADRAO_OBSERVACAO.search(texto)
        if not match:
            return None
        observacao = match.group("texto").strip()
        return observacao or None
