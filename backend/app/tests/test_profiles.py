"""Profile endpoint tests"""


def test_get_profile_creates_if_not_exists(client, test_device_id):
    """Test that getting a profile creates it with defaults if it doesn't exist"""
    response = client.get(f"/api/v1/profiles/{test_device_id}")
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["device_id"] == test_device_id
    assert data["my_clicks"] == 0
    assert data["unlocked_cosmetics"] == ["default"]
    assert data["selected_cosmetic"] == "default"
    assert "created_at" in data
    assert "updated_at" in data
    assert data["schema_version"] == 1


def test_get_profile_returns_existing(client, test_device_id):
    """Test that getting a profile twice returns the same profile"""
    # First request creates profile
    response1 = client.get(f"/api/v1/profiles/{test_device_id}")
    data1 = response1.json()
    
    # Second request should return same profile
    response2 = client.get(f"/api/v1/profiles/{test_device_id}")
    data2 = response2.json()
    
    assert data1["device_id"] == data2["device_id"]
    assert data1["created_at"] == data2["created_at"]