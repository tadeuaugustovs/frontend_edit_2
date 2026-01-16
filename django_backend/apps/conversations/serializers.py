from rest_framework import serializers
from .models import ConversationSession, Message
from apps.editals.serializers import EditalListSerializer


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for Message model.
    """
    class Meta:
        model = Message
        fields = [
            'id', 'role', 'content', 'timestamp', 'edital'
        ]
        read_only_fields = ['id', 'timestamp']


class ConversationSessionListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for conversation session list view.
    """
    edital_title = serializers.CharField(source='edital.title', read_only=True)
    message_count = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = ConversationSession
        fields = [
            'id', 'user_id', 'user_email', 'edital', 'edital_title',
            'start_time', 'end_time', 'message_count', 'duration',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        """Get count of messages in this session."""
        return obj.message_count
    
    def get_duration(self, obj):
        """Get session duration in seconds if available."""
        duration = obj.duration
        if duration:
            return duration.total_seconds()
        return None


class ConversationSessionDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for conversation session with full message history.
    """
    messages = MessageSerializer(many=True, read_only=True)
    edital = EditalListSerializer(read_only=True)
    message_count = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = ConversationSession
        fields = [
            'id', 'user_id', 'user_email', 'edital',
            'start_time', 'end_time', 'messages', 'message_count', 'duration',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        """Get count of messages in this session."""
        return obj.message_count
    
    def get_duration(self, obj):
        """Get session duration in seconds if available."""
        duration = obj.duration
        if duration:
            return duration.total_seconds()
        return None


class ConversationSessionSearchSerializer(serializers.Serializer):
    """
    Serializer for conversation session search parameters.
    """
    user_email = serializers.CharField(required=False, help_text="Partial email match")
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    edital_id = serializers.UUIDField(required=False)
    
    def validate(self, attrs):
        """
        Validate that start_date is before end_date if both are provided.
        """
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError(
                "start_date must be before end_date"
            )
        
        return attrs