#!/usr/bin/env python
"""
Simple test script to verify CORS configuration is working
"""
import requests
import sys

def test_cors_configuration():
    """Test that CORS headers are properly configured"""
    try:
        # Test preflight request
        response = requests.options(
            'http://localhost:8002/api/',
            headers={
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'authorization,content-type'
            },
            timeout=5
        )
        
        print(f"Preflight response status: {response.status_code}")
        print("CORS headers in response:")
        for header, value in response.headers.items():
            if 'access-control' in header.lower():
                print(f"  {header}: {value}")
                
        return response.status_code == 200
        
    except requests.exceptions.ConnectionError:
        print("Server not running on port 8002")
        return False
    except Exception as e:
        print(f"Error testing CORS: {e}")
        return False

if __name__ == "__main__":
    print("Testing CORS configuration...")
    success = test_cors_configuration()
    sys.exit(0 if success else 1)