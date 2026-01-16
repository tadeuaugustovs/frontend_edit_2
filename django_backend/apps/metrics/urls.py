from django.urls import path
from . import views

app_name = 'metrics'

urlpatterns = [
    path('engagement/', views.engagement_metrics, name='engagement'),
    path('messages/', views.messages_list, name='messages'),
]
