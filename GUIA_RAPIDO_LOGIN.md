# 🔐 Guia Rápido - Problema de Login

## ✅ Sistema Funcionando Agora

### Servidores Ativos:
- **Frontend**: http://localhost:5175/
- **Backend**: http://localhost:8000/

### Credenciais:
- **Username**: `admin`
- **Password**: `admin123`

## 🔧 Se o Login Não Funcionar

### 1. Verificar se o Backend está Rodando

```bash
# Verificar se o Django está respondendo
curl http://localhost:8000/api/auth/login/ -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Resposta esperada**: JSON com tokens `access` e `refresh`

### 2. Verificar se o Frontend está Conectado

Abra o console do navegador (F12) e procure por:
- ❌ Erros de CORS
- ❌ Erros de conexão (ERR_CONNECTION_REFUSED)
- ❌ Erros 404 ou 500

### 3. Verificar Variável de Ambiente

Arquivo `.env` na raiz do projeto deve conter:
```
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Reiniciar os Servidores

#### Backend Django:
```bash
# Parar processos antigos
pkill -f "manage.py runserver"

# Iniciar novo servidor
cd django_backend
source venv/bin/activate
python manage.py runserver
```

#### Frontend Vite:
```bash
# Parar (Ctrl+C no terminal)
# Iniciar
npm run dev
```

## 🐛 Problemas Comuns

### Erro: "Connection Refused"
**Causa**: Backend não está rodando
**Solução**: Inicie o Django (veja seção 4)

### Erro: "Invalid credentials"
**Causa**: Senha incorreta
**Solução**: Use `admin123` (não `admin`)

### Erro: "CORS Error"
**Causa**: Backend não permite requisições do frontend
**Solução**: Verifique `django_backend/django_backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
]
```

### Erro: "Network Error"
**Causa**: URL da API incorreta
**Solução**: Verifique o arquivo `.env` e reinicie o Vite

## 📝 Logs Úteis

### Ver logs do Django:
```bash
# Se iniciou com controlBashProcess
# Os logs aparecem automaticamente

# Se iniciou manualmente
# Veja o terminal onde rodou o comando
```

### Ver logs do Frontend:
- Abra o console do navegador (F12)
- Aba "Console"
- Procure por mensagens com 🔐 (login) ou ❌ (erros)

## ✅ Teste Rápido

1. Abra http://localhost:5175/login
2. Digite:
   - Username: `admin`
   - Password: `admin123`
3. Clique em "Entrar"
4. Deve redirecionar para a página inicial

## 🆘 Ainda Não Funciona?

Verifique:
1. ✅ Backend rodando na porta 8000
2. ✅ Frontend rodando na porta 5175
3. ✅ Arquivo `.env` existe e está correto
4. ✅ Não há erros no console do navegador
5. ✅ Não há erros no terminal do Django

Se tudo estiver OK e ainda não funcionar, limpe o cache:
```bash
# Limpar localStorage do navegador
# F12 > Application > Local Storage > Clear All

# Limpar cache do Vite
rm -rf node_modules/.vite
npm run dev
```
