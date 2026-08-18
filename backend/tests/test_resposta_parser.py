from app.infrastructure.llm.resposta_parser import parsear_resposta_endereco


def test_parseia_resposta_json_valida_com_endereco():
    resposta = (
        '{"tem_endereco": true, "logradouro": "Rua das Palmeiras", "numero": "55", '
        '"bairro": "Jardim América", "cidade": "Guarulhos", "uf": "sp", "cep": "07000-123"}'
    )

    endereco = parsear_resposta_endereco(resposta)

    assert endereco is not None
    assert endereco.logradouro == "Rua das Palmeiras"
    assert endereco.uf == "SP"


def test_extrai_json_mesmo_com_texto_extra_ao_redor():
    resposta = 'Aqui está o resultado:\n```json\n{"tem_endereco": false}\n```'

    assert parsear_resposta_endereco(resposta) is None


def test_retorna_none_quando_tem_endereco_false():
    assert parsear_resposta_endereco('{"tem_endereco": false}') is None


def test_retorna_none_quando_resposta_nao_e_json():
    assert parsear_resposta_endereco("desculpe, não entendi") is None


def test_retorna_none_quando_endereco_vazio_apesar_de_tem_endereco_true():
    resposta = '{"tem_endereco": true, "logradouro": "", "cep": ""}'

    assert parsear_resposta_endereco(resposta) is None
