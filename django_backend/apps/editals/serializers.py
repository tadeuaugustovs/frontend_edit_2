from rest_framework import serializers
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


class EditalSerializer(serializers.ModelSerializer):
    """
    Serializer for Edital model with nested metadata and files.
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