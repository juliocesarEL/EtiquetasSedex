import pytest

from app.domain.observacao_heuristics import possui_indicio_de_endereco


@pytest.mark.parametrize(
    "texto",
    [
        "Entregar na Rua das Palmeiras, 55, CEP 07000-123",
        "endereço de entrega diferente, ver observação",
        "cep: 01000000",
    ],
)
def test_detecta_indicio_de_endereco(texto: str):
    assert possui_indicio_de_endereco(texto) is True


@pytest.mark.parametrize("texto", [None, "", "   ", "entregar com urgência, cliente prioritário"])
def test_nao_detecta_indicio_quando_texto_nao_menciona_endereco(texto):
    assert possui_indicio_de_endereco(texto) is False
