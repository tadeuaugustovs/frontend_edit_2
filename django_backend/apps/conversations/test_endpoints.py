from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from apps.conversations.models import ConversationSession, Message
from apps.editals.models import Edital
from datetime import datetime, timedelta
import uuid


class ConversationEndpointsTestCase(TestCase):
    """
    Test case for conversation history endpoints.
    """
    
    def setUp(self):
        """Set up test data."""
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Set up API client
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        # Create test edital
        self.edital = Edital.objects.create(
            title='Test Edital',
            description='Test description',
            status='open'
        )
        
        # Create test conversation sessions
        self.session1 = ConversationSession.objects.create(
            user_id='user123',
            user_email='user1@example.com',
            edital=self.edital,
            start_time=datetime.now() - timedelta(hours=2)
        )
        
        self.session2 = ConversationSession.objects.create(
            user_id='user456',
            user_email='user2@example.com',
            start_time=datetime.now() - timedelta(hours=1)
        )
        
        # Create test messages
        Message.objects.create(
            session=self.session1,
            role='user',
            content='Hello',
            timestamp=datetime.now() - timedelta(minutes=10)
        )
        
        Message.objects.create(
            session=self.session1,
            role='bot',
            content='Hi there!',
            timestamp=datetime.now() - timedelta(minutes=9)
        )
    
    def test_session_list_endpoint(self):
        """Test the session list endpoint."""
        url = reverse('conversations:session-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 2)
        
        # Check that sessions are ordered by start_time (newest first)
        sessions = response.data['results']
        self.assertTrue(sessions[0]['start_time'] > sessions[1]['start_time'])
    
    def test_session_detail_endpoint(self):
        """Test the session detail endpoint."""
        url = reverse('conversations:session-detail', kwargs={'id': self.session1.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(self.session1.id))
        self.assertIn('messages', response.data)
        self.assertEqual(len(response.data['messages']), 2)
        
        # Check chronological ordering of messages
        messages = response.data['messages']
        self.assertTrue(messages[0]['timestamp'] < messages[1]['timestamp'])
    
    def test_session_search_endpoint(self):
        """Test the session search endpoint."""
        url = reverse('conversations:session-search')
        
        # Test search by user email
        response = self.client.get(url, {'user_email': 'user1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['user_email'], 'user1@example.com')
        
        # Test search by edital_id
        response = self.client.get(url, {'edital_id': str(self.edital.id)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(str(response.data['results'][0]['edital']), str(self.edital.id))
    
    def test_session_search_validation(self):
        """Test search parameter validation."""
        url = reverse('conversations:session-search')
        
        # Test invalid date format
        response = self.client.get(url, {'start_date': 'invalid-date'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    def test_session_not_found(self):
        """Test 404 for non-existent session."""
        url = reverse('conversations:session-detail', kwargs={'id': uuid.uuid4()})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_pagination(self):
        """Test pagination functionality."""
        url = reverse('conversations:session-list')
        response = self.client.get(url, {'page_size': 1})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertIsNotNone(response.data['next'])