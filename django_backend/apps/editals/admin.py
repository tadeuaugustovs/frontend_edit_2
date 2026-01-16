from django.contrib import admin
from .models import Edital, EditalMetadata, EditalFile


class EditalMetadataInline(admin.TabularInline):
    """Inline admin for edital metadata."""
    model = EditalMetadata
    extra = 1
    fields = ['key', 'value']


class EditalFileInline(admin.TabularInline):
    """Inline admin for edital files."""
    model = EditalFile
    extra = 1
    fields = ['file_type', 'name', 'original_name', 'url', 'file_size']


@admin.register(Edital)
class EditalAdmin(admin.ModelAdmin):
    """Admin configuration for Edital model."""
    list_display = ['title', 'status', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at', 'updated_at']
    search_fields = ['title', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']
    inlines = [EditalMetadataInline, EditalFileInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'status')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EditalMetadata)
class EditalMetadataAdmin(admin.ModelAdmin):
    """Admin configuration for EditalMetadata model."""
    list_display = ['edital', 'key', 'value_preview', 'created_at']
    list_filter = ['key', 'created_at']
    search_fields = ['edital__title', 'key', 'value']
    readonly_fields = ['created_at', 'updated_at']
    
    def value_preview(self, obj):
        """Show a preview of the value field."""
        return obj.value[:50] + '...' if len(obj.value) > 50 else obj.value
    value_preview.short_description = 'Value Preview'


@admin.register(EditalFile)
class EditalFileAdmin(admin.ModelAdmin):
    """Admin configuration for EditalFile model."""
    list_display = ['edital', 'name', 'file_type', 'file_size', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['edital__title', 'name', 'original_name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('edital', 'file_type', 'name', 'original_name')
        }),
        ('File Details', {
            'fields': ('url', 'file_size')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
