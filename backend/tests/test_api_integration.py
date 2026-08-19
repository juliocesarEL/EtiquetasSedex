from __future__ import annotations

from fastapi.testclient import TestClient

from app.application.processar_orcamento import ProcessarOrcamentoUseCase
from app.infrastructure.pdf.orcamento_regex_parser import OrcamentoRegexParser
from app.infrastructure.pdf.pdfplumber_text_extractor import PdfPlumberTextExtractor
from app.presentation.dependencies import obter_processar_orcamento_use_case
from app.presentation.main import app

client = TestClient(app)

_ASSINATURA_PNG = b"\x89PNG\r\n\x1a\n"

_CAMPOS_ETIQUETA_VALIDOS = {
    "destinatario": "JOAO DA SILVA",
    "endereco": "Rua Teste, 1",
    "bairro": "Centro",
    "cidade": "Sao Paulo/SP",
    "cep": "01000-000",
    "observacoes": "",
    "tipo": "sedex",
}


def _sobrescrever_processar_com_llm_falso(fabrica_llm_falso, endereco):
    """Troca o provedor de LLM real pelo dublê de teste, via o mecanismo
    de override de dependências do FastAPI — sem chamada de rede real."""
    parser = OrcamentoRegexParser()

    def factory() -> ProcessarOrcamentoUseCase:
        return ProcessarOrcamentoUseCase(
            extrator_texto=PdfPlumberTextExtractor(),
            parser_endereco_topo=parser,
            parser_destinatario=parser,
            parser_observacao=parser,
            extrator_endereco_llm=fabrica_llm_falso(endereco),
        )

    app.dependency_overrides[obter_processar_orcamento_use_case] = factory


class TestHealth:
    def test_retorna_status_ok(self):
        resposta = client.get("/api/health")

        assert resposta.status_code == 200
        assert resposta.json() == {"status": "ok"}


class TestProcessarOrcamento:
    def teardown_method(self):
        app.dependency_overrides.clear()

    def test_usa_endereco_do_topo_quando_observacao_nao_tem_indicio(
        self, pdf_orcamento_topo, fabrica_llm_falso
    ):
        _sobrescrever_processar_com_llm_falso(fabrica_llm_falso, endereco=None)

        resposta = client.post(
            "/api/orcamentos/processar",
            files={"arquivo": ("orcamento.pdf", pdf_orcamento_topo, "application/pdf")},
        )

        assert resposta.status_code == 200
        corpo = resposta.json()
        assert corpo["fonte_endereco"] == "topo"
        assert corpo["cep"] == "03136-000"
        assert corpo["bairro"] == "Vila Prudente"
        # o código interno do cliente ("635 - ") não deve aparecer no nome
        assert not corpo["destinatario"].startswith("635")

    def test_prioriza_endereco_da_observacao_sobre_o_topo(
        self, pdf_orcamento_com_observacao, fabrica_llm_falso, endereco_observacao_fake
    ):
        _sobrescrever_processar_com_llm_falso(fabrica_llm_falso, endereco=endereco_observacao_fake)

        resposta = client.post(
            "/api/orcamentos/processar",
            files={"arquivo": ("orcamento.pdf", pdf_orcamento_com_observacao, "application/pdf")},
        )

        assert resposta.status_code == 200
        corpo = resposta.json()
        assert corpo["fonte_endereco"] == "observacao"
        assert corpo["cep"] == "07000-123"
        assert corpo["bairro"] == "Jardim Novo"

    def test_rejeita_arquivo_que_nao_e_pdf(self):
        resposta = client.post(
            "/api/orcamentos/processar",
            files={"arquivo": ("nota.txt", b"isso nao e um pdf", "text/plain")},
        )

        assert resposta.status_code == 400
        assert "erro" in resposta.json()

    def test_rejeita_conteudo_que_nao_comeca_com_assinatura_pdf(self):
        resposta = client.post(
            "/api/orcamentos/processar",
            files={"arquivo": ("falso.pdf", b"conteudo qualquer", "application/pdf")},
        )

        assert resposta.status_code == 400

    def test_rejeita_arquivo_vazio(self):
        resposta = client.post(
            "/api/orcamentos/processar",
            files={"arquivo": ("vazio.pdf", b"", "application/pdf")},
        )

        assert resposta.status_code == 400

    def test_erro_nao_vaza_detalhe_interno(self, pdf_orcamento_com_observacao):
        # Precisa de um orçamento cuja observação tenha indício de endereço —
        # só assim o pré-filtro deixa a chamada ao LLM (aqui, o dublê que
        # quebra) acontecer de verdade.
        class ExtratorQueQuebra:
            async def extrair(self, texto_observacao: str):
                raise RuntimeError("segredo interno que nao deveria aparecer pro cliente")

        parser = OrcamentoRegexParser()
        app.dependency_overrides[obter_processar_orcamento_use_case] = lambda: ProcessarOrcamentoUseCase(
            extrator_texto=PdfPlumberTextExtractor(),
            parser_endereco_topo=parser,
            parser_destinatario=parser,
            parser_observacao=parser,
            extrator_endereco_llm=ExtratorQueQuebra(),
        )

        # O TestClient por padrão relança a exceção original (útil pra
        # depurar outros testes) — aqui queremos exatamente a resposta HTTP
        # que o handler genérico de erro produz pro cliente de verdade.
        cliente_sem_relancar = TestClient(app, raise_server_exceptions=False)
        resposta = cliente_sem_relancar.post(
            "/api/orcamentos/processar",
            files={"arquivo": ("orcamento.pdf", pdf_orcamento_com_observacao, "application/pdf")},
        )

        assert resposta.status_code == 500
        assert "segredo interno" not in resposta.text


