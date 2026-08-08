import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.exceptions import QuantBotException, quantbot_exception_handler
from app.api.v1.router import api_router
from app.seed import seed_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quantbot")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager to handle DB migrations and seeding on application startup."""
    logger.info("Initializing QuantBot Database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("Executing auto-seeder for demo environment...")
    async with AsyncSessionLocal() as session:
        await seed_data(session)

    yield

    logger.info("Shutting down QuantBot API service...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handler
app.add_exception_handler(QuantBotException, quantbot_exception_handler)

# Include master API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", status_code=status.HTTP_200_OK, tags=["Health Check"])
async def root():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }
