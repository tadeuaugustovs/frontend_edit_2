from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model.
    """
    class Meta:
        model = UserProfile
        fields = ['created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model with profile information.
    """
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile']
        read_only_fields = ['id', 'date_joined']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that includes user information in the response.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user information to the response
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        
        return data


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login with username/email and password.
    """
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            # Try to authenticate with username first, then email
            user = authenticate(username=username, password=password)
            
            if not user:
                # Try authenticating with email
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Invalid credentials.')
        else:
            raise serializers.ValidationError('Must include username and password.')


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user