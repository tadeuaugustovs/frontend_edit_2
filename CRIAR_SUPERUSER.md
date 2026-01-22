# 🔐 Criar Superusuário Django

## Comando para Criar Superusuário

Execute este comando no terminal:

```bash
# Ativar ambiente virtual
source django_backend/venv/bin/activate

# Criar superusuário interativamente
python django_backend/manage.py createsuperuser
```

Ou use este comando para criar automaticamente:

```bash
source django_backend/venv/bin/activate && python django_backend/manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='superadmin').exists():
    User.objects.create_superuser('superadmin', 'superadmin@fapes.com', 'superadmin123')
    print('✅ Superusuário criado com sucesso!')
    print('Username: superadmin')
    print('Password: superadmin123')
else:
    print('⚠️  Superusuário já existe')
EOF
```

## Credenciais do Superusuário

- **Username**: `superadmin`
- **Email**: `superadmin@fapes.com`
- **Password**: `superadmin123`

## Acessar Django Admin

1. Certifique-se que o Django está rodando: http://localhost:8000
2. Acesse: http://localhost:8000/admin/
3. Use as credenciais acima

## Verificar Usuários Existentes

```bash
source django_backend/venv/bin/activate && python django_backend/manage.py shell << EOF
from django.contrib.auth.models import User
print('\n📋 Usuários no sistema:')
for user in User.objects.all():
    print(f'  - {user.username} (staff: {user.is_staff}, superuser: {user.is_superuser})')
EOF
```

## Tornar Usuário Existente em Staff/Superuser

Se você já tem um usuário e quer torná-lo admin:

```bash
source django_backend/venv/bin/activate && python django_backend/manage.py shell << EOF
from django.contrib.auth.models import User
user = User.objects.get(username='admin')
user.is_staff = True
user.is_superuser = True
user.save()
print(f'✅ Usuário {user.username} agora é superusuário!')
EOF
```
