from fastapi import Request, status
from fastapi.responses import JSONResponse


class QuantBotException(Exception):
    def __init__(self, message: str, code: str = "BAD_REQUEST", status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(self.message)


class AuthenticationError(QuantBotException):
    def __init__(self, message: str = "Invalid credentials or token"):
        super().__init__(message=message, code="AUTH_FAILED", status_code=status.HTTP_401_UNAUTHORIZED)


class InsufficientFundsError(QuantBotException):
    def __init__(self, message: str = "Insufficient cash balance for this order"):
        super().__init__(message=message, code="INSUFFICIENT_FUNDS", status_code=status.HTTP_400_BAD_REQUEST)


class RiskLimitExceededError(QuantBotException):
    def __init__(self, message: str = "Order violates platform risk management rules"):
        super().__init__(message=message, code="RISK_LIMIT_EXCEEDED", status_code=status.HTTP_403_FORBIDDEN)


class ResourceNotFoundError(QuantBotException):
    def __init__(self, message: str = "Requested resource not found"):
        super().__init__(message=message, code="NOT_FOUND", status_code=status.HTTP_404_NOT_FOUND)


async def quantbot_exception_handler(request: Request, exc: QuantBotException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.message,
                "code": exc.code,
                "path": str(request.url.path)
            }
        }
    )
