from django.urls import path
from . import views

app_name = 'editals'

urlpatterns = [
    # Edital CRUD endpoints
    path('', views.EditalListCreateView.as_view(), name='edital_list_create'),
    path('<uuid:id>/', views.EditalDetailView.as_view(), name='edital_detail'),
]