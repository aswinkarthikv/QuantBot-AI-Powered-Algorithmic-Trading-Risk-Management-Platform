import pytest


@pytest.mark.asyncio
async def test_run_backtest(client):
    response = await client.post(
        "/api/v1/strategies/backtest",
        json={
            "symbol": "AAPL",
            "indicator_type": "RSI",
            "period": 14,
            "overbought": 70,
            "oversold": 30,
            "initial_capital": 10000.0
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "win_rate" in data
    assert "total_return_percent" in data
    assert "equity_curve" in data
