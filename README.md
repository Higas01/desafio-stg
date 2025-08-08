# STG Catalog Challenge 🛒

Um sistema completo de e-commerce moderno desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Supabase, criado com assistência de IA para demonstrar as melhores práticas de desenvolvimento full-stack.

## 🤖 Desenvolvimento com IA

Este projeto foi desenvolvido utilizando **GitHub Copilot** (Claude Sonnet 4) como ferramenta principal de assistência ao desenvolvimento, complementado pelo **ChatGPT** para esclarecimentos técnicos específicos. A combinação dessas ferramentas de IA

### Arquivo de Instruções Personalizadas

Foi criado um arquivo `.github/copilot-instructions.md` com as instruções base para o github copilot que define:

- Padrões de código e arquitetura
- Tecnologias e bibliotecas utilizadas
- Estrutura de pastas e componentes
- Funcionalidades e requisitos específicos

## 🚀 Características

### ✅ Funcionalidades Implementadas

**Autenticação Completa**

- Login/registro com email e senha
- Proteção de rotas com middleware
- Logout com redirecionamento automático
- Integração com Supabase Auth

**Catálogo Inteligente**

- Grid responsivo com 12+ produtos
- Busca avançada por nome/descrição
- Filtros por categoria dinâmicos
- Visualização detalhada de produtos

**Carrinho Avançado**

- Gerenciamento de estado em tempo real
- Persistência local para usuários não autenticados
- Sincronização automática ao fazer login
- Controle de quantidades com validação
- Loading states para todas as ações

**Integração WhatsApp**

- Geração automática de mensagem formatada
- Link wa.me com deep linking
- Limpeza do carrinho pós-envio
- Histórico de pedidos

**Experiência do Usuário**

- Design responsivo (mobile/tablet/desktop)
- Modo escuro com persistência
- Animações suaves e feedback visual
- Loading states em todas as interações
- Tratamento de erros robusto

### 🛠️ Stack Tecnológica

**Frontend**

- Next.js 14 (App Router) + React 18
- TypeScript para type safety
- Tailwind CSS para estilização
- Lucide React para ícones

**Backend & Database**

- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS)
- Real-time subscriptions
- Políticas de acesso granular

**Gerenciamento de Estado**

- React Context API
- Custom hooks para lógica reutilizável
- React Query para cache de dados
- localStorage para persistência

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm/yarn
- Conta no Supabase

## Rode localmente (sem docker)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/stg-catalog-challenge.git
cd stg-catalog-challenge
```

### 2. Instale as dependências

```bash
pnpm install
# ou
npm install
```

### 3. Execute o projeto

```bash
pnpm dev
# ou
npm run dev
```

Acesse `http://localhost:3000` 🎉

