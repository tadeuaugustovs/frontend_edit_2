#!/bin/bash

# Script para rodar o sistema FAPES com Docker

echo "🐳 Iniciando Sistema FAPES com Docker..."

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Limpar imagens antigas (opcional)
echo "🧹 Limpando imagens antigas..."
docker-compose down --rmi all --volumes --remove-orphans 2>/dev/null || true

# Build e start dos containers
echo "🔨 Buildando e iniciando containers..."
docker-compose up --build -d

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 10

# Verificar status
echo "📊 Status dos containers:"
docker-compose ps

# Executar migrações no Django
echo "🔄 Executando migrações do Django..."
docker-compose exec backend python manage.py migrate

# Criar superuser se não existir
echo "👤 Verificando superuser..."
docker-compose exec backend python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('✅ Superuser admin criado')
else:
    print('✅ Superuser admin já existe')
"

echo ""
echo "🎉 Sistema FAPES iniciado com sucesso!"
echo ""
echo "📱 URLs de Acesso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8002"
echo "   Admin Django: http://localhost:8002/admin"
echo "   Nginx (Proxy): http://localhost:80"
echo ""
echo "🔐 Credenciais:"
echo "   Usuário: admin"
echo "   Senha: admin123"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs: docker-compose logs -f"
echo "   Parar: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""