from django.urls import path
from .views import SessionListView, SessionDetailView, session_search_view

app_name = 'conversations'

urlpatterns = [
    # Session list endpoint with pagination
    path('sessions/', SessionListView.as_view(), name='session-list'),
    
    # Session detail endpoint with message history
    path('sessions/<uuid:id>/', SessionDetailView.as_view(), name='session-detail'),
    
    # Session search endpoint with filtering
    path('sessions/search/', session_search_view, name='session-search'),
]