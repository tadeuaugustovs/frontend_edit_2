from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Edital, EditalMetadata, EditalFile
from .serializers import EditalSerializer, EditalListSerializer


class EditalListCreateView(generics.ListCreateAPIView):
    """
    List all editals or create a new edital.
    GET /api/editals/ - List editals with pagination and filtering
    POST /api/editals/ - Create new edital
    """
    queryset = Edital.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']  # Default ordering
    
    def get_serializer_class(self):
        """
        Use different serializers for list and create operations.
        """
        if self.request.method == 'GET':
            return EditalListSerializer
        return EditalSerializer
    
    def get_queryset(self):
        """
        Optionally filter editals by query parameters.
        """
        queryset = Edital.objects.all()
        
        # Additional filtering by title or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.prefetch_related('metadata', 'files')
    
    def create(self, request, *args, **kwargs):
        """
        Create a new edital with proper error handling.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        edital = serializer.save()
        
        # Return the created edital with full details
        response_serializer = EditalSerializer(edital)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class EditalDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a specific edital.
    GET /api/editals/{id}/ - Get edital details
    PUT /api/editals/{id}/ - Update edital
    DELETE /api/editals/{id}/ - Delete edital
    """
    queryset = Edital.objects.all()
    serializer_class = EditalSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        """
        Optimize queryset with prefetch_related for nested data.
        """
        return Edital.objects.prefetch_related('metadata', 'files')
    
    def update(self, request, *args, **kwargs):
        """
        Update edital with proper error handling.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        edital = serializer.save()
        
        # Return the updated edital with full details
        response_serializer = EditalSerializer(edital)
        return Response(response_serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete edital with confirmation response.
        """
        instance = self.get_object()
        edital_title = instance.title
        self.perform_destroy(instance)
        
        return Response({
            'message': f'Edital "{edital_title}" has been successfully deleted.'
        }, status=status.HTTP_200_OK)
