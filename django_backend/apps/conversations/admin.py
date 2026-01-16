from django.contrib import admin
from .models import ConversationSession, Message


@admin.register(ConversationSession)
class ConversationSessionAdmin(admin.ModelAdmin):
    """
    Admin interface for ConversationSession model.
    """
    list_display = ['id', 'user_email', 'edital', 'start_time', 'end_time', 'message_count']
    list_filter = ['start_time', 'end_time', 'edital']
    search_fields = ['user_email', 'user_id', 'edital__title']
    readonly_fields = ['id', 'created_at', 'updated_at', 'duration', 'message_count']
    date_hierarchy = 'start_time'
    ordering = ['-start_time']
    
    fieldsets = (
        ('Session Information', {
            'fields': ('id', 'user_id', 'user_email', 'edital')
        }),
        ('Timing', {
            'fields': ('start_time', 'end_time', 'duration')
        }),
        ('Statistics', {
            'fields': ('message_count',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """
    Admin interface for Message model.
    """
    list_display = ['id', 'session', 'role', 'content_preview', 'timestamp', 'edital']
    list_filter = ['role', 'timestamp', 'edital']
    search_fields = ['content', 'session__user_email', 'edital__title']
    readonly_fields = ['timestamp', 'is_user_message', 'is_bot_message']
    date_hierarchy = 'timestamp'
    ordering = ['-timestamp']
    
    fieldsets = (
        ('Message Information', {
            'fields': ('session', 'role', 'content', 'edital')
        }),
        ('Properties', {
            'fields': ('is_user_message', 'is_bot_message')
        }),
        ('Metadata', {
            'fields': ('timestamp',),
            'classes': ('collapse',)
        }),
    )
    
    def content_preview(self, obj):
        """Show a preview of the message content."""
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'
