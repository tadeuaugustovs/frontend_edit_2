import uuid
from django.db import models
from django.core.validators import URLValidator


class Edital(models.Model):
    """
    Main edital entity representing a public call for research proposals.
    """
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('draft', 'Draft'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, help_text="Title of the edital")
    description = models.TextField(help_text="Detailed description of the edital")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='draft',
        help_text="Current status of the edital"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Edital'
        verbose_name_plural = 'Editals'

    def __str__(self):
        return f"{self.title} ({self.status})"


class EditalMetadata(models.Model):
    """
    Dynamic metadata fields for editals to store additional key-value information.
    """
    edital = models.ForeignKey(
        Edital, 
        related_name='metadata', 
        on_delete=models.CASCADE,
        help_text="The edital this metadata belongs to"
    )
    key = models.CharField(
        max_length=100, 
        help_text="Metadata key (e.g., 'deadline', 'budget', 'category')"
    )
    value = models.TextField(help_text="Metadata value")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['edital', 'key']
        ordering = ['key']
        verbose_name = 'Edital Metadata'
        verbose_name_plural = 'Edital Metadata'

    def __str__(self):
        return f"{self.edital.title} - {self.key}: {self.value[:50]}"


class EditalFile(models.Model):
    """
    File attachments for editals with different types and metadata.
    """
    FILE_TYPES = [
        ('main_pdf', 'Main PDF'),
        ('annexe', 'Annexe'),
        ('result', 'Result'),
    ]
    
    edital = models.ForeignKey(
        Edital, 
        related_name='files', 
        on_delete=models.CASCADE,
        help_text="The edital this file belongs to"
    )
    file_type = models.CharField(
        max_length=20, 
        choices=FILE_TYPES,
        help_text="Type of file attachment"
    )
    name = models.CharField(
        max_length=255, 
        help_text="Display name for the file"
    )
    original_name = models.CharField(
        max_length=255, 
        help_text="Original filename when uploaded"
    )
    url = models.URLField(
        blank=True, 
        validators=[URLValidator()],
        help_text="URL to access the file (for mock data or external storage)"
    )
    file_size = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="File size in bytes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['file_type', 'name']
        verbose_name = 'Edital File'
        verbose_name_plural = 'Edital Files'

    def __str__(self):
        return f"{self.edital.title} - {self.name} ({self.file_type})"
