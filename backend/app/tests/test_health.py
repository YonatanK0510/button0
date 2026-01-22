"""Health endpoint tests"""


def test_liveness(client):
    """Test liveness endpoint"""
    response = client.get("/api/v1/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readiness(client):
    """Test readiness endpoint"""
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}