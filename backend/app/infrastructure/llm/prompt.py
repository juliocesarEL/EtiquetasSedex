_TEMPLATE = """Analise o texto de observação abaixo (pode conter informações não relacionadas a endereço).
Se houver um endereço de entrega mencionado, extraia: logradouro, número, bairro, cidade, UF, CEP.
Se não houver endereço, retorne tem_endereco: false.
Responda apenas em JSON, sem texto adicional, exatamente no formato:
{{"tem_endereco": true, "logradouro": "", "numero": "", "bairro": "", "cidade": "", "uf": "", "cep": ""}}

Texto: "{observacao}"
"""


def montar_prompt(observacao: str) -> str:
    return _TEMPLATE.format(observacao=observacao)