## Rode localmente (com docker)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/stg-catalog-challenge.git
cd stg-catalog-challenge
```


### 2. Inicialize o container:

```bash
docker compose up
```

## 📁 Estrutura do Projeto

````
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Rotas de autenticação
│   │   ├── login/          # Página de login
│   │   └── register/       # Página de registro
│   ├── carrinho/           # Página do carrinho
│   ├── pedidos/            # Histórico de pedidos
│   ├── produtos/           # Catálogo de produtos
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout raiz
│   └── page.tsx            # Página inicial
├── components/             # Componentes reutilizáveis
│   ├── Auth/              # Componentes de autenticação
│   ├── Cart/              # Componentes do carrinho
│   ├── Orders/            # Componentes de pedidos
│   ├── Products/          # Componentes de produtos
│   ├── ui/                # Componentes de UI básicos
│   ├── Header.tsx         # Cabeçalho da aplicação
│   ├── LoadingSpinner.tsx # Loading spinner
│   └── ProtectedRoute.tsx # Proteção de rotas
├── contexts/              # React Contexts
│   ├── AuthContext.tsx    # Gerenciamento de autenticação
│   └── CartContext.tsx    # Gerenciamento do carrinho
├── handler/               # Error handlers
│   └── AppError.ts        # Classe de erro customizada
├── hooks/                 # Hooks personalizados
│   ├── useThrottle.ts     # Hook para throttling
│   └── useProtectedRoute.ts # Hook para rotas protegidas
├── http/services/         # Serviços de API
│   ├── auth.service.ts    # Serviços de autenticação
│   ├── cart.service.ts    # Serviços do carrinho
│   ├── order.service.ts   # Serviços de pedidos
│   └── product.service.ts # Serviços de produtos
├── middleware/            # Middleware do Next.js
│   └── middleware.ts      # Proteção de rotas server-side
├── services/              # Configurações de serviços
│   ├── log.service.ts     # Serviço de logging mockado
│   └── whatsapp.service.ts # Integração WhatsApp
├── types/                 # Definições TypeScript
│   └── index.ts           # Tipos principais
├── utils/supabase/        # Configuração Supabase
│   └── supabase.ts        # Cliente Supabase

### Para Usuários Finais

1. **🏠 Página Inicial**: Navegue pelo catálogo de produtos
2. **🔍 Busca**: Use a barra de pesquisa para encontrar produtos
3. **🏷️ Filtros**: Filtre produtos por categoria
4. **👤 Autenticação**: Crie uma conta ou faça login
5. **🛒 Carrinho**: Adicione produtos e gerencie quantidades
6. **📱 WhatsApp**: Finalize pedidos via WhatsApp
7. **📋 Histórico**: Visualize pedidos anteriores na área logada

### Para Desenvolvedores

1. **🏗️ Arquitetura**: App Router do Next.js 14 com TypeScript
2. **🔧 Componentes**: Sistema de design consistente
3. **🗃️ Estado**: Context API para gerenciamento global
4. **🎣 Hooks**: Lógica reutilizável encapsulada
5. **🛡️ Tipos**: Tipagem completa com TypeScript
6. **🧪 Testes**: Cobertura abrangente de testes

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Executar em desenvolvimento
pnpm build                  # Build para produção
pnpm start                  # Executar build de produção
pnpm lint                   # Executar linter
pnpm type-check             # Verificar tipos TypeScript

# Testes
pnpm test                   # Executar testes
pnpm test:watch             # Testes em modo watch
pnpm test:coverage          # Relatório de cobertura

# Utilitários
pnpm clean                  # Limpar cache e node_modules
pnpm analyze                # Analisar bundle size
````

## 🛡️ Segurança

- ✅ **Row Level Security (RLS)** habilitado no Supabase
- ✅ **Middleware de autenticação** para proteção de rotas
- ✅ **Validação de dados** com TypeScript e Zod
- ✅ **Sanitização** de inputs do usuário
- ✅ **Headers de segurança** configurados
- ✅ **Políticas de acesso** granulares no banco

## 📈 Performance

- ✅ **Code splitting** automático do Next.js
- ✅ **Lazy loading** de componentes pesados
- ✅ **Otimização de imagens** com Next.js Image
- ✅ **Cache** inteligente com React Query
- ✅ **Bundle analysis** para monitorar tamanho
- ✅ **Loading states** para melhor UX

## 🎨 Customização

### Tema e Cores

Edite as cores em `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        secondary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
};
```

### WhatsApp

Configure seu número no `.env.local`:

```env
# Formato internacional (código país + DDD + número)
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Fork este repositório
2. Conecte com Vercel
3. Configure as variáveis de ambiente
4. Deploy automático! ✨

### Outras Plataformas

O projeto é compatível com:

- Netlify
- Railway
- AWS Amplify
- Heroku

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/MinhaFeature
   ```
3. **Commit** suas mudanças:
   ```bash
   git commit -m 'feat: Adiciona nova feature incrível'
   ```
4. **Push** para a branch:
   ```bash
   git push origin feature/MinhaFeature
   ```
5. Abra um **Pull Request**

### Convenções

- ✅ Commits seguindo [Conventional Commits](https://conventionalcommits.org/)
- ✅ Código formatado com Prettier
- ✅ Linting com ESLint
- ✅ Testes para novas features
- ✅ TypeScript strict

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvido com IA

Este projeto foi desenvolvido utilizando:

- **🤖 GitHub Copilot**: Ferramenta principal para geração de código
- **💬 ChatGPT**: Suporte técnico e esclarecimentos
- **📝 Instruções personalizadas**: Arquivo `.github/copilot-instructions.md`

A combinação dessas ferramentas resultou em um desenvolvimento mais eficiente e código de alta qualidade.

### Observação

- Todo código gerado pela IA, foi revisado.

  **Desenvolvido com ❤️ e IA** | **Higor** | Janeiro 2025
