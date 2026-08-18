from __future__ import annotations

from app.domain.ports import RenderizadorEtiquetaPort
from app.domain.sanitization import sanitizar_campo_etiqueta


class GerarEtiquetaUseCase:
    """Caso de uso: recebe os campos confirmados/editados pelo usuário e
    gera a imagem final da etiqueta pronta para impressão."""

    def __init__(self, renderizador: RenderizadorEtiquetaPort) -> None:
        self._renderizador = renderizador

    def executar(
        self, destinatario: str, endereco: str, bairro: str, cidade: str, cep: str, observacoes: str = ""
    ) -> bytes:
        # Os campos chegam aqui editáveis pelo usuário no frontend, então são
        # tratados como entrada não confiável e sanitizados novamente.
        return self._renderizador.renderizar(
            destinatario=sanitizar_campo_etiqueta(destinatario),
            endereco=sanitizar_campo_etiqueta(endereco),
            bairro=sanitizar_campo_etiqueta(bairro),
            cidade=sanitizar_campo_etiqueta(cidade),
            cep=sanitizar_campo_etiqueta(cep, max_len=12),
            observacoes=sanitizar_campo_etiqueta(observacoes),
        )
