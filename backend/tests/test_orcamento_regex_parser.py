from app.infrastructure.pdf.orcamento_regex_parser import OrcamentoRegexParser

_TEXTO_ORCAMENTO = """
Orçamento nº 4521
Cliente: JOÃO DA SILVA COMERCIO LTDA   CNPJ: 12.345.678/0001-90
Endereço: Rua Santa Rosalia, 1411 - Vila Prudente, SÃO PAULO/SP  CEP: 03136-000

Produtos
1x Bomba Centrífuga BWR-200

Endereço de Entrega:

Observação: ENDEREÇO DE ENTREGA: Rua das Palmeiras, 55, bairro Jardim América,
cidade Guarulhos SP, cep 07000-123. Entregar pela manhã.

Forma de Pagamento: 30 dias
"""


def test_extrai_endereco_do_topo_no_formato_fixo():
    parser = OrcamentoRegexParser()

    endereco = parser.extrair_endereco_topo(_TEXTO_ORCAMENTO)

    assert endereco is not None
    assert endereco.logradouro == "Rua Santa Rosalia"
    assert endereco.numero == "1411"
    assert endereco.bairro == "Vila Prudente"
    assert endereco.cidade == "SÃO PAULO"
    assert endereco.uf == "SP"
    assert endereco.cep == "03136-000"


def test_extrai_nome_do_destinatario_ignorando_rotulo_seguinte():
    parser = OrcamentoRegexParser()

    nome = parser.extrair_destinatario(_TEXTO_ORCAMENTO)

    assert nome == "JOÃO DA SILVA COMERCIO LTDA"


def test_extrai_nome_do_destinatario_removendo_codigo_do_cliente():
    parser = OrcamentoRegexParser()
    texto = "Cliente: 635 - EMPRESA BAIANA DE AGUAS E SANEAMENTO SA\nEndereço: Rua X, 1 - Bairro, CIDADE/UF  CEP: 00000-000"

    nome = parser.extrair_destinatario(texto)

    assert nome == "EMPRESA BAIANA DE AGUAS E SANEAMENTO SA"


def test_extrai_texto_da_observacao():
    parser = OrcamentoRegexParser()

    observacao = parser.extrair_observacao(_TEXTO_ORCAMENTO)

    assert observacao is not None
    assert "Rua das Palmeiras" in observacao
    assert "Guarulhos" in observacao


def test_retorna_none_quando_nao_ha_endereco_no_topo():
    parser = OrcamentoRegexParser()

    assert parser.extrair_endereco_topo("texto sem nenhum endereço") is None


def test_retorna_none_quando_nao_ha_observacao():
    parser = OrcamentoRegexParser()

    assert parser.extrair_observacao("texto sem campo de observação") is None
