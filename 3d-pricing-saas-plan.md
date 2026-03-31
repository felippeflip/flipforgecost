# PRD & Architectural Plan: SaaS 3D Printing Pricing

## 1. Contexto & Regras de Negócio
SaaS para precificação na impressão 3D (multi-tenant simples via `user_id`).
Componentes para gerenciar configurações, filamentos, insumos, clientes e geração de orçamentos (Quotes).

## 2. Banco de Dados
- **Users**: Modificações mínimas (autenticação baseada no Breeze).
- **User Settings**: Parâmetros globais por usuário (Energia, Depreciação, etc).
- **Clientes (Clients)**: Cadastro de clientes.
- **Insumos (Consumables)**: Extras como tintas, caixas, colas.
- **Filamentos (Filaments)**: O material principal com cálculo de custo por grama.
- **Orçamentos (Quotes)**: Core do sistema. Armazena tempos, pesos e realiza os cálculos.
- **Quote Consumables**: Pivô para N:N de orçamentos com insumos extras.

## 3. Topologia e Layout Front-End
- **Sidebar**: Infinita, colapsável, fundo escuro/sólido.
- **Top Bar**: Título e info de perfil.
- **Página de Quote**: Split 90/10 com inputs precisos de um lado e um "recibo vivo" fixo no canto da tela (sem Bento grids chatos, visual industrial).

## 4. Segurança
- Validações rígidas no FormRequest.
- Sanity Check via Policies do Laravel para impedir vazamento entre usuários SaaS.
- CSRF Token do Inertia e Escaping do React.
