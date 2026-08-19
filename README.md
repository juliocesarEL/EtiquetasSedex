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

## Deploy (servidor interno)

O backend serve tanto a API quanto o frontend já compilado — em produção
roda um único processo.

**Por que não PM2 (como o `bwr_fix`)?** Tentamos primeiro com PM2, mas no
Windows ele não esconde a janela de console de processos que não são
Node (como o Python) — o serviço ficava abrindo/fechando terminal sem
parar. A solução foi rodar como **Serviço do Windows de verdade**, via
[NSSM](https://nssm.cc/), que roda sem console nenhum por natureza e
também não depende de login de usuário pra iniciar (o PM2 no Windows só
reinicia no login; um serviço do Windows inicia no boot da máquina).

O serviço já está instalado e chama-se **`SedexEtiquetas`** (nome de
exibição "BWR - Etiquetas SEDEX"), com início automático.

**A cada atualização** (depois de alterar o código), rode como
Administrador (clique direito no arquivo → "Executar como administrador"):

```bash
deploy.bat
```

Isso gera o build novo do frontend (`frontend/dist`) e reinicia o serviço.

- **Porta:** 3002 (a 3000 e 3001 já são usadas pelo `bwr-controle` e pelo
  `estoque-bwr-app` nesta máquina).
- **Acesso pela rede interna:** `http://IP_DO_SERVIDOR:3002`
- **Logs:** `logs/service-out.log` e `logs/service-error.log`.
- **Gerenciar o serviço:** `services.msc` (interface gráfica) ou, como
  Administrador, `nssm status/start/stop/restart SedexEtiquetas`.
- **Não precisa de HTTPS/domínio** — é uso só na rede local, igual aos
  outros sistemas internos da BWR.

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
