import pytest


@pytest.mark.asyncio
async def test_submit_buy_order(client, auth_headers):
    response = await client.post(
        "/api/v1/trading/orders",
        json={
            "symbol": "AAPL",
            "side": "BUY",
            "order_type": "MARKET",
            "quantity": 10
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["symbol"] == "AAPL"
    assert data["side"] == "BUY"
    assert data["status"] == "EXECUTED"


@pytest.mark.asyncio
async def test_portfolio_summary(client, auth_headers):
    response = await client.get("/api/v1/portfolio", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "cash_balance" in data
    assert "total_equity" in data
    assert "allocations" in data
