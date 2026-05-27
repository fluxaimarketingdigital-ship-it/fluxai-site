# MAPA DE ESTRUTURA DO GOOGLE DRIVE — FluxAI OS™
## Diretrizes de Armazenamento e Organização de Arquivos Pesados

---

## 1. Diretriz Geral de Arquivos
O banco de dados Google Sheets e o banco do Supabase gratuito são mantidos **leves** por design. Todo arquivo pesado de mídia (imagens brutas, vídeos, PSDs/AIs, PDFs de contratos assinados, apresentações e relatórios de métricas) deve ser armazenado exclusivamente no **Google Drive** institucional.
As tabelas do OS conterão apenas os links diretos para essas pastas e arquivos.

---

## 2. Estrutura Oficial de Pastas (Hierarquia)
Toda nova conta de cliente criada via webhook `CLIENT_ONBOARDING` do Make.com terá a seguinte árvore de diretórios gerada automaticamente:

```
[FluxAI OS - CLIENTES]
  │
  └─── [CLI_XXXX_001] - Nome Comercial do Cliente/
         │
         ├─── 01_Contrato/
         │      └─── Contrato_Assinado_CLI_XXXX_001.pdf
         │
         ├─── 02_Identidade_Visual/
         │      ├─── Logos/
         │      │      ├─── Logo_Principal.png
         │      │      └─── Logo_Secundaria.png
         │      ├─── Manual_da_Marca.pdf
         │      └─── Fontes_e_Paleta/
         │
         ├─── 03_Criativos_Brutos/
         │      ├─── Fotos/
         │      └─── Videos/
         │
         ├─── 04_Entregas/
         │      ├─── Mes_1/
         │      │      ├─── Post_01_Video.mp4
         │      │      └─── Post_02_Carrossel.zip
         │      └─── Mes_2/
         │
         ├─── 05_Referencias/
         │      ├─── Prints_Concorrentes/
         │      └─── Textos_De_Apoio/
         │
         ├─── 06_Relatorios/
         │      └─── Relatorio_Consolidado_Mes_1.pdf
         │
         └─── 07_Arquivos_Internos/
                └─── (Apenas leitura para equipe interna - não compartilhado com cliente)
```

---

## 3. Descrição das Pastas e Conteúdo

### `01_Contrato/`
*   **Conteúdo:** Contrato assinado juridicamente em formato PDF.
*   **Permissão:** Acesso de leitura para o Cliente e ADMIN.

### `02_Identidade_Visual/`
*   **Conteúdo:** Logo principal e variações em alta definição (vetorial, fundo transparente), manual de identidade da marca e guia de paleta de cores.
*   **Permissão:** Acesso total para o Operador (designer) e leitura para o Cliente.

### `03_Criativos_Brutos/`
*   **Conteúdo:** Fotos de sessões de branding do cliente, filmagens brutas de produtos, e arquivos brutos não editados enviados para a produção.
*   **Permissão:** Acesso de gravação para o Cliente (enviar mídias) e gravação para a agência.

### `04_Entregas/`
*   **Conteúdo:** Mídias finalizadas prontas para a postagem (organizadas por mês/ciclo).
*   **Uso:** É desta pasta que o operador baixa as mídias durante o fluxo de **Publicação Assistida Manual**.
*   **Permissão:** Acesso total para a equipe da agência.

### `05_Referencias/`
*   **Conteúdo:** Ideias de posts, criativos de inspiração comercial, e documentos textuais de briefing complementar fornecidos pelo cliente.

### `06_Relatorios/`
*   **Conteúdo:** Versões em PDF exportadas dos relatórios mensais de métricas.
*   **Permissão:** Acesso de leitura para o Cliente.

### `07_Arquivos_Internos/`
*   **Conteúdo:** Custos de freelancers, anotações estratégicas de reuniões internas da equipe, e cronogramas brutos.
*   **Permissão:** **Restrito à equipe FluxAI**. A pasta pai é compartilhada com o cliente, mas esta pasta específica tem a herança de compartilhamento quebrada e é restrita aos e-mails dos operadores e ADMIN.

---

## 4. Regras de Compartilhamento e Nomenclatura
1.  **Nomenclatura:** Todos os arquivos de mídia de entrega devem seguir o padrão: `CLI_XXXX_001_ANO_MES_POST_XX.mp4` ou `.png`.
2.  **Permissões:** O cliente é convidado para a pasta raiz `[CLI_XXXX_001] - Nome Comercial` com o nível de permissão "Editor" (para que possa subir mídias na pasta `Criativos_Brutos`). No entanto, a pasta `07_Arquivos_Internos` tem a permissão removida para o e-mail do cliente.
3.  **Links Públicos:** Fica expressamente proibida a criação de links com a opção "Qualquer pessoa com o link pode editar" para evitar vazamento ou deleção acidental de propriedade intelectual da agência.
