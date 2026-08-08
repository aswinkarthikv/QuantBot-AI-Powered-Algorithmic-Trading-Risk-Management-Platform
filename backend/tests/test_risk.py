import pytest


@pytest.mark.asyncio
async def test_get_risk_metrics(client, auth_headers):
    response = await client.get("/api/v1/risk/metrics", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_level" in data
    assert 0 <= data["risk_score"] <= 100


@pytest.mark.asyncio
async def test_position_sizing(client):
    response = await client.post(
        "/api/v1/risk/position-size",
        json={
            "account_balance": 100000.0,
            "win_rate": 0.65,
            "win_loss_ratio": 1.8,
            "asset_volatility": 0.02,
            "risk_per_trade_percent": 2.0
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "full_kelly_percent" in data
    assert "half_kelly_percent" in data
    assert data["half_kelly_percent"] > 0
