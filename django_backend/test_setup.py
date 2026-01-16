#!/usr/bin/env python
"""
Simple test script to verify Django setup is working correctly.
"""
import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings')
    django.setup()
    
    # Test that all apps are properly configured
    from django.apps import apps
    
    print("Testing Django setup...")
    print(f"Django version: {django.get_version()}")
    print(f"Database: {settings.DATABASES['default']['ENGINE']}")
    print(f"Debug mode: {settings.DEBUG}")
    print(f"Allowed hosts: {settings.ALLOWED_HOSTS}")
    print(f"CORS origins: {settings.CORS_ALLOWED_ORIGINS}")
    
    print("\nInstalled apps:")
    for app in settings.INSTALLED_APPS:
        if app.startswith('apps.'):
            print(f"  ✓ {app}")
    
    print("\nApp configurations:")
    for app_config in apps.get_app_configs():
        if app_config.name.startswith('apps.'):
            print(f"  ✓ {app_config.name} - {app_config.verbose_name}")
    
    print("\n✅ Django setup is working correctly!")