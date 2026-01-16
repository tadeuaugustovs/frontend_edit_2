from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count
from apps.conversations.models import ConversationSession, Message
from apps.editals.models import Edital


class MessagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def engagement_metrics(request):
    """Retorna métricas de engajamento"""
    
    # Totais
    total_messages = Message.objects.count()
    total_users = ConversationSession.objects.values('user_email').distinct().count()
    total_editals = Edital.objects.count()
    
    # Por edital
    by_edital = []
    for edital in Edital.objects.all():
        message_count = Message.objects.filter(edital=edital).count()
        user_count = ConversationSession.objects.filter(edital=edital).values('user_email').distinct().count()
        
        by_edital.append({
            'edital_id': str(edital.id),
            'edital_title': edital.title,
            'message_count': message_count,
            'user_count': user_count
        })
    
    return Response({
        'total_messages': total_messages,
        'total_users': total_users,
        'total_editals': total_editals,
        'by_edital': by_edital
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def messages_list(request):
    """Lista mensagens com paginação e filtros"""
    
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 20))
    edital_id = request.GET.get('edital_id')
    
    messages = Message.objects.select_related('session', 'edital').all().order_by('-timestamp')
    
    if edital_id:
        messages = messages.filter(edital_id=edital_id)
    
    # Paginação
    start = (page - 1) * page_size
    end = start + page_size
    
    total = messages.count()
    messages_page = messages[start:end]
    
    results = []
    for msg in messages_page:
        results.append({
            'id': msg.id,
            'user_email': msg.session.user_email,
            'content': msg.content,
            'timestamp': msg.timestamp.isoformat(),
            'edital_id': str(msg.edital.id) if msg.edital else None,
            'edital_title': msg.edital.title if msg.edital else None
        })
    
    return Response({
        'count': total,
        'next': f'/api/metrics/messages/?page={page+1}&page_size={page_size}' if end < total else None,
        'previous': f'/api/metrics/messages/?page={page-1}&page_size={page_size}' if page > 1 else None,
        'results': results
    })
