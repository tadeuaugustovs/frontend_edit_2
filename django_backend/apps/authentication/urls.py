from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # JWT Authentication endpoints
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoints
    path('me/', views.UserProfileView.as_view(), name='user_profile'),
    
    # User registration (optional, for testing)
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    
    # Alternative JWT endpoints (using DRF SimpleJWT directly)
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]