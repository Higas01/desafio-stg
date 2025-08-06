# STG Catalog Challenge 🛒

Um sistema completo de e-commerce moderno desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## 🚀 Características

### Funcionalidades Principais

- ✅ **Catálogo de Produtos**: Visualização responsiva com grid adaptativo
- ✅ **Autenticação**: Sistema completo de login/registro com Supabase Auth
- ✅ **Carrinho de Compras**: Gerenciamento de estado em tempo real
- ✅ **Integração WhatsApp**: Finalização de pedidos via WhatsApp
- ✅ **Busca e Filtros**: Pesquisa por nome/descrição e filtro por categoria
- ✅ **Modo Escuro**: Toggle de tema com persistência
- ✅ **Responsividade**: Design totalmente responsivo para todos os dispositivos

### Tecnologias Utilizadas

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Estilização**: Tailwind CSS com design system personalizado
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Gerenciamento de Estado**: React Context + Hooks personalizados
- **Formulários**: React Hook Form + Zod validation
- **Ícones**: Lucide React
- **Notificações**: React Hot Toast
- **Animações**: CSS animations personalizadas
- **Testes**: Jest + Testing Library

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório

```bash
git clone <repository-url>
cd stg-catalog-challenge
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### 4. Configure o banco de dados Supabase

Execute os seguintes SQL commands no Supabase SQL Editor:

```sql

-- Criar tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de itens do carrinho
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  whatsapp_message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, image, category, stock) VALUES
('Smartphone Galaxy S24', 'Smartphone premium com câmera de 200MP e 256GB de armazenamento', 2499.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Eletrônicos', 15),
('Notebook Gamer RTX', 'Notebook gamer com RTX 4060, 16GB RAM e SSD 512GB', 4999.99, 'https://images.unsplash.com/photo-1525373612132-b3e820b87cea?w=500', 'Eletrônicos', 8),
('Fone Bluetooth Premium', 'Fone de ouvido com cancelamento de ruído ativo', 799.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Áudio', 25),
('Smartwatch Fitness', 'Relógio inteligente com monitor cardíaco e GPS', 1299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Wearables', 12),
('Câmera Mirrorless 4K', 'Câmera profissional com gravação 4K e lente 18-55mm', 3499.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', 'Fotografia', 6),
('Tablet Pro 12"', 'Tablet profissional com tela OLED e suporte à caneta', 2999.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'Eletrônicos', 10);

-- Criar políticas RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para cart_items
CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart items" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart items" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Políticas para orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para products (leitura pública)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
```

### 5. Execute o projeto

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:3000`

## 📱 Como Usar

### Para Usuários

1. **Navegação**: Explore o catálogo de produtos na página inicial
2. **Busca**: Use a barra de pesquisa para encontrar produtos específicos
3. **Filtros**: Filtre produtos por categoria
4. **Autenticação**: Clique em "Entrar" para criar uma conta ou fazer login
5. **Carrinho**: Adicione produtos ao carrinho (necessário estar logado)
6. **Finalização**: Finalize a compra via WhatsApp com todos os detalhes

### Para Desenvolvedores

1. **Estrutura**: O projeto segue a arquitetura App Router do Next.js 14
2. **Componentes**: Componentes reutilizáveis em `/src/components`
3. **Contextos**: Estado global gerenciado via React Context
4. **Hooks**: Hooks personalizados para lógica reutilizável
5. **Tipos**: Tipagem completa com TypeScript
6. **Testes**: Testes unitários com Jest

## 🗂️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── AuthModal.tsx      # Modal de autenticação
│   ├── CartModal.tsx      # Modal do carrinho
│   ├── Header.tsx         # Cabeçalho
│   ├── LoadingSpinner.tsx # Spinner de carregamento
│   ├── ProductCard.tsx    # Card de produto
│   └── ProductGrid.tsx    # Grid de produtos
├── contexts/              # React Contexts
│   ├── AuthContext.tsx    # Contexto de autenticação
│   └── CartContext.tsx    # Contexto do carrinho
├── hooks/                 # Hooks personalizados
│   ├── useCommon.ts       # Hooks utilitários
│   └── useProducts.ts     # Hook de produtos
├── services/              # Serviços externos
│   ├── supabase.ts        # Configuração Supabase
│   └── whatsapp.ts        # Integração WhatsApp
├── types/                 # Tipos TypeScript
│   └── index.ts           # Definições de tipos
└── utils/                 # Funções utilitárias
    └── index.ts           # Utilitários gerais
```

## 🧪 Testes

Execute os testes:

```bash
npm test
# ou
yarn test
```

Para executar em modo watch:

```bash
npm run test:watch
# ou
yarn test:watch
```

## 📦 Build para Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 🔧 Personalização

### Adicionando Novos Produtos

1. Acesse o painel do Supabase
2. Vá para a tabela `products`
3. Adicione novos registros ou use a API

### Configurando WhatsApp

1. Altere `NEXT_PUBLIC_WHATSAPP_NUMBER` no `.env.local`
2. Use o formato internacional (5511999999999)

### Customizando Tema

1. Edite as cores em `tailwind.config.js`
2. Modifique as variáveis CSS em `globals.css`

## 🛡️ Segurança

- ✅ Row Level Security (RLS) habilitado no Supabase
- ✅ Validação de formulários com Zod
- ✅ Sanitização de dados
- ✅ Políticas de acesso por usuário
- ✅ Headers de segurança do Next.js

## 📈 Performance

- ✅ Server-Side Rendering (SSR)
- ✅ Otimização de imagens com Next.js Image
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ Bundle analysis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@example.com] ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para o STG Catalog Challenge**
