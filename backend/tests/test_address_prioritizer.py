from app.domain.address_prioritizer import priorizar_endereco
from app.domain.entities import Endereco, FonteEndereco

_ENDERECO_TOPO = Endereco("Rua das Flores", "100", "Centro", "São Paulo", "SP", "01000-000")
_ENDERECO_OBSERVACAO = Endereco("Av. Brasil", "200", "Jardins", "São Paulo", "SP", "02000-000")


def test_prioriza_endereco_da_observacao_quando_ambos_presentes():
    endereco, fonte = priorizar_endereco(_ENDERECO_OBSERVACAO, _ENDERECO_TOPO)

    assert endereco == _ENDERECO_OBSERVACAO
    assert fonte == FonteEndereco.OBSERVACAO


def test_usa_endereco_do_topo_quando_nao_ha_endereco_na_observacao():
    endereco, fonte = priorizar_endereco(None, _ENDERECO_TOPO)

    assert endereco == _ENDERECO_TOPO
    assert fonte == FonteEndereco.TOPO


def test_retorna_none_quando_nenhum_endereco_disponivel():
    endereco, fonte = priorizar_endereco(None, None)

    assert endereco is None
    assert fonte is None
