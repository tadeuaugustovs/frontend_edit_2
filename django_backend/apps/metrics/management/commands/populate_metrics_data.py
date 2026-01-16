from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.editals.models import Edital
from apps.conversations.models import ConversationSession, Message
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Popula o banco de dados com dados mockados para métricas'

    def handle(self, *args, **kwargs):
        self.stdout.write('🚀 Iniciando população de dados...')
        
        # Criar editais se não existirem
        editais = self.create_editals()
        
        # Criar sessões de conversa
        sessions = self.create_conversation_sessions(editais)
        
        # Criar mensagens
        self.create_messages(sessions, editais)
        
        self.stdout.write(self.style.SUCCESS('✅ Dados mockados criados com sucesso!'))

    def create_editals(self):
        self.stdout.write('📝 Criando editais...')
        
        editais_data = [
            {
                'title': 'Edital FAPES 001/2024 - Pesquisa em IA',
                'description': 'Chamada pública para projetos de pesquisa em Inteligência Artificial',
                'status': 'open'
            },
            {
                'title': 'Edital FAPES 002/2024 - Inovação Tecnológica',
                'description': 'Apoio a projetos de inovação e desenvolvimento tecnológico',
                'status': 'open'
            },
            {
                'title': 'Edital FAPES 003/2024 - Sustentabilidade',
                'description': 'Projetos voltados para sustentabilidade e meio ambiente',
                'status': 'closed'
            },
            {
                'title': 'Edital FAPES 004/2024 - Saúde Pública',
                'description': 'Pesquisas aplicadas em saúde pública e epidemiologia',
                'status': 'open'
            },
            {
                'title': 'Edital FAPES 005/2024 - Educação',
                'description': 'Projetos de pesquisa em metodologias educacionais',
                'status': 'analyzing'
            },
        ]
        
        editais = []
        for data in editais_data:
            edital, created = Edital.objects.get_or_create(
                title=data['title'],
                defaults=data
            )
            editais.append(edital)
            if created:
                self.stdout.write(f'  ✓ Criado: {edital.title}')
        
        return editais

    def create_conversation_sessions(self, editais):
        self.stdout.write('💬 Criando sessões de conversa...')
        
        users_data = [
            ('joao.silva@example.com', 'user_001'),
            ('maria.santos@example.com', 'user_002'),
            ('pedro.oliveira@example.com', 'user_003'),
            ('ana.costa@example.com', 'user_004'),
            ('carlos.ferreira@example.com', 'user_005'),
            ('julia.almeida@example.com', 'user_006'),
            ('roberto.lima@example.com', 'user_007'),
            ('fernanda.rocha@example.com', 'user_008'),
        ]
        
        sessions = []
        base_date = datetime.now() - timedelta(days=30)
        
        for i in range(50):  # Criar 50 sessões
            email, user_id = random.choice(users_data)
            edital = random.choice(editais) if random.random() > 0.2 else None
            
            start_time = base_date + timedelta(
                days=random.randint(0, 30),
                hours=random.randint(8, 18),
                minutes=random.randint(0, 59)
            )
            
            session = ConversationSession.objects.create(
                user_id=user_id,
                user_email=email,
                edital=edital,
                start_time=start_time,
                end_time=start_time + timedelta(minutes=random.randint(5, 60)) if random.random() > 0.3 else None
            )
            sessions.append(session)
        
        self.stdout.write(f'  ✓ Criadas {len(sessions)} sessões')
        return sessions

    def create_messages(self, sessions, editals):
        self.stdout.write('📨 Criando mensagens...')
        
        user_messages = [
            'Olá, gostaria de saber mais sobre este edital',
            'Qual é o prazo de submissão?',
            'Quais são os requisitos para participar?',
            'Posso submeter mais de um projeto?',
            'Qual é o valor máximo de financiamento?',
            'Como funciona o processo de avaliação?',
            'Preciso ter vínculo institucional?',
            'Quais documentos são necessários?',
            'Há alguma restrição de área de pesquisa?',
            'Quando sai o resultado?',
        ]
        
        bot_messages = [
            'Olá! Estou aqui para ajudar com informações sobre o edital.',
            'O prazo de submissão está especificado no documento do edital.',
            'Os requisitos incluem vínculo institucional e projeto de pesquisa.',
            'Sim, você pode submeter múltiplos projetos.',
            'O valor máximo varia de acordo com a modalidade do projeto.',
            'A avaliação é feita por comitê de especialistas.',
            'Sim, é necessário vínculo com instituição de pesquisa.',
            'Os documentos necessários estão listados no edital.',
            'Não há restrições, desde que alinhado aos objetivos do edital.',
            'O resultado será divulgado em até 60 dias.',
        ]
        
        message_count = 0
        for session in sessions:
            # Cada sessão tem entre 2 e 10 mensagens
            num_messages = random.randint(2, 10)
            
            for i in range(num_messages):
                is_user = i % 2 == 0
                
                Message.objects.create(
                    session=session,
                    role='user' if is_user else 'bot',
                    content=random.choice(user_messages if is_user else bot_messages),
                    edital=session.edital if random.random() > 0.5 else None
                )
                message_count += 1
        
        self.stdout.write(f'  ✓ Criadas {message_count} mensagens')
