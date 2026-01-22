from rest_framework import serializers
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
import os
from .models import Edital, EditalMetadata, EditalFile


class EditalFileSerializer(serializers.ModelSerializer):
    """
    Serializer for EditalFile model.
    """
    class Meta:
        model = EditalFile
        fields = [
            'id', 'file_type', 'name', 'original_name', 'url', 
            'file_size', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class EditalMetadataSerializer(serializers.ModelSerializer):
    """
    Serializer for EditalMetadata model.
    """
    class Meta:
        model = EditalMetadata
        fields = ['id', 'key', 'value', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class EditalWithFilesSerializer(serializers.ModelSerializer):
    """
    Serializer for Edital model that handles file uploads via FormData.
    """
    # File fields
    main_pdf = serializers.FileField(required=False, write_only=True)
    main_pdf_display_name = serializers.CharField(required=False, write_only=True)
    
    # Metadata as JSON string
    metadata = serializers.CharField(required=False, write_only=True)
    
    # Read-only nested fields for response
    metadata_items = EditalMetadataSerializer(source='metadata', many=True, read_only=True)
    files = EditalFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = Edital
        fields = [
            'id', 'title', 'description', 'status', 
            'created_at', 'updated_at', 
            'main_pdf', 'main_pdf_display_name', 'metadata',
            'metadata_items', 'files'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """
        Create edital with file uploads and metadata.
        """
        # Extract file and metadata data
        main_pdf = validated_data.pop('main_pdf', None)
        main_pdf_display_name = validated_data.pop('main_pdf_display_name', '')
        metadata_json = validated_data.pop('metadata', '[]')
        
        # Create the edital
        edital = Edital.objects.create(**validated_data)
        
        # Parse and create metadata
        try:
            metadata_list = json.loads(metadata_json) if metadata_json else []
            for metadata_item in metadata_list:
                if isinstance(metadata_item, dict) and 'key' in metadata_item and 'value' in metadata_item:
                    EditalMetadata.objects.create(
                        edital=edital,
                        key=metadata_item['key'],
                        value=metadata_item['value']
                    )
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error parsing metadata: {e}")
        
        # Handle main PDF upload
        if main_pdf:
            try:
                # Save file to storage
                file_name = f"editals/{edital.id}/main_{main_pdf.name}"
                file_path = default_storage.save(file_name, ContentFile(main_pdf.read()))
                file_url = default_storage.url(file_path)
                
                # Create file record
                EditalFile.objects.create(
                    edital=edital,
                    file_type='main_pdf',
                    name=main_pdf_display_name or main_pdf.name,
                    original_name=main_pdf.name,
                    url=file_url,
                    file_size=main_pdf.size
                )
            except Exception as e:
                print(f"Error saving main PDF: {e}")
        
        return edital


class EditalSerializer(serializers.ModelSerializer):
    """
    Serializer for Edital model with nested metadata and files (JSON-based).
    """
    metadata = EditalMetadataSerializer(many=True, required=False)
    files = EditalFileSerializer(many=True, required=False)
    
    class Meta:
        model = Edital
        fields = [
            'id', 'title', 'description', 'status', 
            'created_at', 'updated_at', 'metadata', 'files'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """
        Create edital with nested metadata and files.
        """
        metadata_data = validated_data.pop('metadata', [])
        files_data = validated_data.pop('files', [])
        
        # Create the edital
        edital = Edital.objects.create(**validated_data)
        
        # Create metadata
        for metadata_item in metadata_data:
            EditalMetadata.objects.create(edital=edital, **metadata_item)
        
        # Create files
        for file_item in files_data:
            EditalFile.objects.create(edital=edital, **file_item)
        
        return edital
    
    def update(self, instance, validated_data):
        """
        Update edital with nested metadata and files.
        """
        metadata_data = validated_data.pop('metadata', None)
        files_data = validated_data.pop('files', None)
        
        # Update edital fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update metadata if provided
        if metadata_data is not None:
            # Clear existing metadata and create new ones
            instance.metadata.all().delete()
            for metadata_item in metadata_data:
                EditalMetadata.objects.create(edital=instance, **metadata_item)
        
        # Update files if provided
        if files_data is not None:
            # Clear existing files and create new ones
            instance.files.all().delete()
            for file_item in files_data:
                EditalFile.objects.create(edital=instance, **file_item)
        
        return instance


class EditalListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for edital list view (without nested data for performance).
    """
    metadata_count = serializers.SerializerMethodField()
    files_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Edital
        fields = [
            'id', 'title', 'description', 'status', 
            'created_at', 'updated_at', 'metadata_count', 'files_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_metadata_count(self, obj):
        """Get count of metadata items for this edital."""
        return obj.metadata.count()
    
    def get_files_count(self, obj):
        """Get count of files for this edital."""
        return obj.files.count()