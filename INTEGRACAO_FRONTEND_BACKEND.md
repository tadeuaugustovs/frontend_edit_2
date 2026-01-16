# 🔗 Integração Frontend Vue.js + Backend Django Local

## ✅ Status da Integração

O frontend Vue.js está agora totalmente integrado com o backend Django local mockado!

## 🚀 Servidores Rodando

### Backend Django
- **URL:** http://localhost:8002
- **Admin Panel:** http://localhost:8002/admin/
- **Credenciais:** 
  - Username: `admin`
  - Password: `admin123`

### Frontend Vue.js
- **URL:** http://localhost:5173
- **Porta:** 5173

## 🔧 Configurações Aplicadas

### 1. Arquivo `.env`
```env
VITE_API_BASE_URL=http://localhost:8002
VITE_USE_MOCK=false
```

### 2. Endpoints Atualizados

#### Autenticação (`src/common/api/auth.service.ts`)
- ✅ `POST /auth/login/` - Login com JWT
- ✅ `POST /auth/logout/` - Logout
- ✅ `POST /auth/refresh/` - Refresh token
- ✅ `GET /auth/me/` - Perfil do usuário

#### Editais (`src/modules/gestao-editais/services/edital.service.ts`)
- ✅ `GET /editals/` - Listar editais
- ✅ `POST /editals/` - Criar edital
- ✅ `GET /editals/{id}/` - Detalhes do edital
- ✅ `PUT /editals/{id}/` - Atualizar edital
- ✅ `DELETE /editals/{id}/` - Deletar edital

#### Histórico de Conversas (Novos endpoints implementados!)
- ✅ `GET /history/sessions/` - Listar sessões
- ✅ `GET /history/sessions/{id}/` - Detalhes da sessão
- ✅ `GET /history/sessions/search/` - Buscar sessões

### 3. Cliente API (`src/common/api/client.ts`)
- ✅ Interceptor de autenticação com Bearer token
- ✅ Refresh automático de tokens JWT
- ✅ Tratamento de erros 401/403
- ✅ Redirecionamento automático para login

## 📝 Como Usar

### 1. Fazer Login
1. Acesse http://localhost:5173
2. Faça login com:
   - Username: `admin`
   - Password: `admin123`

### 2. Gerenciar Editais
1. Vá para "Gestão de Editais"
2. Clique em "Novo Edital"
3. Preencha os campos:
   - Título
   - Descrição
   - Status (open/closed/draft)
   - Campos dinâmicos (metadata)
   - Arquivos (referências)
4. Clique em "Salvar"

### 3. Ver Editais no Admin Panel
1. Acesse http://localhost:8002/admin/
2. Login com `admin` / `admin123`
3. Vá para "Editals" → "Editals"
4. Veja os editais criados pelo frontend!

### 4. Ver Histórico de Conversas
1. No frontend, vá para "Histórico"
2. Veja as sessões de conversa
3. Clique em uma sessão para ver as mensagens

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação JWT
- Login com username/password
- Tokens JWT (access + refresh)
- Renovação automática de tokens
- Logout com invalidação de token

### ✅ Gestão de Editais
- Criar editais com metadata dinâmica
- Listar editais com paginação
- Editar editais existentes
- Deletar editais
- Upload de arquivos (referências)

### ✅ Histórico de Conversas
- Listar sessões de conversa
- Ver detalhes de sessão com mensagens
- Buscar sessões por email, data, edital
- Mensagens ordenadas cronologicamente

### ✅ CORS Configurado
- Frontend (localhost:5173) pode acessar Backend (localhost:8002)
- Credenciais permitidas
- Headers apropriados

## 🔍 Testando a Integração

### Via Frontend (Navegador)
1. Abra http://localhost:5173
2. Faça login
3. Crie um edital
4. Verifique no admin panel

### Via cURL
```bash
# 1. Login
curl -X POST "http://localhost:8002/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# 2. Listar editais (use o token do login)
curl -X GET "http://localhost:8002/api/editals/" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 3. Criar edital
curl -X POST "http://localhost:8002/api/editals/" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Edital Teste",
    "description": "Descrição do edital",
    "status": "open",
    "metadata": [{"key": "area", "value": "Tecnologia"}],
    "files": []
  }'
```

## 📊 Dados de Teste

O backend já possui alguns dados de teste:
- 2 usuários (admin, testuser)
- 2 editais de exemplo
- 2 sessões de conversa com mensagens

## 🐛 Troubleshooting

### Frontend não conecta ao backend
1. Verifique se o backend está rodando: http://localhost:8002/admin/
2. Verifique o arquivo `.env`: `VITE_API_BASE_URL=http://localhost:8002`
3. Reinicie o frontend: `Ctrl+C` e `npm run dev`

### Erro 401 (Não autorizado)
1. Faça logout e login novamente
2. Limpe o localStorage do navegador
3. Verifique se o token está sendo enviado (DevTools → Network)

### Erro CORS
1. Verifique as configurações CORS no Django (`django_backend/django_backend/settings.py`)
2. Certifique-se que `http://localhost:5173` está em `CORS_ALLOWED_ORIGINS`

### Editais não aparecem
1. Verifique se você está autenticado
2. Crie um edital pelo admin panel primeiro
3. Verifique o console do navegador para erros

## 🎉 Próximos Passos

1. ✅ Autenticação JWT - COMPLETO
2. ✅ CRUD de Editais - COMPLETO
3. ✅ Histórico de Conversas - COMPLETO
4. ⏳ Métricas e Analytics - Próximo
5. ⏳ Upload real de arquivos - Próximo
6. ⏳ Geração de dados mock - Próximo

## 📚 Documentação Adicional

- `README.md` - Documentação geral do projeto
- `.kiro/specs/django-backend-local/` - Especificações do backend
- `docs/` - Documentação técnica adicional

---

**Desenvolvido para FAPES** 🚀
