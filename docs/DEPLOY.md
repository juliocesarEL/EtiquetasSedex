# Deploy — servidor interno BWR

Notas operacionais do ambiente de produção real (máquina interna da empresa). Não é necessário pra rodar o projeto localmente — veja o `README.md` principal para isso.

## Por que Serviço do Windows (NSSM) em vez de PM2

O outro sistema interno da empresa (`bwr_fix`) roda com PM2, então essa foi a primeira tentativa aqui também. Não funcionou bem: no Windows, o PM2 não esconde a janela de console de processos que não são Node — como é o caso do Python/uvicorn — resultando em uma janela de terminal abrindo e fechando repetidamente.

A solução foi rodar como **Serviço do Windows de verdade**, via [NSSM](https://nssm.cc/). Um serviço do Windows roda na Sessão 0 (não-interativa), então nunca tem janela de console associada, e inicia no boot da máquina sob a conta `LocalSystem` — não depende de nenhum usuário fazer login.

## Configuração atual

- **Nome do serviço:** `SedexEtiquetas` (nome de exibição: "BWR - Etiquetas SEDEX")
- **Porta:** `3002` — as portas `3000` e `3001` já são usadas por outros sistemas internos (`bwr-controle` via PM2 e `estoque-bwr-app`) na mesma máquina.
- **Início:** automático, `LocalSystem`
- **Logs:** `logs/service-out.log` e `logs/service-error.log` (com rotação em 5MB)

## Atualizar o sistema em produção

O binário estático do frontend (`frontend/dist`) é servido diretamente pelo backend — atualizar arquivos ali **não exige reiniciar o serviço**, só reiniciar quando o código Python muda.

Como Administrador (clique direito → "Executar como administrador"):

```bash
deploy.bat
```

Isso gera o build novo do frontend e reinicia o serviço via NSSM.

## Gerenciar o serviço

```bash
# como Administrador
nssm status SedexEtiquetas
nssm restart SedexEtiquetas
nssm stop SedexEtiquetas
```

Ou pela interface gráfica: `services.msc` → "BWR - Etiquetas SEDEX".

## Reinstalar do zero

Se precisar recriar o serviço (nova máquina, por exemplo):

```powershell
$nssm = "caminho\para\nssm.exe"
$python = "caminho\para\backend\venv\Scripts\python.exe"

& $nssm install SedexEtiquetas $python
& $nssm set SedexEtiquetas AppParameters "-m uvicorn app.presentation.main:app --host 0.0.0.0 --port 3002"
& $nssm set SedexEtiquetas AppDirectory "caminho\para\backend"
& $nssm set SedexEtiquetas AppStdout "caminho\para\logs\service-out.log"
& $nssm set SedexEtiquetas AppStderr "caminho\para\logs\service-error.log"
& $nssm set SedexEtiquetas Start SERVICE_AUTO_START
& $nssm start SedexEtiquetas
```

## Acesso

Não precisa de HTTPS ou domínio — uso restrito à rede interna: `http://IP_DO_SERVIDOR:3002`.
