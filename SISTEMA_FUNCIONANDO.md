# ✅ Sistema Funcionando

## Status Atual
- ✅ Frontend rodando em: **http://localhost:5175/**
- ✅ Backend Django rodando em: **http://localhost:8000/**
- ✅ Banco de dados configurado e populado
- ✅ API funcionando corretamente
- ✅ Menu de Acessibilidade implementado e funcionando

## Credenciais de Acesso

### Usuário Admin
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** admin@example.com

### Usuário de Teste
- **Username:** `testuser`
- **Password:** `testpass123`
- **Email:** test@example.com

## URLs Importantes

### Frontend
- Home: http://localhost:5175/
- Login: http://localhost:5175/login
- Gestão de Editais: http://localhost:5175/management
- Métricas: http://localhost:5175/metrics
- Histórico: http://localhost:5175/history

### Backend API
- Admin Django: http://localhost:8000/admin/
- API Root: http://localhost:8000/api/
- Login: http://localhost:8000/api/auth/login/
- Editais: http://localhost:8000/api/editals/
- Métricas: http://localhost:8000/api/metrics/engagement/
- Mensagens: http://localhost:8000/api/metrics/messages/
- Histórico: http://localhost:8000/api/history/conversations/

## Como Usar

### 1. Acessar o Sistema
1. Abra o navegador em: http://localhost:5175/
2. Faça login com as credenciais acima
3. Navegue pelas páginas disponíveis

### 2. Testar a API Diretamente

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Buscar métricas (com token)
TOKEN="seu_token_aqui"
curl http://localhost:8000/api/metrics/engagement/ \
  -H "Authorization: Bearer $TOKEN"

# Listar editais (com token)
curl http://localhost:8000/api/editals/ \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Parar os Servidores

```bash
# Parar frontend (Ctrl+C no terminal onde está rodando)
# Ou matar o processo:
pkill -f "vite"

# Parar backend Django
pkill -f "manage.py runserver"
```

### 4. Reiniciar os Servidores

```bash
# Frontend
npm run dev

# Backend
cd django_backend
source venv/bin/activate
python manage.py runserver
```

## Configuração

### Variáveis de Ambiente (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

### Django Settings
- Debug: True
- CORS habilitado para localhost:5173, 5174, 5175
- JWT Authentication configurado
- SQLite database

## Dados de Teste

O sistema já possui:
- 2 usuários (admin e testuser)
- 10 editais cadastrados
- 290 mensagens de teste
- 10 usuários únicos nas conversas
- Métricas de engajamento populadas

## Próximos Passos

1. ✅ Sistema funcionando
2. ✅ Autenticação configurada
3. ✅ API integrada
4. ✅ Dados de teste populados
5. 🔄 Testar todas as funcionalidades no navegador
6. 🔄 Verificar responsividade
7. 🔄 Ajustar estilos se necessário

## Troubleshooting

### Frontend não carrega
- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se a variável `VITE_API_BASE_URL` está configurada
- Reinicie o servidor com `npm run dev`

### Backend não responde
- Verifique se o Django está rodando: `ps aux | grep manage.py`
- Verifique se a porta 8000 está livre: `lsof -i :8000`
- Reinicie o servidor: `python manage.py runserver`

### Erro de autenticação
- Verifique se as credenciais estão corretas
- Limpe o localStorage do navegador
- Tente fazer login novamente

### CORS Error
- Verifique se o CORS está configurado no Django
- Verifique se a URL do frontend está na lista de origens permitidas
- Reinicie o backend Django
