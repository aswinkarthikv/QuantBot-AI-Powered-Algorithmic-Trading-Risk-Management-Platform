# QuantBot API Documentation

FastAPI automatically generates interactive Swagger & ReDoc documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/register` | Register new user account | ❌ |
| `POST` | `/api/v1/auth/login` | Authenticate user & obtain JWT token | ❌ |
| `GET` | `/api/v1/auth/me` | Fetch current user profile | ✅ |
| `PUT` | `/api/v1/auth/profile` | Update risk preferences & daily loss limit | ✅ |

---

## Portfolio Endpoints (`/api/v1/portfolio`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/portfolio` | Total valuation, cash balance & allocations | ✅ |
| `GET` | `/api/v1/portfolio/positions` | Active open positions and floating P/L | ✅ |
| `GET` | `/api/v1/portfolio/assets` | Tradable tickers and live asset prices | ❌ |

---

## Trading Engine Endpoints (`/api/v1/trading`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/trading/orders` | Execute Market or Limit order (BUY/SELL) | ✅ |
| `GET` | `/api/v1/trading/orders` | Fetch order history | ✅ |

---

## Strategy Lab Endpoints (`/api/v1/strategies`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/strategies` | List quantitative strategies | ✅ |
| `POST` | `/api/v1/strategies` | Create new quantitative strategy | ✅ |
| `POST` | `/api/v1/strategies/backtest` | Execute historical backtest simulation | ❌ |

---

## Risk Engine Endpoints (`/api/v1/risk`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/risk/metrics` | Live Quant Risk Score (0-100), drawdown & limits | ✅ |
| `POST` | `/api/v1/risk/position-size` | Kelly Criterion & Volatility Position Sizer | ❌ |

---

## AI Auditor Endpoints (`/api/v1/ai`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/ai/audit/{order_id}` | Trigger Claude AI evaluation for a trade | ✅ |
| `GET` | `/api/v1/ai/audits` | Fetch user AI trade audit history | ✅ |

---

## Analytics Endpoints (`/api/v1/analytics`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/analytics/performance` | Sharpe ratio, CAGR, equity curve & monthly matrix | ✅ |
