"""
Test script to verify API is working with CORS
"""

import requests
import json

def test_health():
    """Test health endpoint"""
    print("=" * 60)
    print("Testing Health Endpoint")
    print("=" * 60)
    
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_analyze():
    """Test analyze endpoint"""
    print("\n" + "=" * 60)
    print("Testing Analyze Endpoint")
    print("=" * 60)
    
    test_data = {
        "content": "The chairman announced that his company will hire more female engineers.",
        "language": "en"
    }
    
    headers = {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000"
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/v1/analyze",
            json=test_data,
            headers=headers
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Analysis successful!")
            print(f"Analysis ID: {result.get('analysis_id')}")
            print(f"Overall Bias: {result.get('bias_detection', {}).get('bias_scores', {}).get('overall', 'N/A')}")
            return True
        else:
            print(f"❌ Error Response:")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_cors():
    """Test CORS headers"""
    print("\n" + "=" * 60)
    print("Testing CORS Headers")
    print("=" * 60)
    
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
    }
    
    try:
        response = requests.options(
            "http://localhost:8000/api/v1/analyze",
            headers=headers
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"CORS Headers:")
        for key, value in response.headers.items():
            if 'access-control' in key.lower():
                print(f"  {key}: {value}")
        
        return response.status_code in [200, 204]
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("\n🧪 FAIRMEDIA API Test Suite\n")
    
    results = []
    
    # Test 1: Health Check
    results.append(("Health Check", test_health()))
    
    # Test 2: CORS Preflight
    results.append(("CORS Preflight", test_cors()))
    
    # Test 3: Analyze Endpoint
    results.append(("Analyze Endpoint", test_analyze()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n🎉 All tests passed! API is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the output above.")
        print("\n💡 If CORS test failed, restart the backend:")
        print("   1. Stop backend (Ctrl+C)")
        print("   2. Run: python backend/main.py")
        print("   3. Run this test again: python test_api.py")
