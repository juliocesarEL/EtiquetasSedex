# Etiquetas SEDEX — BWR Bombas

Sistema que substitui o preenchimento manual (no Word) das etiquetas SEDEX
BWR: recebe o PDF do orçamento, extrai automaticamente o endereço de
destino, mostra os campos para conferência/edição e gera a etiqueta final
pronta para impressão, no mesmo layout azul usado hoje.

## Stack

- **Backend:** Python + FastAPI, pdfplumber (extração do PDF), Pillow
  (geração da imagem da etiqueta) e um cliente de LLM gratuito (Groq ou
  Gemini) para o endereço vindo do campo Observação.
- **Frontend:** React + Vite + TypeScript.

## Estrutura

```
backend/
  app/
    domain/           # entidades e regras de negócio (prioridade de endereço, sanitização)
    application/       # casos de uso (processar orçamento, gerar etiqueta)
    infrastructure/     # pdfplumber, clientes Groq/Gemini, renderizador Pillow
    presentation/        # rotas FastAPI, schemas, tratamento de erros
  assets/               # template da etiqueta (PNG) e fontes
  tests/                # testes automatizados (pytest)
frontend/
  src/
    components/         # tela de upload, conferência, prévia e resultado
    api/                # cliente HTTP para o backend
```

## Como rodar

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\pip install -r requirements.txt      # Windows
# source venv/bin/activate && pip install -r requirements.txt   # Linux/Mac

copy .env.example .env                             # Windows
# cp .env.example .env                              # Linux/Mac
```

Edite o `backend/.env` e cole sua chave gratuita do provedor de LLM
escolhido (por padrão, Groq — crie a chave em console.groq.com):

```
LLM_PROVIDER=groq
GROQ_API_KEY=sua_chave_aqui
```

Sem essa chave configurada, o sistema continua funcionando normalmente,
apenas não tenta extrair o endereço da Observação e usa sempre o endereço
padrão do topo do orçamento.

Suba o servidor:

```bash
venv\Scripts\python.exe -m uvicorn app.presentation.main:app --reload --port 8000
```

Rodar os testes:

```bash
venv\Scripts\python.exe -m pytest
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:5173 — o Vite já está configurado para
encaminhar as chamadas `/api` e `/static` para o backend em
`http://127.0.0.1:8000` (veja `frontend/vite.config.ts`).

## Observações importantes

- **PDFs não são armazenados**: o conteúdo é lido em memória, processado e
  descartado ao final da requisição.
- **Prioridade do endereço**: se houver um endereço de entrega detectado
  no campo Observação (via LLM), ele tem prioridade sobre o endereço
  padrão do topo do orçamento — essa regra fica isolada em
  `backend/app/domain/address_prioritizer.py`.
- **Regex do topo**: extrai o endereço assumindo o formato fixo descrito
  no briefing (`Endereço: {logradouro}, {número} - {bairro}, {CIDADE}/{UF}
  CEP: {cep}`). Se o rótulo do nome do cliente no orçamento real não for
  `Cliente:`, ajuste `backend/app/infrastructure/pdf/orcamento_regex_parser.py`.
- **Trocar de provedor de LLM**: basta mudar `LLM_PROVIDER` para `gemini`
  no `.env` e preencher `GEMINI_API_KEY` — a regra de negócio não muda,
  só a implementação por trás da interface (`ExtratorEnderecoLLMPort`).
