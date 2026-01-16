from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import (
    CustomTokenObtainPairSerializer,
    LoginSerializer,
    UserSerializer,
    UserRegistrationSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token obtain view that returns user information along with tokens.
    """
    serializer_class = CustomTokenObtainPairSerializer


class LoginView(generics.GenericAPIView):
    """
    Login view that accepts username/email and password, returns JWT tokens.
    """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Prepare response data
        user_serializer = UserSerializer(user)
        
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    """
    Logout view that blacklists the refresh token.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve and update user profile information.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserRegistrationView(generics.CreateAPIView):
    """
    View for user registration.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Return user data with tokens
        user_serializer = UserSerializer(user)
        
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'user': user_serializer.data,
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_token_view(request):
    """
    Custom refresh token view with additional validation.
    """
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        
        return Response({
            'access': str(access_token),
        }, status=status.HTTP_200_OK)
        
    except TokenError as e:
        return Response({'error': 'Invalid or expired refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)
