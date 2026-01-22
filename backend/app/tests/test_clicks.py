"""Click endpoint tests"""


def test_increment_clicks_default_delta(client, test_device_id):
    """Test incrementing clicks with default delta (1)"""
    response = client.post(
        "/api/v1/clicks/increment",
        json={"device_id": test_device_id}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["device_id"] == test_device_id
    assert data["my_clicks"] == 1
    assert data["global_clicks"] >= 1
    assert data["selected_cosmetic"] == "default"
    assert data["unlocked_cosmetics"] == ["default"]
    assert "occurred_at" in data
    assert data["schema_version"] == 1


def test_increment_clicks_custom_delta(client, test_device_id):
    """Test incrementing clicks with custom delta"""
    response = client.post(
        "/api/v1/clicks/increment",
        json={"device_id": test_device_id, "delta": 5}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["my_clicks"] == 5


def test_increment_clicks_multiple_times(client, test_device_id):
    """Test incrementing clicks multiple times accumulates"""
    # First increment
    response1 = client.post(
        "/api/v1/clicks/increment",
        json={"device_id": test_device_id, "delta": 3}
    )
    assert response1.status_code == 200
    assert response1.json()["my_clicks"] == 3
    
    # Second increment
    response2 = client.post(
        "/api/v1/clicks/increment",
        json={"device_id": test_device_id, "delta": 2}
    )
    assert response2.status_code == 200
    assert response2.json()["my_clicks"] == 5


def test_increment_clicks_invalid_delta_too_small(client, test_device_id):
    """Test that delta < 1 is rejected"""
    response = client.post(
        "/api/v1/clicks/increment",
        json={"device_id": test_device_id, "delta": 0}
    )
    assert response.status_code == 422  # Validation error


def test_increment_clicks_invalid_delta_too_large(client, test_device_id):
    """Test that delta > 10 is rejected"""
    response = client.post(
        "/api/v1/clicks/increment",
        json={"device_id": test_device_id, "delta": 11}
    )
    assert response.status_code == 422  # Validation error


def test_get_global_state(client):
    """Test getting global state"""
    response = client.get("/api/v1/state/global")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "global_clicks" in data
    assert data["global_clicks"] >= 0
    assert "updated_at" in data
    assert data["schema_version"] == 1