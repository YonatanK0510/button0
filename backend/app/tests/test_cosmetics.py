"""Cosmetic endpoint tests"""


def test_select_cosmetic_success(client, test_device_id):
    """Test selecting an unlocked cosmetic"""
    # Create profile first
    client.get(f"/api/v1/profiles/{test_device_id}")
    
    # Select default cosmetic (always unlocked)
    response = client.put(
        "/api/v1/cosmetics/selected",
        json={
            "device_id": test_device_id,
            "selected_cosmetic": "default"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["device_id"] == test_device_id
    assert data["selected_cosmetic"] == "default"
    assert "updated_at" in data
    assert data["schema_version"] == 1


def test_select_cosmetic_not_unlocked(client, test_device_id):
    """Test that selecting a locked cosmetic fails"""
    # Create profile first
    client.get(f"/api/v1/profiles/{test_device_id}")
    
    # Try to select a cosmetic that's not unlocked
    response = client.put(
        "/api/v1/cosmetics/selected",
        json={
            "device_id": test_device_id,
            "selected_cosmetic": "neon"
        }
    )
    
    assert response.status_code == 400
    assert "not unlocked" in response.json()["detail"]


def test_unlock_cosmetic(client, test_device_id):
    """Test unlocking a cosmetic"""
    # Create profile first
    client.get(f"/api/v1/profiles/{test_device_id}")
    
    # Unlock a cosmetic
    response = client.post(
        "/api/v1/cosmetics/unlock",
        json={
            "device_id": test_device_id,
            "cosmetic_id": "neon"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["device_id"] == test_device_id
    assert "neon" in data["unlocked_cosmetics"]
    assert "default" in data["unlocked_cosmetics"]
    assert "updated_at" in data
    assert data["schema_version"] == 1


def test_unlock_cosmetic_idempotent(client, test_device_id):
    """Test that unlocking the same cosmetic twice is idempotent"""
    # Create profile first
    client.get(f"/api/v1/profiles/{test_device_id}")
    
    # Unlock cosmetic first time
    response1 = client.post(
        "/api/v1/cosmetics/unlock",
        json={
            "device_id": test_device_id,
            "cosmetic_id": "neon"
        }
    )
    cosmetics1 = response1.json()["unlocked_cosmetics"]
    
    # Unlock same cosmetic second time
    response2 = client.post(
        "/api/v1/cosmetics/unlock",
        json={
            "device_id": test_device_id,
            "cosmetic_id": "neon"
        }
    )
    cosmetics2 = response2.json()["unlocked_cosmetics"]
    
    # Should have same cosmetics, no duplicates
    assert cosmetics1 == cosmetics2
    assert cosmetics2.count("neon") == 1


def test_select_after_unlock(client, test_device_id):
    """Test selecting a cosmetic after unlocking it"""
    # Create profile
    client.get(f"/api/v1/profiles/{test_device_id}")
    
    # Unlock cosmetic
    client.post(
        "/api/v1/cosmetics/unlock",
        json={
            "device_id": test_device_id,
            "cosmetic_id": "neon"
        }
    )
    
    # Now select it (should succeed)
    response = client.put(
        "/api/v1/cosmetics/selected",
        json={
            "device_id": test_device_id,
            "selected_cosmetic": "neon"
        }
    )
    
    assert response.status_code == 200
    assert response.json()["selected_cosmetic"] == "neon"