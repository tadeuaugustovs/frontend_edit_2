import uuid
from django.db import models
from django.contrib.auth.models import User
from apps.editals.models import Edital


class ConversationSession(models.Model):
    """
    Chat session entity representing a conversation between a user and the chatbot.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(
        max_length=100, 
        help_text="External user identifier from the frontend"
    )
    user_email = models.EmailField(help_text="Email address of the user")
    edital = models.ForeignKey(
        Edital, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='conversation_sessions',
        help_text="The edital this conversation is related to"
    )
    start_time = models.DateTimeField(help_text="When the conversation session started")
    end_time = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="When the conversation session ended"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_time']
        verbose_name = 'Conversation Session'
        verbose_name_plural = 'Conversation Sessions'
        indexes = [
            models.Index(fields=['user_email']),
            models.Index(fields=['start_time']),
            models.Index(fields=['edital']),
        ]

    def __str__(self):
        edital_title = self.edital.title if self.edital else "No Edital"
        return f"Session {self.id} - {self.user_email} - {edital_title}"

    @property
    def duration(self):
        """Calculate session duration if end_time is set."""
        if self.end_time and self.start_time:
            return self.end_time - self.start_time
        return None

    @property
    def message_count(self):
        """Get the total number of messages in this session."""
        return self.messages.count()


class Message(models.Model):
    """
    Individual messages in conversations between users and the chatbot.
    """
    ROLE_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]
    
    session = models.ForeignKey(
        ConversationSession, 
        related_name='messages', 
        on_delete=models.CASCADE,
        help_text="The conversation session this message belongs to"
    )
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES,
        help_text="Whether this message is from the user or bot"
    )
    content = models.TextField(help_text="The message content")
    timestamp = models.DateTimeField(auto_now_add=True)
    edital = models.ForeignKey(
        Edital, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='messages',
        help_text="The edital this message is related to"
    )

    class Meta:
        ordering = ['timestamp']
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        indexes = [
            models.Index(fields=['session', 'timestamp']),
            models.Index(fields=['role']),
            models.Index(fields=['edital']),
        ]

    def __str__(self):
        content_preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"{self.role.title()}: {content_preview}"

    @property
    def is_user_message(self):
        """Check if this message is from a user."""
        return self.role == 'user'

    @property
    def is_bot_message(self):
        """Check if this message is from the bot."""
        return self.role == 'bot'
