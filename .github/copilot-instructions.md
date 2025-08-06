## Projeto Overview

PROJETO: stg-catalog-challenge
OBJETIVO: Sistema completo de e-commerce com autenticação e integração WhatsApp

## Bibliotecas e Frameworks

React, Next.js, TypesScript, Tailwind para o frontend.
Supabase para armazenamento e autenticação.
pnpm para gerenciamento de pacotes.

## Estilo de UI

Estilo e-commerce moderno
Cores profissionais (verde/azul)
Responsivo (mobile/tablet/desktop)
Loading states + feedback visual
Ícones: Lucide React/Heroicons

## Estrutura do Projeto

src/
├── components/ # Componentes reutilizáveis
├── handler/ # Error handler para tratemento de erro no Next.js
├── styles/ # Estilos globais e específicos
├── utils/ # Funções utilitárias
├── hooks/ # Hooks personalizados
├── middleware/ # Middleware de rota
├── contexts/ # Contextos React para estado global
├── http/services/ # Serviços de API e integração
├── validators/ # Validação de dados e formulários
├── types/ # Tipos TypeScript
└── assets/ # Imagens, ícones e outros recursos
└── tests/ # Testes unitários automatizados

### Estrutura tabelas supabase

products: id, name, description, price, image_url, category
cart_items: id, user_id, product_id, quantity
users: Supabase Auth automático

## Funcionalidades Principais

Autenticação:
✅ Login/registro com email
✅ Proteção de rotas
✅ Logout funcional
✅ Supabase Auth automático

Catálogo:
✅ Grid responsivo com 12+ produtos
✅ Busca/filtro por nome
✅ Visualização detalhada
✅ Adicionar ao carrinho

Carrinho:
✅ Lista de produtos
✅ Editar quantidades
✅ Finalizar via WhatsApp

WhatsApp Integration:
✅ Gerar mensagem formatada
✅ Link wa.me automático
✅ Limpar carrinho pós-envio

Histórico de pedidos
Filtros avançados
Dark mode
PWA
Testes unitários
Animações suaves
