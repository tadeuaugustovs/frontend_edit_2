from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.utils.dateparse import parse_datetime
from .models import ConversationSession, Message
from .serializers import (
    ConversationSessionListSerializer,
    ConversationSessionDetailSerializer,
    ConversationSessionSearchSerializer
)


class ConversationSessionPagination(PageNumberPagination):
    """
    Custom pagination for conversation sessions.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class SessionListView(generics.ListAPIView):
    """
    GET /api/history/sessions/
    List all conversation sessions with pagination.
    """
    queryset = ConversationSession.objects.all().select_related('edital')
    serializer_class = ConversationSessionListSerializer
    pagination_class = ConversationSessionPagination
    
    def get_queryset(self):
        """
        Optionally filter sessions by user_email query parameter.
        """
        queryset = super().get_queryset()
        user_email = self.request.query_params.get('user_email')
        
        if user_email:
            queryset = queryset.filter(user_email__icontains=user_email)
        
        return queryset


class SessionDetailView(generics.RetrieveAPIView):
    """
    GET /api/history/sessions/{id}/
    Retrieve session details with full message history.
    Messages are ordered chronologically by timestamp.
    """
    queryset = ConversationSession.objects.all().select_related('edital').prefetch_related('messages')
    serializer_class = ConversationSessionDetailSerializer
    lookup_field = 'id'
    
    def get_object(self):
        """
        Override to ensure messages are ordered chronologically.
        """
        obj = super().get_object()
        # Ensure messages are ordered chronologically (this is already set in the model Meta)
        # but we can explicitly prefetch them ordered
        return obj


@api_view(['GET'])
def session_search_view(request):
    """
    GET /api/history/sessions/search/
    Search conversation sessions with filtering by user email, date range, and edital.
    
    Query parameters:
    - user_email: Filter by user email (partial match)
    - start_date: Filter sessions starting after this date (ISO format)
    - end_date: Filter sessions starting before this date (ISO format)
    - edital_id: Filter by specific edital UUID
    - page: Page number for pagination
    - page_size: Number of results per page (max 100)
    """
    # Validate search parameters
    search_serializer = ConversationSessionSearchSerializer(data=request.query_params)
    if not search_serializer.is_valid():
        return Response(
            {'error': 'Invalid search parameters', 'details': search_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Build queryset with filters
    queryset = ConversationSession.objects.all().select_related('edital')
    
    # Apply filters based on validated data
    validated_data = search_serializer.validated_data
    
    if 'user_email' in validated_data:
        queryset = queryset.filter(user_email__icontains=validated_data['user_email'])
    
    if 'start_date' in validated_data:
        queryset = queryset.filter(start_time__gte=validated_data['start_date'])
    
    if 'end_date' in validated_data:
        queryset = queryset.filter(start_time__lte=validated_data['end_date'])
    
    if 'edital_id' in validated_data:
        queryset = queryset.filter(edital_id=validated_data['edital_id'])
    
    # Apply pagination
    paginator = ConversationSessionPagination()
    page = paginator.paginate_queryset(queryset, request)
    
    if page is not None:
        serializer = ConversationSessionListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    # If no pagination needed (shouldn't happen with our setup)
    serializer = ConversationSessionListSerializer(queryset, many=True)
    return Response(serializer.data)