class TestLayout:
    def test_retorna_campos_esperados_para_sedex_e_pac(self):
        for tipo in ("sedex", "pac"):
            resposta = client.get(f"/api/etiquetas/layout?tipo={tipo}")

            assert resposta.status_code == 200
            corpo = resposta.json()
            assert set(corpo["campos"].keys()) == {
                "destinatario",
                "endereco",
                "bairro",
                "cidade",
                "cep",
                "observacoes",
            }
            assert corpo["templateUrl"].endswith(".png")

    def test_rejeita_tipo_desconhecido(self):
        resposta = client.get("/api/etiquetas/layout?tipo=correios")

        assert resposta.status_code == 422


class TestGerarEtiqueta:
    def test_retorna_png_valido(self):
        resposta = client.post("/api/etiquetas/gerar", json=_CAMPOS_ETIQUETA_VALIDOS)

        assert resposta.status_code == 200
        assert resposta.headers["content-type"] == "image/png"
        assert resposta.content[:8] == _ASSINATURA_PNG

    def test_gera_no_layout_pac_tambem(self):
        dados = {**_CAMPOS_ETIQUETA_VALIDOS, "tipo": "pac"}

        resposta = client.post("/api/etiquetas/gerar", json=dados)

        assert resposta.status_code == 200
        assert resposta.content[:8] == _ASSINATURA_PNG

    def test_rejeita_tipo_de_etiqueta_invalido(self):
        dados = {**_CAMPOS_ETIQUETA_VALIDOS, "tipo": "correios"}

        resposta = client.post("/api/etiquetas/gerar", json=dados)

        assert resposta.status_code == 422

    def test_sanitiza_conteudo_potencialmente_malicioso_sem_quebrar(self):
        dados = {
            **_CAMPOS_ETIQUETA_VALIDOS,
            "destinatario": "Nome‮com caractere de override\x00",
        }

        resposta = client.post("/api/etiquetas/gerar", json=dados)

        assert resposta.status_code == 200
        assert resposta.content[:8] == _ASSINATURA_PNG

    def test_funciona_com_campos_vazios(self):
        dados = {"destinatario": "", "endereco": "", "bairro": "", "cidade": "", "cep": "", "observacoes": "", "tipo": "sedex"}

        resposta = client.post("/api/etiquetas/gerar", json=dados)

        assert resposta.status_code == 200
