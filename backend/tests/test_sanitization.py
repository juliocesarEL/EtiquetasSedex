from app.domain.sanitization import sanitizar_campo_etiqueta


def test_remove_caracteres_de_controle():
    assert sanitizar_campo_etiqueta("Rua A\x00\x07, 10") == "Rua A, 10"


def test_colapsa_espacos_e_quebras_de_linha():
    assert sanitizar_campo_etiqueta("Rua A,\n\n  10   -  Centro") == "Rua A, 10 - Centro"


def test_remove_caracteres_de_override_de_direcao():
    texto_malicioso = "Rua A‮, 10"
    resultado = sanitizar_campo_etiqueta(texto_malicioso)
    assert "‮" not in resultado


def test_trunca_no_tamanho_maximo():
    texto_longo = "A" * 500
    assert len(sanitizar_campo_etiqueta(texto_longo, max_len=50)) == 50


def test_valor_vazio_retorna_string_vazia():
    assert sanitizar_campo_etiqueta(None) == ""
    assert sanitizar_campo_etiqueta("") == ""
