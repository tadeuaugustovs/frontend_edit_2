from django.apps import AppConfig


class ConversationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.conversations'
    verbose_name = 'Conversations'
    
    def ready(self):
        """
        Perform initialization tasks when the app is ready.
        """
        pass
