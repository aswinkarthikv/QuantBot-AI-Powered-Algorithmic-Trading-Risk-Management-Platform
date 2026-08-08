import pytest


@pytest.mark.asyncio
async def test_register_user(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "newtrader@quantbot.com",
            "password": "Password123!",
            "full_name": "New Quant",
            "risk_tolerance": "MODERATE",
            "daily_loss_limit": 3000.0
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newtrader@quantbot.com"
    assert data["full_name"] == "New Quant"


@pytest.mark.asyncio
async def test_login_user(client, test_user):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "testtrader@quantbot.com", "password": "Password123!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_get_me(client, auth_headers):
    response = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testtrader@quantbot.com"
