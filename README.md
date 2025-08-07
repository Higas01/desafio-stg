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

**Qualidade & Testes**

- Jest + Testing Library
- TypeScript strict mode
- Error boundaries
- Sistema de logs mockado

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

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# WhatsApp (formato: 5511999999999)
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999

```

### 4. Configure o banco de dados Supabase

Execute os seguintes comandos SQL no Supabase SQL Editor:

```sql
-- Criar tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de itens do carrinho
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  whatsapp_message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, image_url, category) VALUES
('iPhone 15 Pro', 'Smartphone Apple com chip A17 Pro, câmera de 48MP e 256GB', 8999.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Smartphones'),
('MacBook Pro M3', 'Notebook Apple com chip M3, 16GB RAM e SSD 512GB', 15999.99, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 'Computadores'),
('AirPods Pro 2', 'Fone de ouvido com cancelamento ativo de ruído', 2499.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Áudio'),
('Apple Watch Ultra', 'Smartwatch resistente com GPS e monitor cardíaco', 7999.99, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500', 'Wearables'),
('iPad Pro 12.9"', 'Tablet profissional com tela Liquid Retina XDR', 9999.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'Tablets'),
('Canon EOS R5', 'Câmera mirrorless profissional com gravação 8K', 18999.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', 'Câmeras'),
('Sony WH-1000XM5', 'Headphone premium com cancelamento de ruído', 1799.99, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', 'Áudio'),
('Samsung Galaxy S24 Ultra', 'Smartphone Android com S Pen e câmera de 200MP', 7999.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Smartphones'),
('Dell XPS 15', 'Notebook premium com tela 4K OLED e RTX 4060', 12999.99, 'https://images.unsplash.com/photo-1525373612132-b3e820b87cea?w=500', 'Computadores'),
('Bose QuietComfort 45', 'Headphone confortável para uso prolongado', 1299.99, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', 'Áudio'),
('GoPro Hero 12', 'Câmera de ação com gravação 5.3K e estabilização', 2799.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', 'Câmeras'),
('Surface Pro 9', 'Tablet 2-em-1 da Microsoft com tela touchscreen', 6999.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'Tablets');

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Produtos são públicos (todos podem ver)
CREATE POLICY "Produtos são públicos" ON products
  FOR SELECT USING (true);

-- Carrinho: usuários só veem/modificam seus próprios itens
CREATE POLICY "Usuários veem próprio carrinho" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários modificam próprio carrinho" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Pedidos: usuários só veem seus próprios pedidos
CREATE POLICY "Usuários veem próprios pedidos" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários criam próprios pedidos" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Execute o projeto

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

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# WhatsApp (formato: 5511999999999)
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999

```

### 3. Inicialize o container:

```bash
docker compose up
```

### 4. Configure o banco de dados Supabase

Execute os seguintes comandos SQL no Supabase SQL Editor:

```sql
-- Criar tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de itens do carrinho
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  whatsapp_message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, image_url, category) VALUES
('iPhone 15 Pro', 'Smartphone Apple com chip A17 Pro, câmera de 48MP e 256GB', 8999.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Smartphones'),
('MacBook Pro M3', 'Notebook Apple com chip M3, 16GB RAM e SSD 512GB', 15999.99, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 'Computadores'),
('AirPods Pro 2', 'Fone de ouvido com cancelamento ativo de ruído', 2499.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Áudio'),
('Apple Watch Ultra', 'Smartwatch resistente com GPS e monitor cardíaco', 7999.99, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500', 'Wearables'),
('iPad Pro 12.9"', 'Tablet profissional com tela Liquid Retina XDR', 9999.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'Tablets'),
('Canon EOS R5', 'Câmera mirrorless profissional com gravação 8K', 18999.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', 'Câmeras'),
('Sony WH-1000XM5', 'Headphone premium com cancelamento de ruído', 1799.99, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', 'Áudio'),
('Samsung Galaxy S24 Ultra', 'Smartphone Android com S Pen e câmera de 200MP', 7999.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Smartphones'),
('Dell XPS 15', 'Notebook premium com tela 4K OLED e RTX 4060', 12999.99, 'https://images.unsplash.com/photo-1525373612132-b3e820b87cea?w=500', 'Computadores'),
('Bose QuietComfort 45', 'Headphone confortável para uso prolongado', 1299.99, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', 'Áudio'),
('GoPro Hero 12', 'Câmera de ação com gravação 5.3K e estabilização', 2799.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', 'Câmeras'),
('Surface Pro 9', 'Tablet 2-em-1 da Microsoft com tela touchscreen', 6999.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'Tablets');

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Produtos são públicos (todos podem ver)
CREATE POLICY "Produtos são públicos" ON products
  FOR SELECT USING (true);

-- Carrinho: usuários só veem/modificam seus próprios itens
CREATE POLICY "Usuários veem próprio carrinho" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários modificam próprio carrinho" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Pedidos: usuários só veem seus próprios pedidos
CREATE POLICY "Usuários veem próprios pedidos" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários criam próprios pedidos" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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
