#!/bin/bash

echo "🐳 Sistema FAPES - Docker Setup Simples"
echo "========================================"

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker stop fapes-backend fapes-frontend 2>/dev/null || true
docker rm fapes-backend fapes-frontend 2>/dev/null || true

# Build das imagens
echo "🔨 Buildando imagens..."
echo "  📱 Frontend..."
docker build -t fapes-frontend . > /dev/null 2>&1
echo "  🔧 Backend..."
docker build -t fapes-backend ./django_backend > /dev/null 2>&1

# Iniciar containers
echo "🚀 Iniciando containers..."
echo "  🔧 Backend Django..."
docker run -d --name fapes-backend -p 8002:8000 fapes-backend

echo "  📱 Frontend Vue.js..."
docker run -d --name fapes-frontend -p 3001:80 fapes-frontend

# Aguardar inicialização
echo "⏳ Aguardando inicialização..."
sleep 5

# Executar migrações
echo "🔄 Executando migrações..."
docker exec fapes-backend python manage.py migrate > /dev/null 2>&1

# Criar superuser
echo "👤 Criando superuser..."
docker exec fapes-backend python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('✅ Superuser admin criado')
else:
    print('✅ Superuser admin já existe')
" > /dev/null 2>&1

# Verificar status
echo "📊 Verificando status..."
BACKEND_STATUS=$(docker ps --filter "name=fapes-backend" --format "table {{.Status}}" | tail -n +2)
FRONTEND_STATUS=$(docker ps --filter "name=fapes-frontend" --format "table {{.Status}}" | tail -n +2)

echo ""
echo "🎉 Sistema FAPES iniciado com sucesso!"
echo ""
echo "📱 URLs de Acesso:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:8002"
echo "   Admin Django: http://localhost:8002/admin"
echo ""
echo "🔐 Credenciais:"
echo "   Usuário: admin"
echo "   Senha: admin123"
echo ""
echo "📊 Status dos Containers:"
echo "   Backend: $BACKEND_STATUS"
echo "   Frontend: $FRONTEND_STATUS"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs backend: docker logs fapes-backend"
echo "   Ver logs frontend: docker logs fapes-frontend"
echo "   Parar tudo: docker stop fapes-backend fapes-frontend"
echo "   Remover tudo: docker rm fapes-backend fapes-frontend"
echo ""
echo "✅ Sistema pronto para uso!"