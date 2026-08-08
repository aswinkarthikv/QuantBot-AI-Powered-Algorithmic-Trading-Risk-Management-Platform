# QuantBot System Architecture

QuantBot is engineered following **Clean Architecture**, the **Repository Pattern**, and strict separation of concerns between data access, business logic, and UI presentation layers.

```
+-----------------------------------------------------------------------------------+
|                                   REACT 19 FRONTEND                               |
|   (TypeScript + Tailwind CSS + Recharts + React Router + Axios + Context API)    |
+------------------------------------------+----------------------------------------+
                                           | REST API (JWT Bearer Auth)
                                           v
+-----------------------------------------------------------------------------------+
|                                 FASTAPI BACKEND                                   |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             API CONTROLLERS / ROUTERS                       |  |
|  |  /auth  |  /portfolio  |  /trading  |  /strategies  |  /risk  |  /ai  |  ...  |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |                                SERVICES LAYER                               |  |
|  |  - AuthService: Passlib/Bcrypt Hashing, PyJWT Management                    |  |
|  |  - TradingEngineService: Order Matching, Cash & Position Accounting         |  |
|  |  - StrategyService: Vectorized Indicators (SMA, EMA, RSI, MACD, Bollinger) |  |
|  |  - RiskEngineService: Kelly Criterion, Max Drawdown, Quant Risk Score (0-100)|  |
|  |  - AIAuditorService: Anthropic Claude 3.5 API + Quant Fallback Engine      |  |
|  |  - AnalyticsService: Time-series Equity Curve, Sharpe/Sortino Ratios         |  |
|  |  - NotificationService: Telegram Bot Webhooks & SMTP Dispatcher             |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |                               REPOSITORY LAYER                              |  |
|  |  - BaseRepository<T>: Async Generic CRUD Operations                         |  |
|  |  - UserRepository, PortfolioRepository, OrderRepository, AIAuditRepository  |  |
|  +-------------------------------------+---------------------------------------+  |
+----------------------------------------+------------------------------------------+
                                         | Async ORM
                                         v
                         +-------------------------------+
                         |      POSTGRESQL / SQLITE      |
                         |      (SQLAlchemy 2.0 Async)   |
                         +-------------------------------+
```

## Key Architectural Highlights

1. **Repository Pattern**: Decouples business domain logic from data persistence mechanisms, enabling effortless swapping between SQLite (zero-config local dev) and PostgreSQL/Supabase (production).
2. **Service Layer**: Houses all domain algorithms (Kelly position sizing, technical indicator vectors, drawdown calculations, AI prompt construction).
3. **Async Core**: Entire FastAPI backend runs asynchronously using `async/await` and SQLAlchemy's `AsyncSession`, ensuring high-concurrency throughput.
4. **AI Trade Auditor Fallback**: Integrates with Anthropic's Claude 3.5 Sonnet API via structured JSON outputs, while providing an intelligent rule-based fallback when no API key is specified.
